import { STATUS_LABELS, type SubmissionStatus } from '@/lib/types'

const STYLES: Record<SubmissionStatus, { bg: string; text: string; ring: string; dot: string }> = {
  researching: {
    bg: 'bg-zinc-500/10',
    text: 'text-zinc-400',
    ring: 'ring-zinc-500/20',
    dot: 'bg-zinc-400',
  },
  queued: {
    bg: 'bg-blue-500/15',
    text: 'text-blue-300',
    ring: 'ring-blue-500/30',
    dot: 'bg-blue-400',
  },
  submitted: {
    bg: 'bg-cyan-500/15',
    text: 'text-cyan-300',
    ring: 'ring-cyan-500/30',
    dot: 'bg-cyan-400',
  },
  partial_requested: {
    bg: 'bg-amber-500/15',
    text: 'text-amber-300',
    ring: 'ring-amber-500/30',
    dot: 'bg-amber-400',
  },
  full_requested: {
    bg: 'bg-orange-500/15',
    text: 'text-orange-300',
    ring: 'ring-orange-500/30',
    dot: 'bg-orange-400',
  },
  offer: {
    bg: 'bg-emerald-500/15',
    text: 'text-emerald-300',
    ring: 'ring-emerald-500/30',
    dot: 'bg-emerald-400',
  },
  rejected: {
    bg: 'bg-rose-500/15',
    text: 'text-rose-300',
    ring: 'ring-rose-500/30',
    dot: 'bg-rose-400',
  },
  closed_no_response: {
    bg: 'bg-zinc-500/10',
    text: 'text-zinc-500',
    ring: 'ring-zinc-500/20',
    dot: 'bg-zinc-500',
  },
}

export default function StatusPill({
  status,
  withDot = false,
}: {
  status: SubmissionStatus
  withDot?: boolean
}) {
  const s = STYLES[status]
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium ring-1 px-2 py-0.5 text-[11px] ${s.bg} ${s.text} ${s.ring}`}
    >
      {withDot && <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />}
      {STATUS_LABELS[status]}
    </span>
  )
}
