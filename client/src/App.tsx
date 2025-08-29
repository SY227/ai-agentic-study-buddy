import React, { useState } from 'react'
import InputPanel from './components/InputPanel'
import AgentLog, { AgentLogItem } from './components/AgentLog'
import GuideView from './components/GuideView'
import QuizView from './components/QuizView'
import Loader from './components/Loader'
import { buildGuideStream } from './lib_api'
import type { StudyGuide, QuizItem } from './types'

export default function App() {
  const [logs, setLogs] = useState<(AgentLogItem & { key?: string })[]>([])
  const [guide, setGuide] = useState<StudyGuide | null>(null)
  const [quiz, setQuiz] = useState<QuizItem[]>([])
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  function upsertProgress(key: string, text: string) {
    setLogs(prev => {
      const i = prev.findIndex(l => l.key === key)
      if (i >= 0) {
        const next = [...prev]
        next[i] = { ...next[i], text, status: 'ok' }
        return next
      }
      return [...prev, { key, text, status: 'ok' }]
    })
  }

  async function onSubmit(urls: string[], file: File | null) {
    setLoading(true); setErr(null)
    setLogs([]); setGuide(null); setQuiz([])
    try {
      await buildGuideStream({
        urls,
        file,
        onLog: (text) => setLogs(prev => [...prev, { text, status: 'ok' }]),
        onProgress: (key, text) => upsertProgress(key, text),
        onGuide: (g) => setGuide(g),
        onDone: ({ guide, quiz }) => {
          setGuide(guide)
          setQuiz(quiz.items || quiz)
        },
        onError: (msg) => setErr(msg)
      })
    } catch (e: any) {
      setErr(e?.message || 'Request failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-4">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Agentic Study Buddy</h1>
        <div className="text-sm text-slate-600">Agentic study assistant powered by Gemini—turn any YouTube link or PDF into study notes and a 30-question quiz in seconds</div>
      </header>

      <div className="grid md:grid-cols-2 gap-4">
        <InputPanel onSubmit={onSubmit} isLoading={loading} />
        <AgentLog logs={logs} isLoading={loading} />
      </div>

      {loading && <Loader label="Building your study guide and quiz..." />}
      {err && <div className="text-rose-700 text-sm">{err}</div>}

      <div className="grid md:grid-cols-2 gap-4">
        <GuideView guide={guide} />
        <QuizView items={quiz} />
      </div>
    </div>
  )
}
