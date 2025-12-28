import { useState, useMemo } from 'react'
import { DocumentViewer } from './components/DocumentViewer'
import { DocumentBrowser } from './components/DocumentBrowser'
import { gridBg, appContainer } from './styles/global.css'
import racsData from './data/racs.json'

// Transform RAC data to viewer format
interface RacDocument {
  citation: string
  title: string
  text: string
  code: string
  path: string
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
}

function transformToViewerDoc(rac: RacDocument): ViewerDocument {
  // Parse the RAC text into subsections
  const subsections: ViewerDocument['subsections'] = []

  if (rac.text) {
    // Split by paragraph or use as single block
    const paragraphs = rac.text.split(/\n\n+/).filter(Boolean)
    paragraphs.forEach((para, i) => {
      subsections.push({
        id: String.fromCharCode(97 + i), // a, b, c, etc.
        text: para.trim(),
        codeLines: [], // TODO: map to actual code lines
      })
    })
  }

  // If no text, create a subsection from the title
  if (subsections.length === 0) {
    subsections.push({
      id: 'a',
      text: rac.title || 'No statute text available for this section.',
      codeLines: [],
    })
  }

  return {
    citation: rac.citation,
    title: rac.title,
    subsections,
    code: rac.code,
  }
}

function App() {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [showBrowser, setShowBrowser] = useState(true)
  const [navigationHistory, setNavigationHistory] = useState<number[]>([])

  const documents = racsData.documents as RacDocument[]

  const currentDoc = useMemo(
    () => transformToViewerDoc(documents[selectedIndex]),
    [documents, selectedIndex]
  )

  // Navigate to a RAC by its import path (e.g., "26/62/a#agi" or "7/2014/a")
  const handleNavigateToPath = (importPath: string) => {
    // Remove the #variable part if present
    const basePath = importPath.split('#')[0]

    // Find a document whose path contains this import path
    // Import: "26/62/a" should match path: "cosilico-us/statute/26/62/a.rac"
    const foundIndex = documents.findIndex((doc) => {
      const docPath = doc.path
        .replace(/^cosilico-(us|ca)\/statute\//, '')
        .replace(/\.(rac|cosilico)$/, '')
      return docPath === basePath || docPath.startsWith(basePath + '/')
    })

    if (foundIndex !== -1) {
      // Save current position to history for back navigation
      setNavigationHistory((prev) => [...prev, selectedIndex])
      setSelectedIndex(foundIndex)
    } else {
      // Could not find - maybe show a toast or console log
      console.log(`Could not find RAC for path: ${importPath}`)
    }
  }

  return (
    <>
      <div className={gridBg} />
      <div className={appContainer}>
        {showBrowser ? (
          <DocumentBrowser
            documents={documents}
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
