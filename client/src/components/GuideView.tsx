import React from 'react'
import type { StudyGuide } from '../types'

export default function GuideView({ guide }: { guide: StudyGuide | null }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
      <h2 className="text-lg font-semibold">Study Guide</h2>
      <div className="mt-2 space-y-3 text-sm min-h-[180px]">
        {!guide ? (
          <p className="text-slate-500 italic">Your study guide will appear here after processing.</p>
        ) : (
          <>
            <div>
              <div className="text-slate-500">Topic</div>
              <div className="font-medium">{guide.topic}</div>
            </div>
            <div>
              <div className="text-slate-500">Overview</div>
              <p>{guide.overview}</p>
            </div>
            <div>
              <div className="text-slate-500">Sections</div>
              <div className="space-y-2">
                {guide.sections.map((s, i) => (
                  <div key={i}>
                    <div className="font-medium">{s.title}</div>
                    <ul className="list-disc ml-5">
                      {s.bullets.map((b, j) => <li key={j}>{b}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="text-slate-500">Key Terms</div>
              {guide.key_terms.length ? (
                <ul className="list-disc ml-5">
                  {guide.key_terms.map((t, i) => (
                    <li key={i}><span className="font-medium">{t.term}:</span> {t.definition}</li>
                  ))}
                </ul>
              ) : <div className="text-slate-500">—</div>}
            </div>
            {!!guide.figures_to_draw?.length && (
              <div>
                <div className="text-slate-500">Figures To Draw</div>
                <ul className="list-disc ml-5">
                  {guide.figures_to_draw.map((f, i) => <li key={i}>{f}</li>)}
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
