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

  const documents = racsData.documents as RacDocument[]

  const currentDoc = useMemo(
    () => transformToViewerDoc(documents[selectedIndex]),
    [documents, selectedIndex]
  )

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
          />
        )}
      </div>
    </>
  )
}

export default App
