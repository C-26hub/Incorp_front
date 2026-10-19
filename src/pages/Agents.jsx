import { useState } from 'react'
import { Search, ArrowRight } from 'lucide-react'
import { agents } from '../data/agents'
import Avatar from '../components/Avatar'
import StatusBadge from '../components/StatusBadge'
import { useNavigate } from 'react-router-dom'

export default function Agents() {
  const [tab, setTab] = useState('Todos')
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('Todos os status')
  const navigate = useNavigate()

  const filtered = agents.filter(
    (a) =>
      (tab === 'Todos' || a.dept === tab) &&
      (status === 'Todos os status' || a.status === status) &&
      [a.name, a.category, a.desc, a.dept]
  .some((value) =>
    value.toLowerCase().includes(q.trim().toLowerCase())
  )
  )

  const depts = ['Marketing', 'Comercial'].filter((d) => filtered.some((a) => a.dept === d))

  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[28px] font-medium">Exploração de Agentes</h1>
          <p className="text-sm text-muted mt-1">10 agentes disponíveis em 2 departamentos</p>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
  <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar agente..."
              className="h-10 w-full sm:w-[200px] pl-9 pr-3 rounded-lg bg-white border border-line text-[13px] outline-none focus:border-brand"
            />
          </div>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="h-10 px-3 rounded-lg bg-white border border-line text-[13px] outline-none"
          >
            <option>Todos os status</option>
            <option>Online</option>
            <option>Beta</option>
          </select>
        </div>
      </div>

      <div className="flex gap-2 mt-6">
        {['Todos', 'Marketing', 'Comercial'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 h-9 rounded-lg text-[13px] font-medium border transition-colors ${
              tab === t ? 'bg-brand text-white border-brand' : 'bg-white text-ink border-line hover:border-brand'
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      {filtered.length === 0 && (
  <div className="mt-10 rounded-2xl border border-line bg-white p-8 text-center">
    <Search size={28} className="mx-auto mb-3 text-muted" />

    <h3 className="font-semibold text-ink">
      Nenhum agente encontrado
    </h3>

    <p className="mt-2 text-sm text-muted">
      Tente outro termo ou altere os filtros.
    </p>

    <button
      type="button"
      onClick={() => {
        setQ('')
        setTab('Todos')
        setStatus('Todos os status')
      }}
      className="mt-4 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white"
    >
      Limpar filtros
    </button>
  </div>
)}

      {depts.map((dept) => {
        const list = filtered.filter((a) => a.dept === dept)
        const cats = [...new Set(list.map((a) => a.category))]
        return (
          <section key={dept} className="mt-8">
            <div className="flex items-center gap-3">
              <span className={`w-2.5 h-2.5 rounded-full ${dept === 'Marketing' ? 'bg-accent' : 'bg-brand'}`} />
              <h2 className="text-base font-medium">{dept}</h2>
              <span className="text-xs text-muted">{list.length} agentes</span>
            </div>

            {cats.map((cat) => (
              <div key={cat} className="mt-5">
                <p className="text-[11px] font-semibold tracking-widest text-muted uppercase mb-3">{cat}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {list.filter((a) => a.category === cat).map((a) => (
                    <div
  key={a.id}
  role="button"
  tabIndex={0}
  onClick={() => navigate(`/agentes/${a.id}`)}
  onKeyDown={(event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      navigate(`/agentes/${a.id}`)
    }
  }}
  className="group cursor-pointer bg-white border border-line rounded-2xl p-5 hover:border-brand-soft hover:shadow-md transition focus:outline-none focus:ring-2 focus:ring-brand"
>
                      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                        <Avatar initials={a.initials} dept={a.dept} size="lg" />
                        <StatusBadge status={a.status} />
                      </div>
                      <p className="text-[15px] font-medium mt-4">{a.name}</p>
                      <p className="text-xs text-muted mt-1.5 leading-relaxed min-h-[36px]">{a.desc}</p>
                      <div className="flex items-center justify-between mt-4">
                        <span className="font-mono text-[11px] text-muted">{a.uses} usos</span>
                        <span className="text-xs font-medium text-brand opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center gap-1">
                          Usar agente <ArrowRight size={12} />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </section>
        )
      })}
    </div>
  )
}