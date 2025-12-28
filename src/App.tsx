import { DocumentViewer } from './components/DocumentViewer'
import { sampleDocument } from './data/sampleDocument'
import { gridBg, appContainer } from './styles/global.css'

function App() {
  return (
    <>
      <div className={gridBg} />
      <div className={appContainer}>
        <DocumentViewer document={sampleDocument} />
      </div>
    </>
  )
}

export default App
