import { encode } from 'gpt-tokenizer'

export interface ResponseMetrics {
  time: number
  accuracy: number
  tokenCount: number
  latency: number
  coherence: number
}

export function calculateMetrics(
  response: string, 
  time: number,
  prompt: string,
  modelType: 'gemini' | 'gpt4' | 'mixtral' | 'llama'
): ResponseMetrics {
  const tokenCount = encode(response).length
  
  const latencyMap = {
    gemini: 200,  
    gpt4: 400,    
    mixtral: 150, 
    llama: 100    
  }
  const latency = latencyMap[modelType] || 200
  
  const coherence = calculateCoherence(response)
  const accuracy = calculateAccuracy(prompt, response, modelType)
  
  return {
    time,           
    accuracy,
    tokenCount,
    latency,       
    coherence
  }
}

function calculateCoherence(response: string): number {
    const sentences = response.split(/[.!?]+/).filter(Boolean)
    const avgSentenceLength = sentences.reduce((acc, s) => acc + s.length, 0) / sentences.length
    
    const sentenceScore = Math.min((sentences.length / 10), 1) * 0.2
    const lengthScore = (avgSentenceLength >= 30 && avgSentenceLength <= 150) ? 0.2 : 0.1
    
    const hasCodeBlocks = response.includes('```') ? 0.15 : 0
    const hasLists = (response.match(/^[-*]\s/gm)?.length || 0) > 0 ? 0.15 : 0
    const hasParagraphs = (response.match(/\n\n/g)?.length || 0) > 0 ? 0.15 : 0
    
    const complexWords = response.match(/\b\w{8,}\b/g)?.length || 0
    const complexityScore = Math.min((complexWords / 20), 1) * 0.15
    
    const score = 0.2 + sentenceScore + lengthScore + hasCodeBlocks + hasLists + hasParagraphs + complexityScore
    return Math.min(score, 1)
  }

function calculateAccuracy(prompt: string, response: string, modelType: string): number {
  const promptKeywords = extractKeywords(prompt.toLowerCase())
  const responseKeywords = extractKeywords(response.toLowerCase())
  
  const keywordMatch = promptKeywords.filter(k => 
    responseKeywords.some(rk => rk.includes(k))
  ).length / promptKeywords.length
  
  const lengthScore = Math.min(response.length / (prompt.length * 2), 1)
  
  const modelBonus = {
    gemini: 0.02,
    gpt4: 0.03,
    mixtral: 0.01,
    llama: 0.01
  }[modelType] || 0
  
  let score = 0.5 + (keywordMatch * 0.3) + (lengthScore * 0.2) + modelBonus
  return Math.min(score, 1)
}

function extractKeywords(text: string): string[] {
  const stopWords = new Set(['the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'but'])
  return text
    .split(/\W+/)
    .filter(word => word.length > 3 && !stopWords.has(word))
} 