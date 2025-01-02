import { useEvaluationStore } from '../store/evaluationStore'
import { useEffect, useState } from 'react'

export function ResponseComparison() {
  const { responses, metrics } = useEvaluationStore()
  const [displayedResponses, setDisplayedResponses] = useState<typeof responses>(
    Object.keys(responses).reduce((acc, key) => ({ ...acc, [key]: '' }), {} as typeof responses)
  )

  useEffect(() => {
    Object.entries(responses).forEach(([model, response]) => {
      if (response) {
        let index = 0
        const interval = setInterval(() => {
          if (index < response.length) {
            setDisplayedResponses(prev => ({
              ...prev,
              [model]: response.slice(0, index + 1)
            }))
            index++
          } else {
            clearInterval(interval)
          }
        }, 20) // Adjust speed as needed
        return () => clearInterval(interval)
      }
    })
  }, [responses])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {Object.entries(displayedResponses).map(([model, response]) => (
        <div key={model} 
             className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700
                        hover:border-blue-500 transition-all duration-200">
          <h3 className="text-xl font-semibold mb-4 text-blue-400">
            {model.toUpperCase()}
          </h3>
          <div className="h-[300px] overflow-y-auto mb-4 prose prose-invert">
            <p className="text-gray-300 whitespace-pre-wrap">{response}</p>
          </div>
          <div className="flex justify-between items-center pt-4 border-t border-gray-700">
            <span className="text-gray-400">
              ⏱️ {metrics[model as keyof typeof metrics].time.toFixed(2)}s
            </span>
            <span className="text-gray-400">
              📊 {(metrics[model as keyof typeof metrics].accuracy * 100).toFixed(1)}%
            </span>
          </div>
        </div>
      ))}
    </div>
  )
} 