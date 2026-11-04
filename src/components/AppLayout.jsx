import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Settings, LogOut, Home, LayoutGrid, BarChart3 } from 'lucide-react'
import { useProfile } from '../context/ProfileContext'
import UserAvatar from './UserAvatar'

const links = [
  { to: '/home', label: 'Início', icon: Home },
  { to: '/agentes', label: 'Agentes', icon: LayoutGrid },
  { to: '/dashboard', label: 'Dashboard', icon: BarChart3 },
]

export default function AppLayout() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { profile } = useProfile()

  // a tela de chat (/agentes/:id) ocupa a largura toda, sem padding
  const fullBleed = /^\/agentes\/[^/]+$/.test(pathname)

  const logout = () => {
    localStorage.removeItem('incorp:auth')
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-page">
      <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 bg-brand px-4 text-white sm:px-6">
        <div className="flex min-w-0 items-center gap-4 sm:gap-8">
          <span className="text-sm font-semibold">Incorp AI</span>
          <nav className="flex gap-1">
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                aria-label={label}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 border-b-2 px-2.5 py-5 text-xs font-medium transition sm:px-3 ${
                    isActive
                      ? 'border-accent text-white'
                      : 'border-transparent text-white/60 hover:text-white'
                  }`
                }
              >
                <Icon size={14} />
                <span className="hidden sm:inline">{label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <NavLink
            to="/configuracoes"
            aria-label="Configurações"
            className={({ isActive }) => `transition ${isActive ? 'text-white' : 'text-white/60 hover:text-white'}`}
          >
            <Settings size={16} />
          </NavLink>

          {/* Clicar no usuário abre a tela de perfil */}
          <NavLink
            to="/perfil"
            aria-label="Abrir meu perfil"
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-full py-1 pl-1 pr-1 transition md:pr-3 ${
                isActive ? 'bg-white/15' : 'hover:bg-white/10'
              }`
            }
          >
            <UserAvatar size={32} />
            <span className="hidden text-left text-[11px] leading-tight md:block">
              <span className="block font-medium">{profile.name}</span>
              <span className="block text-white/60">
                {profile.dept}
                {profile.role ? ` · ${profile.role}` : ''}
              </span>
            </span>
          </NavLink>

          <button onClick={logout} aria-label="Sair" className="text-white/60 transition hover:text-white">
            <LogOut size={16} />
          </button>
        </div>
      </header>

      <main className={fullBleed ? '' : 'mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-6 lg:px-10'}>
        <Outlet />
      </main>
    </div>
  )
}