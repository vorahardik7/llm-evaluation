import { PromptInput } from './components/PromptInput'
import { ResponseView } from './components/ResponseView'
import { MetricsChart } from './components/MetricsChart'
import { SuggestedPrompts } from './components/SuggestedPrompts'

function App() {
  return (
    <div className="min-h-screen bg-[#0C0C0C] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-orange-600">
          LLM Evaluation Platform
        </h1>
        <div className="space-y-10">
          <div>
            <PromptInput />
            <SuggestedPrompts />
          </div>
          <ResponseView />
          <MetricsChart />
        </div>
      </div>
    </div>
  )
}

export default App
