import CommentsSection from './components/CommentsSection'
import ErrorBoundary from './components/ErrorBoundary'
import './styles/_main.less'

function App() {

  return (
    <ErrorBoundary>
      <CommentsSection />
    </ErrorBoundary>
  )
}

export default App
