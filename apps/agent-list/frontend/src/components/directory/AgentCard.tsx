import Link from 'next/link'
import Badge from '@/components/ui/Badge'
import Card from '@/components/ui/Card'
import type { DirectoryAgent } from '@/lib/types'

export default function AgentCard({ agent }: { agent: DirectoryAgent }) {
  return (
    <Link href={`/directory/${agent.id}`}>
      <Card className="hover:border-accent transition-colors cursor-pointer h-full">
        <p className="text-base font-medium text-text leading-tight">{agent.name}</p>
        {agent.agency && <p className="text-xs text-muted mt-0.5">{agent.agency}</p>}
        {agent.genres && agent.genres.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-3">
            {agent.genres.slice(0, 4).map((g) => (
              <Badge key={g} tone="muted">
                {g}
              </Badge>
            ))}
            {agent.genres.length > 4 && (
              <Badge tone="muted">+{agent.genres.length - 4}</Badge>
            )}
          </div>
        )}
        {agent.is_open === false && (
          <p className="text-xs text-amber-300/80 mt-3">Currently closed to queries</p>
        )}
      </Card>
    </Link>
  )
}
