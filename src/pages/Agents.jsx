import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import { agentsOfDept } from '../data/agents'
import { useProfile } from '../context/ProfileContext'
import AgentCard from '../components/AgentCard'

export default function Agents() {
  const [params, setParams] = useSearchParams()
  const { profile } = useProfile()

  // a busca vive na URL: /agentes?busca=seo
  const query = params.get('busca') ?? ''
  const [status, setStatus] = useState('todos')

  const setQuery = (value) => {
    const next = new URLSearchParams(params)
    if (value) next.set('busca', value)
    else next.delete('busca')
    setParams(next, { replace: true })
  }

  // só os agentes do departamento da pessoa
  const disponiveis = useMemo(() => agentsOfDept(profile.dept), [profile.dept])

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return disponiveis.filter((a) => {
      if (status !== 'todos' && a.status !== status) return false
      if (q && !`${a.name} ${a.desc} ${a.category}`.toLowerCase().includes(q)) return false
      return true
    })
  }, [disponiveis, status, query])

  // categoria -> agentes
  const byCategory = useMemo(() => {
    const out = {}
    visible.forEach((a) => {
      out[a.category] ??= []
      out[a.category].push(a)
    })
    return out
  }, [visible])

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-medium">Exploração de Agentes</h1>
          <p className="mt-1 text-xs text-accent">
            {disponiveis.length} agentes disponíveis para {profile.dept}
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

      {visible.length === 0 && (
        <div className="mt-16 flex flex-col items-center text-center">
          <p className="text-sm font-medium">Nenhum agente encontrado</p>
          <p className="mt-1 text-xs text-muted">Altere a busca ou o status.</p>
        </div>
      )}

      {visible.length > 0 && (
        <section className="mt-8">
          <h2 className="flex items-center gap-2 text-sm font-medium">
            <span className={`h-2 w-2 rounded-full ${profile.dept === 'Marketing' ? 'bg-accent' : 'bg-brand'}`} />
            {profile.dept}
            <span className="text-xs font-normal text-muted">{visible.length} agentes</span>
          </h2>

          {Object.entries(byCategory).map(([category, list]) => (
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
      )}
    </div>
  )
}
