import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import DanceAuth from './components/DanceAuth'
import './index.css'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
        <DanceAuth />
      </div>
    </QueryClientProvider>
  )
}

export default App
