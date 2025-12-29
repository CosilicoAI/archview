import { useState, useMemo } from 'react'
import { DocumentViewer } from './components/DocumentViewer'
import { DocumentBrowser } from './components/DocumentBrowser'
import { gridBg, appContainer } from './styles/global.css'
import documentsData from './data/documents.json'

// New unified document interface
export interface ArchDocument {
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

interface ViewerDocument {
  citation: string
  title: string
  subsections: Array<{
    id: string
    text: string
    codeLines: number[]
  }>
  code: string
  hasRac: boolean
  format: string
  jurisdiction: string
  archPath: string | null
}

function transformToViewerDoc(doc: ArchDocument): ViewerDocument {
  const subsections: ViewerDocument['subsections'] = []

  if (doc.text) {
    const paragraphs = doc.text.split(/\n\n+/).filter(Boolean)
    paragraphs.forEach((para, i) => {
      subsections.push({
        id: String.fromCharCode(97 + i),
        text: para.trim(),
        codeLines: [],
      })
    })
  }

  // If no text, create a subsection from the title
  if (subsections.length === 0) {
    const message = doc.hasRac
      ? doc.title || 'No statute text available for this section.'
      : doc.format === 'xml'
        ? 'XML statute - full text available in source file.'
        : doc.format === 'pdf'
          ? 'PDF document - open the source file to view content.'
          : doc.title || 'No content preview available.'

    subsections.push({
      id: 'a',
      text: message,
      codeLines: [],
    })
  }

  return {
    citation: doc.citation || doc.id,
    title: doc.title,
    subsections,
    code: doc.code || '',
    hasRac: doc.hasRac,
    format: doc.format,
    jurisdiction: doc.jurisdiction,
    archPath: doc.archPath,
  }
}

function App() {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [showBrowser, setShowBrowser] = useState(true)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_navigationHistory, setNavigationHistory] = useState<number[]>([])

  const documents = documentsData.documents as ArchDocument[]
  const stats = documentsData.stats as Record<string, number>

  const currentDoc = useMemo(
    () => transformToViewerDoc(documents[selectedIndex]),
    [documents, selectedIndex]
  )

  // Navigate to a RAC by its import path (e.g., "26/62/a#agi" or "7/2014/a")
  const handleNavigateToPath = (importPath: string) => {
    const basePath = importPath.split('#')[0]

    // Find a document whose id matches this import path
    const foundIndex = documents.findIndex((doc) => {
      // For US RAC documents, match against id like "us/26/62/a"
      const docPath = doc.id.replace(/^us\//, '')
      return docPath === basePath || docPath.startsWith(basePath + '/')
    })

    if (foundIndex !== -1) {
      setNavigationHistory((prev) => [...prev, selectedIndex])
      setSelectedIndex(foundIndex)
    } else {
      console.log(`Could not find document for path: ${importPath}`)
    }
  }

  return (
    <>
      <div className={gridBg} />
      <div className={appContainer}>
        {showBrowser ? (
          <DocumentBrowser
            documents={documents}
            stats={stats}
            selectedIndex={selectedIndex}
            onSelect={(index) => {
              setSelectedIndex(index)
              setNavigationHistory([])
              setShowBrowser(false)
            }}
            onClose={() => setShowBrowser(false)}
          />
        ) : (
          <DocumentViewer
            document={currentDoc}
            onBack={() => setShowBrowser(true)}
            totalDocs={documents.length}
            currentIndex={selectedIndex}
            onNavigate={setSelectedIndex}
            onNavigateToPath={handleNavigateToPath}
          />
        )}
      </div>
    </>
  )
}

export default App
