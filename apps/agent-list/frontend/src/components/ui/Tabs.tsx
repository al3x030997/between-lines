'use client'

import type { ReactNode } from 'react'

export interface Tab<T extends string> {
  key: T
  label: ReactNode
}

export default function Tabs<T extends string>({
  tabs,
  active,
  onChange,
}: {
  tabs: Tab<T>[]
  active: T
  onChange: (key: T) => void
}) {
  return (
    <div className="flex gap-1 border-b border-border">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`px-4 py-2 text-sm border-b-2 -mb-px transition-colors ${
            active === tab.key
              ? 'border-accent text-text'
              : 'border-transparent text-muted hover:text-text'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
