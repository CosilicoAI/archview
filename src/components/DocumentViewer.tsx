import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import * as styles from './DocumentViewer.css'

interface Subsection {
  id: string
  text: string
  codeLines: number[]
}

interface Document {
  citation: string
  title: string
  subsections: Subsection[]
  code: string
}

interface DocumentViewerProps {
  document: Document
  onBack?: () => void
  totalDocs?: number
  currentIndex?: number
  onNavigate?: (index: number) => void
}

type ViewMode = 'split' | 'statute' | 'rac'

export function DocumentViewer({
  document,
  onBack,
  totalDocs,
  currentIndex,
  onNavigate,
}: DocumentViewerProps) {
  const [highlightedSection, setHighlightedSection] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<ViewMode>('split')

  const handleSectionHover = useCallback((sectionId: string | null) => {
    setHighlightedSection(sectionId)
  }, [])

  const codeLines = document.code.split('\n')

  const highlightedLines = highlightedSection
    ? document.subsections.find((s) => s.id === highlightedSection)?.codeLines ?? []
    : []

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          {onBack && (
            <button className={styles.backButton} onClick={onBack} title="Back to browser">
              ←
            </button>
          )}
          <div className={styles.logo}>
            <span className={styles.logoAccent}>{'{'}</span>
            Arch
            <span className={styles.logoAccent}>{'}'}</span>
          </div>
        </div>

        <div className={styles.headerCenter}>
          {onNavigate && currentIndex !== undefined && totalDocs && (
            <button
              className={styles.navButton}
              onClick={() => onNavigate(Math.max(0, currentIndex - 1))}
              disabled={currentIndex === 0}
            >
              ‹
            </button>
          )}
          <div className={styles.citation}>{document.citation}</div>
          {onNavigate && currentIndex !== undefined && totalDocs && (
            <button
              className={styles.navButton}
              onClick={() => onNavigate(Math.min(totalDocs - 1, currentIndex + 1))}
              disabled={currentIndex === totalDocs - 1}
            >
              ›
            </button>
          )}
        </div>

        <div className={styles.viewToggle}>
          <button
            className={`${styles.viewButton} ${viewMode === 'statute' ? styles.viewButtonActive : ''}`}
            onClick={() => setViewMode('statute')}
          >
            Statute
          </button>
          <button
            className={`${styles.viewButton} ${viewMode === 'split' ? styles.viewButtonActive : ''}`}
            onClick={() => setViewMode('split')}
          >
            Split
          </button>
          <button
            className={`${styles.viewButton} ${viewMode === 'rac' ? styles.viewButtonActive : ''}`}
            onClick={() => setViewMode('rac')}
          >
            RAC
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.main}>
        <AnimatePresence mode="wait">
          {/* Statute Panel */}
          {(viewMode === 'split' || viewMode === 'statute') && (
            <motion.div
              key="statute-panel"
              className={`${styles.panel} ${viewMode === 'split' ? styles.panelLeft : ''}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className={styles.panelHeader}>
                <span className={styles.panelTitle}>
                  <span className={styles.panelTitleAccent}>//</span> Statute Text
                </span>
              </div>

              <div className={styles.panelContent}>
                <h1 className={styles.statuteTitle}>{document.title}</h1>

                {document.subsections.map((subsection, index) => (
                  <motion.div
                    key={subsection.id}
                    className={`${styles.subsection} ${
                      highlightedSection === subsection.id ? styles.subsectionHighlighted : ''
                    }`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                    onMouseEnter={() => handleSectionHover(subsection.id)}
                    onMouseLeave={() => handleSectionHover(null)}
                  >
                    <div className={styles.subsectionId}>({subsection.id})</div>
                    <div className={styles.subsectionText}>
                      <HighlightedText text={subsection.text} />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Divider */}
          {viewMode === 'split' && <div className={styles.divider} />}

          {/* Code Panel */}
          {(viewMode === 'split' || viewMode === 'rac') && (
            <motion.div
              key="rac-panel"
              className={styles.panel}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className={styles.panelHeader}>
                <span className={styles.panelTitle}>
                  <span className={styles.panelTitleAccent}>//</span> RAC Encoding
                </span>
              </div>

              <div className={styles.panelContent}>
                <pre className={styles.codeBlock}>
                  {codeLines.map((line, index) => (
                    <CodeLine
                      key={index}
                      line={line}
                      lineNumber={index + 1}
                      highlighted={highlightedLines.includes(index + 1)}
                    />
                  ))}
                </pre>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Status Bar */}
      <footer className={styles.statusBar}>
        <div className={styles.statusItem}>
          <span className={styles.statusDot} />
          <span>Connected to Arch</span>
        </div>
        <div className={styles.statusItem}>
          <span>{document.subsections.length} subsections</span>
          <span>|</span>
          <span>{codeLines.length} lines</span>
        </div>
      </footer>
    </div>
  )
}

// Subcomponents

function HighlightedText({ text }: { text: string }) {
  // Highlight defined terms in quotes
  const parts = text.split(/("(?:[^"\\]|\\.)*")/g)

  return (
    <>
      {parts.map((part, i) =>
        part.startsWith('"') && part.endsWith('"') ? (
          <span key={i} className={styles.highlightedTerm}>
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  )
}

interface CodeLineProps {
  line: string
  lineNumber: number
  highlighted: boolean
}

function CodeLine({ line, highlighted }: CodeLineProps) {
  // Apply syntax highlighting
  const highlightedLine = highlightCode(line)

  return (
    <span className={`${styles.codeLine} ${highlighted ? styles.codeLineHighlighted : ''}`}>
      {highlightedLine}
      {'\n'}
    </span>
  )
}

function highlightCode(line: string): React.ReactNode[] {
  const tokens: React.ReactNode[] = []
  let remaining = line
  let key = 0

  const patterns: [RegExp, string][] = [
    // Comments
    [/^(#.*)/, styles.codeComment],
    // Keywords
    [/^(variable|parameter|formula|if|else|where|for|in|and|or|not|return)\b/, styles.codeKeyword],
    // Types
    [/^(Money|Rate|Boolean|Integer|Date|Person|TaxUnit|Household|Year|Month)\b/, styles.codeType],
    // Strings
    [/^("[^"]*"|'[^']*')/, styles.codeString],
    // Numbers
    [/^(\d+\.?\d*)/, styles.codeNumber],
    // Variables (words after variable keyword or assignments)
    [/^([a-z_][a-z0-9_]*)\s*(?==)/, styles.codeVariable],
  ]

  while (remaining.length > 0) {
    let matched = false

    for (const [pattern, className] of patterns) {
      const match = remaining.match(pattern)
      if (match) {
        tokens.push(
          <span key={key++} className={className}>
            {match[1]}
          </span>
        )
        remaining = remaining.slice(match[1].length)
        matched = true
        break
      }
    }

    if (!matched) {
      // Take one character and continue
      tokens.push(<span key={key++}>{remaining[0]}</span>)
      remaining = remaining.slice(1)
    }
  }

  return tokens
}
