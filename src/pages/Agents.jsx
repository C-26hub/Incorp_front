import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, Star } from 'lucide-react'
import { agents } from '../data/agents'
import AgentCard from '../components/AgentCard'
import { useFavorites } from '../context/FavoritesContext'

const FILTERS = [
  { key: 'todos', label: 'Todos' },
  { key: 'marketing', label: 'Marketing' },
  { key: 'comercial', label: 'Comercial' },
  { key: 'favoritos', label: 'Favoritos', icon: true },
]

export default function Agents() {
  const [params, setParams] = useSearchParams()
  const filter = params.get('filtro') ?? 'todos'
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('todos')
  const { favorites } = useFavorites()

  const setFilter = (key) => setParams(key === 'todos' ? {} : { filtro: key })

  const visible = useMemo(() => agents.filter((a) => {
    if (filter === 'marketing' && a.department !== 'Marketing') return false
    if (filter === 'comercial' && a.department !== 'Comercial') return false
    if (filter === 'favoritos' && !favorites.includes(a.id)) return false
    if (status !== 'todos' && a.status !== status) return false
    if (query && !`${a.name} ${a.description}`.toLowerCase().includes(query.toLowerCase())) return false
    return true
  }), [filter, status, query, favorites])

  // agrupa: departamento -> categoria
  const grouped = useMemo(() => {
    const out = {}
    visible.forEach((a) => {
      out[a.department] ??= {}
      out[a.department][a.category] ??= []
      out[a.department][a.category].push(a)
    })
    return out
  }, [visible])

  const departments = ['Marketing', 'Comercial'].filter((d) => grouped[d])

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium text-slate-800">Exploração de Agentes</h1>
          <p className="mt-1 text-xs text-sky-600">
            {agents.length} agentes disponíveis em 2 departamentos
          </p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar agente..."
              className="w-52 rounded-lg border border-slate-200 bg-white py-2 pl-8 pr-3 text-xs outline-none focus:border-indigo-400"
            />
          </div>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs"
          >
            <option value="todos">Todos os status</option>
            <option value="Online">Online</option>
            <option value="Beta">Beta</option>
          </select>
        </div>
      </div>

      <div className="mt-5 flex gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`flex items-center gap-1.5 rounded-lg border px-4 py-1.5 text-xs font-medium transition ${
              filter === f.key
                ? 'border-indigo-900 bg-indigo-900 text-white'
                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
            }`}
          >
            {f.icon && <Star size={12} className={filter === f.key ? 'fill-white' : ''} />}
            {f.label}
          </button>
        ))}
      </div>

      {departments.length === 0 && (
        <p className="mt-16 text-center text-sm text-slate-400">
          {filter === 'favoritos'
            ? 'Você ainda não favoritou nenhum agente. Clique na estrela de um card para adicionar.'
            : 'Nenhum agente encontrado.'}
        </p>
      )}

      {departments.map((dep) => (
        <section key={dep} className="mt-8">
          <h2 className="flex items-center gap-2 text-sm font-medium text-slate-800">
            <span className={`h-2 w-2 rounded-full ${dep === 'Marketing' ? 'bg-sky-500' : 'bg-indigo-800'}`} />
            {dep}
            <span className="text-xs font-normal text-slate-400">
              {Object.values(grouped[dep]).flat().length} agentes
            </span>
          </h2>

          {Object.entries(grouped[dep]).map(([cat, list]) => (
            <div key={cat} className="mt-4">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">{cat}</p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {list.map((a) => <AgentCard key={a.id} agent={a} />)}
              </div>
            </div>
          ))}
        </section>
      ))}
    </div>
  )
}