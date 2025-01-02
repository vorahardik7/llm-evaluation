import { useEvaluationStore } from '../store/evaluationStore'
import { getGeminiResponse, getGPT35Response, getMistralResponse, getLlamaResponse } from '../services/llmServices'
import { useState } from 'react'
import { calculateMetrics } from '../services/metricsService'

export function PromptInput() {
  const { setPrompt, setResponses, setModelStatus } = useEvaluationStore()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const prompt = formData.get('prompt') as string
    setPrompt(prompt)
    setLoading(true)

    setModelStatus({
      gemini: 'loading',
      gpt4: 'loading',
      mixtral: 'loading',
      llama: 'loading'
    })

    const modelRequests = [
      getGeminiResponse(prompt).then(result => {
        const metrics = calculateMetrics(result.response, result.time, prompt, 'gemini');
        setResponses('gemini', result.response, metrics);
      }),
      getGPT35Response(prompt).then(result => {
        const metrics = calculateMetrics(result.response, result.time, prompt, 'gpt4');
        setResponses('gpt4', result.response, metrics);
      }),
      getMistralResponse(prompt).then(result => {
        const metrics = calculateMetrics(result.response, result.time, prompt, 'mixtral');
        setResponses('mixtral', result.response, metrics);
      }),
      getLlamaResponse(prompt).then(result => {
        const metrics = calculateMetrics(result.response, result.time, prompt, 'llama');
        setResponses('llama', result.response, metrics);
      })
    ];

    try {
      await Promise.allSettled(modelRequests);
    } catch (error) {
      console.error('Error fetching responses:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea 
        name="prompt"
        placeholder="Enter your prompt here..."
        rows={4}
        className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 
           focus:ring-2 focus:ring-orange-500 focus:border-transparent
           placeholder-white/30 text-white/90 transition-all"
      />
      <button 
        type="submit"
        disabled={loading}
        className="w-full sm:w-auto px-6 py-3 bg-orange-500 
                 text-white font-medium rounded-lg shadow-lg hover:bg-orange-600 
                 transition-all duration-200 transform hover:-translate-y-0.5
                 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Evaluating...' : 'Evaluate Models'}
      </button>
    </form>
  )
} 