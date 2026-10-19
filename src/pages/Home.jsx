import { Search, Phone, Activity } from 'lucide-react'
import { Link } from 'react-router-dom'
import { agents } from '../data/agents'
import Avatar from '../components/Avatar'
import StatusBadge from '../components/StatusBadge'

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Bom dia'
  if (h < 18) return 'Boa tarde'
  return 'Boa noite'
}

const top = [...agents].sort((a, b) => b.uses - a.uses).slice(0, 5)

export default function Home() {
  return (
    <div className="max-w-[760px]">
      <h1 className="text-[28px] font-medium">{greeting()}, Ana 👋</h1>
      <p className="text-sm text-muted mt-1">O que você quer automatizar hoje?</p>

      <div className="relative mt-8">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
        <input
          placeholder="Buscar agentes, funções ou departamentos..."
          className="w-full h-[52px] pl-11 pr-4 rounded-xl bg-white border border-line shadow-sm text-sm outline-none focus:border-brand"
        />
      </div>

      <div className="grid grid-cols-2 gap-5 mt-8">
        {[
          { name: 'Marketing', icon: Phone, bg: 'bg-accent-soft text-accent' },
          { name: 'Comercial', icon: Activity, bg: 'bg-[#eeeff6] text-brand' },
        ].map(({ name, icon: Icon, bg }) => (
          <Link
            key={name}
            to="/agentes"
            className="bg-white border border-line rounded-2xl p-5 h-[128px] flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${bg}`}>
              <Icon size={18} />
            </div>
            <div>
              <p className="text-[15px] font-medium">{name}</p>
              <p className="text-xs text-muted mt-0.5">5 agentes disponíveis</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="flex items-center justify-between mt-10 mb-4">
        <h2 className="text-base font-medium">Agentes mais utilizados</h2>
        <Link to="/agentes" className="text-xs font-medium text-brand">Ver todos</Link>
      </div>

      <div className="space-y-2">
        {top.map((a, i) => (
          <div key={a.id} className="flex items-center gap-4 bg-white border border-line rounded-xl px-5 py-3">
            <span className="w-4 text-xs text-muted">{i + 1}</span>
            <Avatar initials={a.initials} dept={a.dept} />
            <div className="flex-1 leading-tight">
              <p className="text-[13px] font-semibold">{a.name}</p>
              <p className="text-[11px] text-muted mt-0.5">{a.dept} · {a.category.split(' ')[0] === 'Criação' ? a.category : a.category}</p>
            </div>
            <div className="text-right leading-tight mr-2">
              <p className="text-[13px] font-semibold">{a.uses}</p>
              <p className="text-[10px] text-muted">usos</p>
            </div>
            <StatusBadge status={a.status} />
          </div>
        ))}
      </div>
    </div>
  )
}