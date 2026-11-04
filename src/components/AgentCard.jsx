import { useNavigate } from 'react-router-dom'
import { Star } from 'lucide-react'
import { useFavorites } from '../context/FavoritesContext'
import Avatar from './Avatar'
import StatusBadge from './StatusBadge'

export default function AgentCard({ agent }) {
  const navigate = useNavigate()
  const { isFavorite, toggleFavorite } = useFavorites()
  const fav = isFavorite(agent.id)

  const open = () => navigate(`/agentes/${agent.id}`)

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={open}
      onKeyDown={(e) => {
        if (e.target !== e.currentTarget) return // ignora Enter/Espaço vindos da estrela
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          open()
        }
      }}
      className="group flex cursor-pointer flex-col rounded-xl border border-line bg-white p-4 shadow-sm outline-none transition hover:border-brand/40 hover:shadow-md focus-visible:border-brand focus-visible:ring-4 focus-visible:ring-brand/10"
    >
      <div className="flex items-start justify-between gap-2">
        <Avatar initials={agent.initials} dept={agent.dept} />

        <div className="flex items-center gap-1.5">
          <StatusBadge status={agent.status} />
          <button
            type="button"
            aria-label={fav ? `Remover ${agent.name} dos favoritos` : `Adicionar ${agent.name} aos favoritos`}
            aria-pressed={fav}
            onClick={(e) => {
              e.stopPropagation()
              toggleFavorite(agent.id)
            }}
            className="rounded-md p-1 transition hover:bg-amber-50"
          >
            <Star
              size={17}
              className={fav ? 'fill-amber-400 text-amber-400' : 'text-muted/60 group-hover:text-muted'}
            />
          </button>
        </div>
      </div>

      <h3 className="mt-3 text-[13px] font-semibold">{agent.name}</h3>
      <p className="mt-1 flex-1 text-[11.5px] leading-relaxed text-muted">{agent.desc}</p>

      <div className="mt-3 flex items-center justify-between text-[11px] text-muted">
        <span>{agent.uses} usos</span>
        <span className="font-medium text-brand opacity-0 transition group-hover:opacity-100 group-focus-within:opacity-100">
          Usar agente →
        </span>
      </div>
    </div>
  )
}