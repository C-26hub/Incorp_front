import { useNavigate } from 'react-router-dom'
import { Star, ArrowRight } from 'lucide-react'
import { useFavorites } from '../context/FavoritesContext'

const statusStyle = {
  Online: 'bg-emerald-50 text-emerald-600',
  Beta: 'bg-amber-50 text-amber-600',
}

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
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && open()}
      className="group relative cursor-pointer rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-indigo-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
    >
      <div className="mb-3 flex items-start justify-between">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-100 text-[11px] font-semibold text-sky-700">
          {agent.initials}
        </span>

        <div className="flex items-center gap-2">
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${statusStyle[agent.status]}`}>
            ● {agent.status}
          </span>
          <button
            type="button"
            aria-label={fav ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            aria-pressed={fav}
            onClick={(e) => { e.stopPropagation(); toggleFavorite(agent.id) }}
            className="rounded-md p-1 transition hover:bg-amber-50"
          >
            <Star
              size={16}
              className={fav ? 'fill-amber-400 text-amber-400' : 'text-slate-300 group-hover:text-slate-400'}
            />
          </button>
        </div>
      </div>

      <h3 className="text-sm font-medium text-slate-800">{agent.name}</h3>
      <p className="mt-1 text-xs leading-relaxed text-slate-500">{agent.desc}</p>

      <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
        <span>{agent.uses} usos</span>
        <span className="flex items-center gap-1 font-medium text-indigo-800 opacity-0 transition group-hover:opacity-100">
          Usar agente <ArrowRight size={12} />
        </span>
      </div>
    </div>
  )
}