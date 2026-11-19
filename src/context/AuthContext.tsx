import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { api, type AuthUser } from '../services/api'

type AuthContextValue = {
  user: AuthUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (input: Parameters<typeof api.register>[0]) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  const loadCurrentUser = useCallback(async () => {
    try {
      setUser(await api.currentUser())
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadCurrentUser()
    const expireSession = () => setUser(null)
    window.addEventListener('cmiap:session-expired', expireSession)
    return () => window.removeEventListener('cmiap:session-expired', expireSession)
  }, [loadCurrentUser])

  const login = useCallback(async (email: string, password: string) => {
    await api.login(email, password)
    setUser(await api.currentUser())
  }, [])

  const register = useCallback(async (input: Parameters<typeof api.register>[0]) => {
    await api.register(input)
  }, [])

  const logout = useCallback(async () => {
    await api.logout()
    setUser(null)
  }, [])

  const value = useMemo(() => ({ user, loading, login, register, logout }), [user, loading, login, register, logout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth deve ser usado dentro de <AuthProvider>')
  return context
}
