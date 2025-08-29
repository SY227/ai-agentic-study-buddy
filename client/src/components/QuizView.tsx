import React from 'react'
import type { QuizItem } from '../types'

export default function QuizView({ items }: { items: QuizItem[] }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
      <h2 className="text-lg font-semibold">Quiz</h2>
      <div className="mt-2 space-y-4 text-sm min-h-[160px]">
        {!items?.length ? (
          <p className="text-slate-500 italic">Your practice questions will appear here.</p>
        ) : (
          items.map((q, i) => (
            <div key={i} className="border rounded-lg p-3">
              <div className="font-medium">{i + 1}. {q.question}</div>
              {q.choices && (
                <div className="mt-1 space-y-1">
                  {q.choices.map((c, j) => (
                    <div key={j} className="flex gap-2">
                      <span className="text-slate-500">{String.fromCharCode(97 + j)}.</span>
                      <span>{c}</span>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-2"><span className="text-slate-500">Answer:</span> {q.answer}</div>
              <div className="text-slate-600"><span className="text-slate-500">Why:</span> {q.rationale}</div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
