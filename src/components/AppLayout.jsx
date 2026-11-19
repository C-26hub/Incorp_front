import { useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Settings, LogOut, Home, LayoutGrid, Users } from 'lucide-react'
import { useProfile } from '../context/ProfileContext'
import { useAuth } from '../context/AuthContext'
import UserAvatar from './UserAvatar'

const links = [
  { to: '/home', label: 'Início', icon: Home },
  { to: '/agentes', label: 'Agentes', icon: LayoutGrid },
]
const usersLink = { to: '/usuarios', label: 'Usuários', icon: Users }

export default function AppLayout() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { profile } = useProfile()
  const { logout, user } = useAuth()
  const [logoutError, setLogoutError] = useState('')

  // a tela de chat (/agentes/:id) ocupa a largura toda, sem padding
  const fullBleed = pathname === '/agentes/copywriter'

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login', { replace: true })
    } catch (error) {
      setLogoutError(error instanceof Error ? error.message : 'Não foi possível encerrar a sessão.')
    }
  }

  return (
    <div className="min-h-screen bg-page">
      <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 bg-brand px-4 text-white sm:px-6">
        <div className="flex min-w-0 items-center gap-4 sm:gap-8">
          <span className="text-sm font-semibold">Incorp AI</span>
          <nav className="flex gap-1">
            {(user?.role === 'ADMINISTRATOR' ? [...links, usersLink] : links).map(({ to, label, icon: Icon }) => (
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

          <button onClick={handleLogout} aria-label="Sair" className="text-white/60 transition hover:text-white">
            <LogOut size={16} />
          </button>
        </div>
      </header>

      <main className={fullBleed ? '' : 'mx-auto w-full max-w-[1440px] px-4 py-8 sm:px-6 lg:px-10'}>
        {logoutError && <p role="alert" className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{logoutError}</p>}
        <Outlet />
      </main>
    </div>
  )
}
