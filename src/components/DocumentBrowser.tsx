import { useState, useMemo } from 'react'
import { motion } from 'motion/react'
import * as styles from './DocumentBrowser.css'

interface Document {
  citation: string
  title: string
  text: string
  code: string
  path: string
}

interface DocumentBrowserProps {
  documents: Document[]
  selectedIndex: number
  onSelect: (index: number) => void
  onClose: () => void
}

// Group documents by title (US Code title or jurisdiction)
function groupDocuments(documents: Document[]) {
  const groups: Record<string, { docs: Array<Document & { originalIndex: number }>; label: string }> = {}

  documents.forEach((doc, index) => {
    // Extract title from path or citation
    let groupKey = 'Other'
    let groupLabel = 'Other Documents'

    if (doc.path.includes('cosilico-us')) {
      const match = doc.path.match(/statute\/(\d+)\//)
      if (match) {
        groupKey = `us-${match[1]}`
        groupLabel = getTitleLabel(match[1])
      }
    } else if (doc.path.includes('cosilico-ca')) {
      groupKey = 'ca'
      groupLabel = 'Canada - Income Tax Act & Benefits'
    }

    if (!groups[groupKey]) {
      groups[groupKey] = { docs: [], label: groupLabel }
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
  return titles[title] || `Title ${title} - US Code`
}

export function DocumentBrowser({ documents, selectedIndex, onSelect }: DocumentBrowserProps) {
  const [search, setSearch] = useState('')
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['us-26', 'us-7']))

  const groups = useMemo(() => groupDocuments(documents), [documents])

  const filteredGroups = useMemo(() => {
    if (!search) return groups

    const filtered: typeof groups = {}
    const searchLower = search.toLowerCase()

    Object.entries(groups).forEach(([key, group]) => {
      const matchingDocs = group.docs.filter(
        (doc) =>
          doc.citation.toLowerCase().includes(searchLower) ||
          doc.title.toLowerCase().includes(searchLower) ||
          doc.text.toLowerCase().includes(searchLower)
      )
      if (matchingDocs.length > 0) {
        filtered[key] = { ...group, docs: matchingDocs }
      }
    })

    return filtered
  }, [groups, search])

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
          {totalFiltered} of {documents.length} documents
        </div>
      </header>

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
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([key, group]) => (
            <motion.div
              key={key}
              className={styles.group}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <button className={styles.groupHeader} onClick={() => toggleGroup(key)}>
                <span className={styles.groupChevron}>{expandedGroups.has(key) ? '▼' : '▶'}</span>
                <span className={styles.groupLabel}>{group.label}</span>
                <span className={styles.groupCount}>{group.docs.length}</span>
              </button>

              {expandedGroups.has(key) && (
                <div className={styles.groupContent}>
                  {group.docs.map((doc) => (
                    <motion.button
                      key={doc.originalIndex}
                      className={`${styles.docItem} ${doc.originalIndex === selectedIndex ? styles.docItemSelected : ''}`}
                      onClick={() => onSelect(doc.originalIndex)}
                      whileHover={{ x: 4 }}
                      transition={{ duration: 0.15 }}
                    >
                      <span className={styles.docCitation}>{doc.citation}</span>
                      <span className={styles.docTitle}>{doc.title}</span>
                      {doc.text && <span className={styles.docPreview}>{doc.text.slice(0, 100)}...</span>}
                    </motion.button>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
      </div>

      <footer className={styles.footer}>
        <span className={styles.footerText}>Select a document to view statute text and RAC encoding</span>
      </footer>
    </div>
  )
}
