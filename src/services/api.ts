export async function callLLMAPI(model: string, prompt: string) {
  const response = await fetch('/api/llm', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model, prompt })
  });
  return response.json();
} 