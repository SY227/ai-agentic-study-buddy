import React from 'react'

export default function SourcesCard({ urls, fileName }: { urls: string[]; fileName: string | null }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
      <h2 className="text-lg font-semibold">Sources</h2>
      <div className="mt-2 text-sm min-h-[120px]">
        {(!urls?.length && !fileName) ? (
          <p className="text-slate-500 italic">Your selected links or PDF will appear here after you submit.</p>
        ) : (
          <>
            {urls?.length ? (
              <div className="mb-2">
                <div className="text-slate-500">Link</div>
                <ul className="list-disc ml-5">
                  {urls.map((u, i) => (
                    <li key={i}><a className="text-sky-700 underline" href={u} target="_blank" rel="noreferrer">{u}</a></li>
                  ))}
                </ul>
              </div>
            ) : null}
            {fileName ? (
              <div>
                <div className="text-slate-500">PDF</div>
                <div className="font-medium">{fileName}</div>
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  )
}
