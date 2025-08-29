import React, { useEffect, useMemo, useState } from 'react'

export type AgentLogItem = { text: string; status: 'ok' | 'error' }

export default function AgentLog({
  logs,
  isLoading
}: {
  logs: AgentLogItem[]
  isLoading: boolean
}) {
  const [dots, setDots] = useState('.')
  useEffect(() => {
    if (!isLoading) { setDots(''); return }
    const frames = ['.', '..', '...']
    let i = 0
    const id = setInterval(() => { i = (i + 1) % frames.length; setDots(frames[i]) }, 450)
    return () => clearInterval(id)
  }, [isLoading])

  const headline = useMemo(() => {
    const last = logs[logs.length - 1]?.text || ''
    if (isLoading && /Reading|sources/.test(last)) return `Analyzing sources${dots}`
    if (isLoading && /Synthesizing study guide|summarizing|notes/.test(last)) return `Writing notes${dots}`
    if (isLoading && /Synthesizing quiz|questions/.test(last)) return `Generating questions${dots}`
    if (isLoading) return `Working${dots}`
    return 'Idle'
  }, [logs, isLoading, dots])

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Agent log</h2>
        <div className="text-xs font-medium text-slate-600">{headline}</div>
      </div>
      <ul className="mt-2 space-y-1 text-sm min-h-[120px]">
        {logs.length === 0 ? (
          <li className="text-slate-500 italic">Progress will appear here.</li>
        ) : (
          logs.map((l, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className={l.status === 'ok' ? 'text-green-600' : 'text-rose-600'}>{l.status === 'ok' ? '✓' : '✗'}</span>
              <div>{l.text}</div>
            </li>
          ))
        )}
      </ul>
    </div>
  )
}
