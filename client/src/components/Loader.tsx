import React from 'react'
export default function Loader({ label='Working...' }: { label?: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-slate-600">
      <span className="animate-spin inline-block w-4 h-4 border-[2px] border-slate-400 border-t-transparent rounded-full" />
      <span>{label}</span>
    </div>
  )
}
