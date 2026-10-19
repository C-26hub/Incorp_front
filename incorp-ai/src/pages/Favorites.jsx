import { Star } from 'lucide-react'
import { agents } from '../data/agents'
import Avatar from '../components/Avatar'
import StatusBadge from '../components/StatusBadge'

export default function Favorites() {
  const favs = agents.filter((a) => a.fav)

  return (
    <div>
      <h1 className="text-[28px] font-medium">Favoritos</h1>
      <p className="text-sm text-muted mt-1">{favs.length} agentes salvos</p>

      <div className="grid grid-cols-3 gap-5 mt-6">
        {favs.map((a) => (
          <div key={a.id} className="bg-white border border-line rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <Avatar initials={a.initials} dept={a.dept} size="lg" />
              <div className="flex-1 leading-tight">
                <p className="text-[15px] font-medium">{a.name}</p>
                <p className="text-[11px] text-muted mt-0.5">{a.dept}</p>
              </div>
              <Star size={15} className="fill-[#f59e0b] text-[#f59e0b]" />
            </div>
            <p className="text-xs text-muted leading-relaxed mt-4 min-h-[36px]">{a.desc}</p>
            <div className="flex items-center justify-between mt-4">
              <StatusBadge status={a.status} />
              <span className="font-mono text-[11px] text-muted">{a.uses} usos</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}