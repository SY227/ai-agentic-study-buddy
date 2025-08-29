import React, { useState } from 'react'

type Props = {
  onSubmit: (urls: string[], file: File | null) => void
  isLoading: boolean
}

type Mode = 'links' | 'pdf'

export default function InputPanel({ onSubmit, isLoading }: Props) {
  const [mode, setMode] = useState<Mode>('links')
  const [urlInputs, setUrlInputs] = useState<string[]>([''])
  const [file, setFile] = useState<File | null>(null)

  const addField = () => setUrlInputs((a) => [...a, ''])
  const setAt = (i: number, v: string) => {
    const next = [...urlInputs]
    next[i] = v
    setUrlInputs(next)
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const urls = mode === 'links' ? urlInputs.map(s => s.trim()).filter(Boolean) : []
    onSubmit(urls, mode === 'pdf' ? file : null)
  }

  const ModeButton = ({ label, val }: { label: string; val: Mode }) => (
    <button
      type="button"
      onClick={() => setMode(val)}
      className={
        'px-3 py-1.5 text-sm rounded-lg transition ' +
        (mode === val ? 'bg-white shadow font-medium' : 'text-slate-600 hover:text-slate-900')
      }
      aria-pressed={mode === val}
    >
      {label}
    </button>
  )

  return (
    <form onSubmit={submit} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Sources</h2>
          <p className="text-sm text-slate-600">Provide YouTube links or a PDF to build your study guide.</p>
        </div>
        <div className="inline-flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <ModeButton label="Link" val="links" />
          <ModeButton label="PDF" val="pdf" />
        </div>
      </div>

      {mode === 'links' ? (
        <div className="space-y-2">
          {urlInputs.map((u, i) => (
            <input
              key={i}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400"
              placeholder="https://..."
              value={u}
              onChange={(e) => setAt(i, e.target.value)}
            />
          ))}
          <button type="button" onClick={addField} className="text-sky-700 text-sm">
            + Add another YouTube URL
          </button>
        </div>
      ) : (
        <div className="text-sm">
          <label className="block text-slate-600 mb-2">Upload a PDF</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="text-sm"
          />
          {!file && <div className="text-slate-500 mt-1">No file selected.</div>}
          {file && <div className="mt-1 text-slate-700">Selected: <span className="font-medium">{file.name}</span></div>}
        </div>
      )}

      <div>
        <button
          disabled={isLoading}
          className="rounded-xl bg-sky-600 text-white px-4 py-2 text-sm disabled:opacity-60"
        >
          {isLoading ? 'Building…' : 'Build Study Guide & Quiz'}
        </button>
      </div>
    </form>
  )
}
