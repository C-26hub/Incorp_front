import { NavLink } from 'react-router-dom'
import { Home, LayoutGrid, BarChart3, Clock, Star, Settings, Sparkles } from 'lucide-react'

const nav = [
  { to: '/', label: 'Início', icon: Home },
  { to: '/agentes', label: 'Agentes', icon: LayoutGrid },
  { to: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  { to: '/historico', label: 'Histórico', icon: Clock },
  { to: '/favoritos', label: 'Favoritos', icon: Star },
]

const link = ({ isActive }) =>
  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-colors ${
    isActive ? 'bg-white/15 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
  }`

const Label = ({ children }) => (
  <p className="px-3 mt-6 mb-2 text-[10px] font-semibold tracking-widest text-white/45">{children}</p>
)

export default function Sidebar() {
  return (
    <aside className="w-[240px] shrink-0 h-screen sticky top-0 bg-brand text-white flex flex-col">
      <div className="flex items-center gap-3 px-5 h-[72px] border-b border-white/10">
        <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center">
          <Sparkles size={18} />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold">Incorp AI</p>
          <p className="text-[10px] tracking-wider text-white/60">TECHNOLOGY</p>
        </div>
      </div>

      <nav className="flex-1 px-3 pt-5 overflow-y-auto">
        <div className="space-y-1">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} end={to === '/'} className={link}>
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </div>

        <Label>DEPARTAMENTOS</Label>
        <div className="space-y-1">
          <div className="flex items-center gap-3 px-3 py-2.5 text-[13px] font-medium text-white/75">
            <span className="w-2 h-2 rounded-full bg-accent" /> Marketing
          </div>
          <div className="flex items-center gap-3 px-3 py-2.5 text-[13px] font-medium text-white/75">
            <span className="w-2 h-2 rounded-full bg-violet" /> Comercial
          </div>
        </div>

        <Label>SISTEMA</Label>
        <NavLink to="/configuracoes" className={link}>
          <Settings size={16} />
          Configurações
        </NavLink>
      </nav>

      <div className="flex items-center gap-3 px-5 py-4 border-t border-white/10">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-brand-soft flex items-center justify-center text-[11px] font-semibold">
          AS
        </div>
        <div className="leading-tight">
          <p className="text-[13px] font-semibold">Ana Souza</p>
          <p className="text-[11px] text-white/60">Marketing · Admin</p>
        </div>
      </div>
    </aside>
  )
}