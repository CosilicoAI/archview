import { useState, useMemo } from 'react'
import { motion } from 'motion/react'
import * as styles from './DocumentBrowser.css'
// ArchDocument interface moved to static JSON mode
interface ArchDocument {
  id: string
  jurisdiction: string
  source: string
  type: string
  format: string
  title: string
  archPath: string | null
  hasRac: boolean
  racPath: string | null
  citation: string | null
  text: string | null
  code: string | null
}

interface DocumentBrowserProps {
  documents: ArchDocument[]
  stats: Record<string, number>
  selectedIndex: number
  onSelect: (index: number) => void
  onClose: () => void
}

// Group documents by jurisdiction and type
function groupDocuments(documents: ArchDocument[]) {
  const groups: Record<string, { docs: Array<ArchDocument & { originalIndex: number }>; label: string; icon: string }> = {}

  documents.forEach((doc, index) => {
    let groupKey: string
    let groupLabel: string
    let icon: string

    if (doc.jurisdiction === 'canada') {
      groupKey = 'canada'
      groupLabel = 'Canada Federal Acts'
      icon = '🍁'
    } else if (doc.jurisdiction === 'uk') {
      groupKey = 'uk'
      groupLabel = 'UK Public General Acts'
      icon = '🇬🇧'
    } else if (doc.jurisdiction === 'us' && doc.hasRac) {
      // Group RAC-encoded US statutes by title
      const titleMatch = doc.id.match(/us\/(\d+)\//)
      if (titleMatch) {
        groupKey = `us-rac-${titleMatch[1]}`
        groupLabel = getTitleLabel(titleMatch[1])
        icon = '⚙️'
      } else {
        groupKey = 'us-rac-other'
        groupLabel = 'US Code - RAC Encoded'
        icon = '⚙️'
      }
    } else if (doc.jurisdiction === 'us' && doc.type === 'guidance') {
      groupKey = `us-federal-${doc.source}`
      groupLabel = getFederalSourceLabel(doc.source)
      icon = '📄'
    } else if (doc.jurisdiction.startsWith('us-')) {
      const state = doc.jurisdiction.replace('us-', '').toUpperCase()
      groupKey = `us-state-${state}`
      groupLabel = `${state} State Documents`
      icon = '🏛️'
    } else {
      groupKey = 'other'
      groupLabel = 'Other Documents'
      icon = '📁'
    }

    if (!groups[groupKey]) {
      groups[groupKey] = { docs: [], label: groupLabel, icon }
    }
    groups[groupKey].docs.push({ ...doc, originalIndex: index })
  })

  return groups
}

function getTitleLabel(title: string): string {
  const titles: Record<string, string> = {
    '7': 'Title 7 - Agriculture (SNAP)',
    '20': 'Title 20 - Education (Pell Grant)',
    '26': 'Title 26 - Internal Revenue Code',
    '42': 'Title 42 - Public Health & Welfare',
  }
  return `${titles[title] || `Title ${title}`} - RAC`
}

function getFederalSourceLabel(source: string): string {
  const sources: Record<string, string> = {
    'fns': 'FNS - Food & Nutrition (SNAP)',
    'acf': 'ACF - Children & Families (TANF/LIHEAP)',
    'aspe': 'ASPE - Poverty Guidelines',
    'medicaid': 'CMS - Medicaid',
    'irs': 'IRS - Tax Guidance',
  }
  return sources[source] || `Federal - ${source.toUpperCase()}`
}

function getFormatBadge(format: string, hasRac: boolean): { text: string; color: string } {
  if (hasRac) return { text: 'RAC', color: '#00ff88' }
  if (format === 'xml') return { text: 'XML', color: '#00d4ff' }
  if (format === 'pdf') return { text: 'PDF', color: '#ffaa00' }
  return { text: format.toUpperCase(), color: '#888' }
}

export function DocumentBrowser({ documents, stats, selectedIndex, onSelect }: DocumentBrowserProps) {
  const [search, setSearch] = useState('')
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['us-rac-26', 'us-rac-7']))
  const [jurisdictionFilter, setJurisdictionFilter] = useState<string | null>(null)

  const groups = useMemo(() => groupDocuments(documents), [documents])

  const filteredGroups = useMemo(() => {
    let filtered = { ...groups }

    // Apply jurisdiction filter
    if (jurisdictionFilter) {
      filtered = Object.fromEntries(
        Object.entries(filtered).filter(([key]) => {
          if (jurisdictionFilter === 'rac') return key.includes('-rac-')
          if (jurisdictionFilter === 'us') return key.startsWith('us-')
          return key.startsWith(jurisdictionFilter)
        })
      )
    }

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase()
      const searchFiltered: typeof groups = {}

      Object.entries(filtered).forEach(([key, group]) => {
        const matchingDocs = group.docs.filter(
          (doc) =>
            (doc.citation?.toLowerCase() || '').includes(searchLower) ||
            doc.title.toLowerCase().includes(searchLower) ||
            doc.id.toLowerCase().includes(searchLower)
        )
        if (matchingDocs.length > 0) {
          searchFiltered[key] = { ...group, docs: matchingDocs }
        }
      })
      filtered = searchFiltered
    }

    return filtered
  }, [groups, search, jurisdictionFilter])

  const toggleGroup = (key: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }

  const totalFiltered = Object.values(filteredGroups).reduce((sum, g) => sum + g.docs.length, 0)

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoAccent}>{'{'}</span>
          Arch
          <span className={styles.logoAccent}>{'}'}</span>
        </div>
        <div className={styles.stats}>
          {totalFiltered.toLocaleString()} of {documents.length.toLocaleString()} documents
        </div>
      </header>

      {/* Stats bar */}
      <div className={styles.statsBar}>
        <button
          className={`${styles.statButton} ${!jurisdictionFilter ? styles.statButtonActive : ''}`}
          onClick={() => setJurisdictionFilter(null)}
        >
          All ({documents.length.toLocaleString()})
        </button>
        <button
          className={`${styles.statButton} ${jurisdictionFilter === 'rac' ? styles.statButtonActive : ''}`}
          onClick={() => setJurisdictionFilter('rac')}
        >
          RAC ({stats.rac_encoded})
        </button>
        <button
          className={`${styles.statButton} ${jurisdictionFilter === 'canada' ? styles.statButtonActive : ''}`}
          onClick={() => setJurisdictionFilter('canada')}
        >
          Canada ({stats.canada})
        </button>
        <button
          className={`${styles.statButton} ${jurisdictionFilter === 'uk' ? styles.statButtonActive : ''}`}
          onClick={() => setJurisdictionFilter('uk')}
        >
          UK ({stats.uk})
        </button>
        <button
          className={`${styles.statButton} ${jurisdictionFilter === 'us' ? styles.statButtonActive : ''}`}
          onClick={() => setJurisdictionFilter('us')}
        >
          US ({stats.us_federal + stats.us_state + stats.rac_encoded})
        </button>
      </div>

      <div className={styles.searchContainer}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search statutes, sections, or keywords..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          autoFocus
        />
      </div>

      <div className={styles.content}>
        {Object.entries(filteredGroups)
          .sort(([a], [b]) => {
            // Sort RAC groups first, then by key
            const aIsRac = a.includes('-rac-')
            const bIsRac = b.includes('-rac-')
            if (aIsRac && !bIsRac) return -1
            if (!aIsRac && bIsRac) return 1
            return a.localeCompare(b)
          })
          .map(([key, group]) => (
            <motion.div
              key={key}
              className={styles.group}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <button className={styles.groupHeader} onClick={() => toggleGroup(key)}>
                <span className={styles.groupChevron}>{expandedGroups.has(key) ? '▼' : '▶'}</span>
                <span className={styles.groupIcon}>{group.icon}</span>
                <span className={styles.groupLabel}>{group.label}</span>
                <span className={styles.groupCount}>{group.docs.length}</span>
              </button>

              {expandedGroups.has(key) && (
                <div className={styles.groupContent}>
                  {group.docs.map((doc) => {
                    const badge = getFormatBadge(doc.format, doc.hasRac)
                    return (
                      <motion.button
                        key={doc.originalIndex}
                        className={`${styles.docItem} ${doc.originalIndex === selectedIndex ? styles.docItemSelected : ''}`}
                        onClick={() => onSelect(doc.originalIndex)}
                        whileHover={{ x: 4 }}
                        transition={{ duration: 0.15 }}
                      >
                        <span className={styles.docBadge} style={{ color: badge.color }}>
                          {badge.text}
                        </span>
                        <span className={styles.docCitation}>{doc.citation || doc.id}</span>
                        <span className={styles.docTitle}>{doc.title}</span>
                      </motion.button>
                    )
                  })}
                </div>
              )}
            </motion.div>
          ))}
      </div>

      <footer className={styles.footer}>
        <span className={styles.footerText}>
          {jurisdictionFilter === 'rac'
            ? 'Showing RAC-encoded documents with executable code'
            : 'Select a document to view details'}
        </span>
      </footer>
    </div>
  )
}
