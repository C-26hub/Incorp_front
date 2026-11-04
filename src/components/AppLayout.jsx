import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Settings, LogOut, Home, LayoutGrid, BarChart3 } from 'lucide-react'

const links = [
  { to: '/home', label: 'Início', icon: Home },
  { to: '/agentes', label: 'Agentes', icon: LayoutGrid },
  { to: '/dashboard', label: 'Dashboard', icon: BarChart3 },
]

export default function AppLayout() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  // a tela de chat (/agentes/:id) ocupa a largura toda, sem padding
  const fullBleed = /^\/agentes\/[^/]+$/.test(pathname)

  const logout = () => {
    localStorage.removeItem('incorp:auth')
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-page">
      <header className="sticky top-0 z-20 flex h-16 items-center justify-between bg-brand px-6 text-white">
        <div className="flex items-center gap-8">
          <span className="text-sm font-semibold">Incorp AI</span>
          <nav className="flex gap-1">
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 border-b-2 px-3 py-5 text-xs font-medium transition ${
                    isActive
                      ? 'border-accent text-white'
                      : 'border-transparent text-white/60 hover:text-white'
                  }`
                }
              >
                <Icon size={14} /> {label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <NavLink to="/configuracoes" aria-label="Configurações" className="text-white/60 hover:text-white">
            <Settings size={16} />
          </NavLink>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-[11px] font-semibold">AS</span>
            <div className="text-[11px] leading-tight">
              <p className="font-medium">Ana Souza</p>
              <p className="text-white/60">Marketing · Admin</p>
            </div>
          </div>
          <button onClick={logout} aria-label="Sair" className="text-white/60 hover:text-white">
            <LogOut size={16} />
          </button>
        </div>
      </header>

      <main className={fullBleed ? '' : 'mx-auto w-full max-w-6xl px-8 py-8'}>
        <Outlet />
      </main>
    </div>
  )
}