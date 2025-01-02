import { useEvaluationStore } from '../store/evaluationStore'

const SUGGESTED_PROMPTS = [
  {
    title: "Language Analysis",
    prompt: "Compare and contrast the differences between functional and object-oriented programming paradigms."
  },
  {
    title: "Creative Generation",
    prompt: "Write a detailed product description for a revolutionary AI-powered smart home device."
  },
  {
    title: "Complex Reasoning",
    prompt: "Explain how quantum computing could impact the future of cryptography and cybersecurity."
  },
  {
    title: "Code Generation",
    prompt: "Create a TypeScript implementation of a rate limiter with a sliding window algorithm."
  }
];

export function SuggestedPrompts() {
  const { setPrompt } = useEvaluationStore()

  const handlePromptClick = (prompt: string) => {
    setPrompt(prompt);
    // Find the textarea and update its value
    const textarea = document.querySelector('textarea[name="prompt"]') as HTMLTextAreaElement;
    if (textarea) {
      textarea.value = prompt;
    }
  }

  return (
    <div className="mt-4 space-y-2">
      <h3 className="text-lg font-medium text-orange-400">Suggested Prompts</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {SUGGESTED_PROMPTS.map((item) => (
          <button
            key={item.title}
            onClick={() => handlePromptClick(item.prompt)}
            className="text-left p-3 bg-white/5 rounded-lg hover:bg-white/10 
                     border border-white/10 hover:border-orange-500 transition-all"
          >
            <span className="block font-medium text-orange-400">{item.title}</span>
            <span className="text-sm text-white/60 line-clamp-2">{item.prompt}</span>
          </button>
        ))}
      </div>
    </div>
  )
} 