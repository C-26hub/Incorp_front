import { createContext, useCallback, useContext, useEffect, useState } from 'react'

const KEY = 'incorp:profile'

const DEFAULT_PROFILE = {
  name: 'Ana Souza',
  email: 'ana.souza@incorp.com.br',
  role: 'Admin',
  dept: 'Marketing',
  photo: '', // imagem em base64 (data URL); vazio = mostra as iniciais
}

const ProfileContext = createContext(null)

export function getInitials(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export function ProfileProvider({ children }) {
  const [profile, setProfile] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY))
      if (saved && typeof saved === 'object') return { ...DEFAULT_PROFILE, ...saved }
    } catch {
      /* ignora dados corrompidos */
    }
    return DEFAULT_PROFILE
  })

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(profile))
    } catch {
      /* armazenamento cheio ou bloqueado: o perfil vale só nesta sessão */
    }
  }, [profile])

  const updateProfile = useCallback((patch) => {
    setProfile((current) => ({ ...current, ...patch }))
  }, [])

  return (
    <ProfileContext.Provider value={{ profile, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfile() {
  const ctx = useContext(ProfileContext)
  if (!ctx) throw new Error('useProfile deve ser usado dentro de <ProfileProvider>')
  return ctx
}