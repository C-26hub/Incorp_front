import { useMemo, useState } from 'react'
import { Search, Megaphone, Briefcase } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { agentsOfDept } from '../data/agents'
import Avatar from '../components/Avatar'
import StatusBadge from '../components/StatusBadge'
import { useProfile } from '../context/ProfileContext'

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Bom dia'
  if (h < 18) return 'Boa tarde'
  return 'Boa noite'
}

const DEPT_VISUAL = {
  Marketing: { icon: Megaphone, bg: 'bg-accent-soft text-accent' },
  Comercial: { icon: Briefcase, bg: 'bg-[#eeeff6] text-brand' },
}

export default function Home() {
  const { profile } = useProfile()
  const firstName = profile.name.trim().split(/\s+/)[0]

  // só os agentes do departamento da pessoa
  const disponiveis = useMemo(() => agentsOfDept(profile.dept), [profile.dept])
  const top = useMemo(() => disponiveis.filter((agent) => agent.available).slice(0, 5), [disponiveis])
  const { icon: DeptIcon, bg: deptBg } = DEPT_VISUAL[profile.dept]

  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  const onSearch = (event) => {
    event.preventDefault()
    const q = search.trim()
    navigate(q ? `/agentes?busca=${encodeURIComponent(q)}` : '/agentes')
  }

  return (
    <div>
      <h1 className="text-[28px] font-medium">{greeting()}, {firstName}!</h1>
      <p className="text-sm text-muted mt-1">O que você quer automatizar hoje?</p>

      <form onSubmit={onSearch} role="search" className="relative mt-8">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar agentes ou funções..."
          aria-label="Buscar agentes"
          className="w-full h-[52px] pl-11 pr-4 rounded-xl bg-white border border-line shadow-sm text-sm outline-none focus:border-brand"
        />
      </form>

      <Link
        to="/agentes"
        className="mt-8 bg-white border border-line rounded-2xl p-5 h-[128px] flex flex-col justify-between hover:shadow-md transition-shadow"
      >
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${deptBg}`}>
          <DeptIcon size={18} />
        </div>
        <div>
          <p className="text-[15px] font-medium">{profile.dept}</p>
          <p className="text-xs text-muted mt-0.5">{disponiveis.length} agentes disponíveis</p>
        </div>
      </Link>

      <div className="flex items-center justify-between mt-10 mb-4">
        <h2 className="text-base font-medium">Agentes disponíveis</h2>
        <Link to="/agentes" className="text-xs font-medium text-brand">Ver todos</Link>
      </div>

      <div className="space-y-2">
        {top.map((a, i) => (
          <Link
            key={a.id}
            to={`/agentes/${a.id}`}
            className="flex items-center gap-4 bg-white border border-line rounded-xl px-5 py-3 hover:shadow-md transition-shadow"
          >
            <span className="w-4 text-xs text-muted">{i + 1}</span>
            <Avatar initials={a.initials} dept={a.dept} />
            <div className="flex-1 leading-tight">
              <p className="text-[13px] font-semibold">{a.name}</p>
              <p className="text-[11px] text-muted mt-0.5">{a.dept} · {a.category}</p>
            </div>
            <StatusBadge status={a.status} />
          </Link>
        ))}
      </div>
    </div>
  )
}