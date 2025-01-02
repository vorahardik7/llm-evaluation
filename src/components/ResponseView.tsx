import { useEvaluationStore } from "../store/evaluationStore";
import { useState, useEffect } from "react";

export function ResponseView() {
  const { responses, metrics, modelStatus } = useEvaluationStore();
  const [selectedModel, setSelectedModel] = useState("gemini");
  const [displayedResponses, setDisplayedResponses] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    Object.entries(responses).forEach(([model, response]) => {
      if (response) {
        setDisplayedResponses((prev) => ({
          ...prev,
          [model]: response,
        }));
      }
    });
  }, [responses]);

  useEffect(() => {
    if (Object.values(responses).every((r) => !r)) {
      setDisplayedResponses({});
    }
  }, [responses]);

  const models = [
    { id: "gemini", name: "Gemini (gemini-1.5-flash)" },
    { id: "gpt4", name: "GPT-4o" },
    { id: "mixtral", name: "Mixtral (mixtral-8x7b-32768)" },
    { id: "llama", name: "Llama (llama-3.1-8b-instant)" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <div className="flex gap-2">
          {models.map((model) => (
            <button
              key={model.id}
              onClick={() => setSelectedModel(model.id)}
              className={`px-4 py-2 rounded-lg transition-all ${
                selectedModel === model.id
                  ? "bg-orange-500 text-white shadow-lg"
                  : "bg-white/5 hover:bg-white/10 text-white"
              }`}
            >
              {model.name}
              {modelStatus[model.id] === "loading" && (
                <span className="ml-2 inline-block">
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                </span>
              )}
            </button>
          ))}
        </div>
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 min-h-[520px] overflow-y-auto border border-white/10">
          {modelStatus[selectedModel] === "loading" ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
          ) : (
            <p className="text-white/90 whitespace-pre-wrap font-light">
              {displayedResponses[selectedModel]}
            </p>
          )}
        </div>
      </div>
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/10 h-[840px] overflow-y-auto">
        <h3 className="text-xl font-semibold mb-4 text-white top-0 py-2">
          Model Metrics
        </h3>
        {models.map((model) => {
          const modelMetrics = metrics[model.id as keyof typeof metrics];
          const hasResponse = responses[model.id as keyof typeof responses];
          const isLoading = modelStatus[model.id] === "loading";

          return (
            <div
              key={model.id}
              className="mb-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all"
            >
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-orange-400">{model.name}</h4>
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500" />
                ) : (
                  hasResponse && (
                    <svg
                      className="w-5 h-5 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )
                )}
              </div>
              {hasResponse ? (
                <div className="grid grid-cols-2 gap-3 mt-3 text-sm">
                  <MetricItem
                    label="Response Time"
                    value={`${modelMetrics.time.toFixed(2)}s`}
                  />
                  <MetricItem
                    label="Accuracy"
                    value={`${(modelMetrics.accuracy * 100).toFixed(1)}%`}
                  />
                  <MetricItem
                    label="Token Count"
                    value={modelMetrics.tokenCount}
                  />
                  <MetricItem
                    label="Latency"
                    value={`${modelMetrics.latency.toFixed(1)}ms`}
                  />
                  <MetricItem
                    label="Coherence"
                    value={`${(modelMetrics.coherence * 100).toFixed(1)}%`}
                  />
                </div>
              ) : (
                isLoading && (
                  <div className="grid grid-cols-2 gap-3 mt-3 text-sm opacity-50">
                    <MetricItem label="Response Time" value="..." />
                    <MetricItem label="Accuracy" value="..." />
                    <MetricItem label="Token Count" value="..." />
                    <MetricItem label="Latency" value="..." />
                    <MetricItem label="Coherence" value="..." />
                  </div>
                )
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MetricItem({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-white/60">{label}:</span>
      <span className="text-white font-medium">{value}</span>
    </div>
  );
}
