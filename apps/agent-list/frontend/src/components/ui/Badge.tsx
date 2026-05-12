import type { ReactNode } from 'react'

type Tone = 'default' | 'accent' | 'success' | 'warning' | 'danger' | 'muted'

const tones: Record<Tone, string> = {
  default: 'bg-surface border border-border text-text',
  accent: 'bg-accent/15 border border-accent/40 text-accent',
  success: 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300',
  warning: 'bg-amber-500/10 border border-amber-500/30 text-amber-300',
  danger: 'bg-red-500/10 border border-red-500/30 text-red-300',
  muted: 'bg-bg border border-border text-muted',
}

export default function Badge({
  children,
  tone = 'default',
  className = '',
}: {
  children: ReactNode
  tone?: Tone
  className?: string
}) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  )
}
