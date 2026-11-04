import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, Star } from 'lucide-react'
import { agents } from '../data/agents'
import AgentCard from '../components/AgentCard'
import { useFavorites } from '../context/FavoritesContext'

const FILTERS = [
  { key: 'todos', label: 'Todos' },
  { key: 'marketing', label: 'Marketing' },
  { key: 'comercial', label: 'Comercial' },
  { key: 'favoritos', label: 'Favoritos', star: true },
]
const VALID = FILTERS.map((f) => f.key)
const DEPARTMENTS = ['Marketing', 'Comercial']

export default function Agents() {
  const [params, setParams] = useSearchParams()

  // filtro e busca vivem na URL: /agentes?filtro=comercial&busca=seo
  const raw = params.get('filtro')
  const filter = VALID.includes(raw) ? raw : 'todos'
  const query = params.get('busca') ?? ''

  const [status, setStatus] = useState('todos')
  const { favorites } = useFavorites()

  // atualiza só os parâmetros informados, preservando os outros
  const updateParams = (patch) => {
    const next = new URLSearchParams(params)
    Object.entries(patch).forEach(([key, value]) => {
      if (value) next.set(key, value)
      else next.delete(key)
    })
    setParams(next, { replace: true })
  }

  const setFilter = (key) => updateParams({ filtro: key === 'todos' ? '' : key })
  const setQuery = (value) => updateParams({ busca: value })

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return agents.filter((a) => {
      if (filter === 'marketing' && a.dept !== 'Marketing') return false
      if (filter === 'comercial' && a.dept !== 'Comercial') return false
      if (filter === 'favoritos' && !favorites.includes(a.id)) return false
      if (status !== 'todos' && a.status !== status) return false
      if (q && !`${a.name} ${a.desc} ${a.category} ${a.dept}`.toLowerCase().includes(q)) return false
      return true
    })
  }, [filter, status, query, favorites])

  // departamento -> categoria -> agentes
  const grouped = useMemo(() => {
    const out = {}
    visible.forEach((a) => {
      out[a.dept] ??= {}
      out[a.dept][a.category] ??= []
      out[a.dept][a.category].push(a)
    })
    return out
  }, [visible])

  const departments = DEPARTMENTS.filter((d) => grouped[d])

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-medium">Exploração de Agentes</h1>
          <p className="mt-1 text-xs text-accent">
            {agents.length} agentes disponíveis em {DEPARTMENTS.length} departamentos
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar agente..."
              aria-label="Buscar agente"
              className="h-10 w-full min-w-[200px] rounded-lg border border-line bg-white pl-9 pr-3 text-xs outline-none focus:border-brand sm:w-60"
            />
          </div>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            aria-label="Filtrar por status"
            className="h-10 rounded-lg border border-line bg-white px-3 text-xs outline-none focus:border-brand"
          >
            <option value="todos">Todos os status</option>
            <option value="Online">Online</option>
            <option value="Beta">Beta</option>
          </select>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2" role="tablist" aria-label="Filtrar agentes">
        {FILTERS.map((f) => {
          const active = filter === f.key
          return (
            <button
              key={f.key}
              role="tab"
              aria-selected={active}
              onClick={() => setFilter(f.key)}
              className={`flex h-9 items-center gap-1.5 rounded-lg border px-4 text-xs font-medium transition ${
                active
                  ? 'border-brand bg-brand text-white'
                  : 'border-line bg-white hover:border-brand/40'
              }`}
            >
              {f.star && <Star size={12} className={active ? 'fill-white' : ''} />}
              {f.label}
            </button>
          )
        })}
      </div>

      {departments.length === 0 && (
        <div className="mt-16 flex flex-col items-center text-center">
          {filter === 'favoritos' && !query ? (
            <>
              <Star size={28} className="text-muted/50" />
              <p className="mt-3 text-sm font-medium">Nenhum agente favorito ainda</p>
              <p className="mt-1 text-xs text-muted">Clique na estrela de um card para adicioná-lo aqui.</p>
              <Link
                to="/agentes"
                className="mt-4 rounded-lg border border-line bg-white px-4 py-2 text-xs font-medium hover:border-brand/40"
              >
                Ver todos os agentes
              </Link>
            </>
          ) : (
            <>
              <p className="text-sm font-medium">Nenhum agente encontrado</p>
              <p className="mt-1 text-xs text-muted">Altere a busca, o filtro ou o status.</p>
            </>
          )}
        </div>
      )}

      {departments.map((dept) => (
        <section key={dept} className="mt-8">
          <h2 className="flex items-center gap-2 text-sm font-medium">
            <span className={`h-2 w-2 rounded-full ${dept === 'Marketing' ? 'bg-accent' : 'bg-brand'}`} />
            {dept}
            <span className="text-xs font-normal text-muted">
              {Object.values(grouped[dept]).flat().length} agentes
            </span>
          </h2>

          {Object.entries(grouped[dept]).map(([category, list]) => (
            <div key={category} className="mt-4">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-muted">{category}</p>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {list.map((a) => (
                  <AgentCard key={a.id} agent={a} />
                ))}
              </div>
            </div>
          ))}
        </section>
      ))}
    </div>
  )
}