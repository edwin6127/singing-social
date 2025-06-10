import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import DanceAuth from './components/DanceAuth'
import './index.css'
import { LanguageSwitcher } from './components/ui/language-switcher'
import { BackgroundMusic } from './components/ui/background-music'
import { useTranslation } from 'react-i18next'

const queryClient = new QueryClient()

function App() {
  const { t } = useTranslation()

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
        <LanguageSwitcher />
        <BackgroundMusic />
        <DanceAuth />
      </div>
    </QueryClientProvider>
  )
}

export default App
