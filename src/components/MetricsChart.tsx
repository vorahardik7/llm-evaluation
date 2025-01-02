import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LineChart, Line } from 'recharts'
import { useEvaluationStore } from '../store/evaluationStore'
import { useEffect, useState } from 'react'

export function MetricsChart() {
  const { metrics } = useEvaluationStore()
  const [isAnimating, setIsAnimating] = useState(false)
  
  useEffect(() => {
    if (Object.values(metrics).some(m => m.time > 0)) {
      setIsAnimating(true)
      setTimeout(() => setIsAnimating(false), 1000)
    }
  }, [metrics])
  
  const data = Object.entries(metrics).map(([model, values]) => ({
    name: model.toUpperCase(),
    responseTime: isAnimating ? 0 : values.time,
    accuracy: isAnimating ? 0 : values.accuracy * 100,
    coherence: isAnimating ? 0 : values.coherence * 100
  }))

  return (
    <div className="space-y-8">
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/10">
        <h2 className="text-2xl font-semibold mb-8 text-white">Performance Analysis</h2>
        <div className="w-full overflow-x-auto">
          <BarChart 
            width={800} 
            height={400} 
            data={data}
            className="mx-auto"
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            barGap={10}
            barCategoryGap={40}
          >
            <XAxis dataKey="name" stroke="#fff" />
            <YAxis stroke="#fff" />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(17, 25, 40, 0.95)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '0.75rem',
                padding: '12px 16px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                color: '#fff'
              }}
              formatter={(value: number, name: string) => {
                switch (name) {
                  case 'Response Time (s)':
                    return [`${value.toFixed(2)}s`, 'Response Time'];
                  case 'Accuracy (%)':
                    return [`${value.toFixed(1)}%`, 'Accuracy'];
                  case 'Coherence (%)':
                    return [`${value.toFixed(1)}%`, 'Coherence'];
                  default:
                    return [value, name];
                }
              }}
              labelFormatter={(label) => `Model: ${label}`}
            />
            <Legend wrapperStyle={{ color: '#fff' }} />
            <Bar dataKey="responseTime" fill="#FF7A45" name="Response Time (s)" />
            <Bar dataKey="accuracy" fill="#FFA940" name="Accuracy (%)" />
            <Bar dataKey="coherence" fill="#FFD591" name="Coherence (%)" />
          </BarChart>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/10">
        <h2 className="text-2xl font-semibold mb-8 text-white">Response Time Comparison</h2>
        <div className="w-full overflow-x-auto">
          <LineChart
            width={800}
            height={300}
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <XAxis dataKey="name" stroke="#fff" />
            <YAxis stroke="#fff" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(12, 12, 12, 0.95)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '0.5rem',
                color: '#fff'
              }}
            />
            <Legend wrapperStyle={{ color: '#fff' }} />
            <Line type="monotone" dataKey="responseTime" stroke="#FF7A45" name="Response Time (s)" />
          </LineChart>
        </div>
      </div>
    </div>
  )
} 