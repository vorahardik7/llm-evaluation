import { create } from 'zustand'
import { supabase } from '../services/supabase'

interface Metrics {
  time: number
  accuracy: number
  tokenCount: number
  latency: number
  coherence: number
}

interface EvaluationState {
  prompt: string
  responses: {
    gemini: string
    gpt4: string
    mixtral: string
    llama: string
  }
  metrics: {
    gemini: Metrics
    gpt4: Metrics
    mixtral: Metrics
    llama: Metrics
  }
  modelStatus: Record<string, 'idle' | 'loading' | 'complete'>
  setPrompt: (prompt: string) => void
  setResponses: (
    model: string, 
    response: string, 
    metrics: { 
      time: number
      accuracy: number
      tokenCount: number
      latency: number
      coherence: number 
    }
  ) => Promise<void>
  history: any[]
  fetchHistory: () => Promise<void>
  setModelStatus: (status: Record<string, 'idle' | 'loading' | 'complete'>) => void
}

export const useEvaluationStore = create<EvaluationState>((set, get) => ({
  prompt: '',
  responses: {
    gemini: '',
    gpt4: '',
    mixtral: '',
    llama: ''
  },
  metrics: {
    gemini: { time: 0, accuracy: 0, tokenCount: 0, latency: 0, coherence: 0 },
    gpt4: { time: 0, accuracy: 0, tokenCount: 0, latency: 0, coherence: 0 },
    mixtral: { time: 0, accuracy: 0, tokenCount: 0, latency: 0, coherence: 0 },
    llama: { time: 0, accuracy: 0, tokenCount: 0, latency: 0, coherence: 0 }
  },
  modelStatus: {
    gemini: 'idle',
    gpt4: 'idle',
    mixtral: 'idle',
    llama: 'idle'
  },
  setPrompt: (prompt) => set({ prompt }),
  setResponses: async (model, response, metrics) => {
    const result = await supabase
      .from('evaluations')
      .insert([{ 
        model, 
        response, 
        metrics,
        prompt: get().prompt
      }])
    if (result.error) console.error(result.error)
    set((state) => ({
      responses: { ...state.responses, [model]: response },
      metrics: { ...state.metrics, [model]: metrics },
      modelStatus: { ...state.modelStatus, [model]: 'complete' }
    }))
  },
  history: [],
  fetchHistory: async () => {
    const { data, error } = await supabase
      .from('evaluations')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) console.error(error)
    else set({ history: data || [] })
  },
  setModelStatus: (status) => set({ modelStatus: status }),
})) 