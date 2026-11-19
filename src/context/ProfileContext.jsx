import { createContext, useCallback, useContext, useState } from 'react'
import { useAuth } from './AuthContext'
import { DEPARTMENT_LABELS } from '../data/agents'

/** @type {import('react').Context<any>} */
const ProfileContext = createContext(null)

export function getInitials(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export function ProfileProvider({ children }) {
  const { user } = useAuth()
  const [photoState, setPhotoState] = useState({ userId: null, value: '' })
  const dept = DEPARTMENT_LABELS[user?.department] ?? 'Marketing'
  const photo = photoState.userId === user?.id ? photoState.value : (() => {
    if (!user) return ''
    try {
      return localStorage.getItem(`incorp:profile:photo:${user.id}`) ?? ''
    } catch {
      return ''
    }
  })()

  const updateProfile = useCallback((patch) => {
    if (user && Object.hasOwn(patch, 'photo')) {
      const nextPhoto = patch.photo ?? ''
      setPhotoState({ userId: user.id, value: nextPhoto })
      try {
        if (nextPhoto) localStorage.setItem(`incorp:profile:photo:${user.id}`, nextPhoto)
        else localStorage.removeItem(`incorp:profile:photo:${user.id}`)
      } catch {
        // A foto continua disponível durante esta sessão se o armazenamento falhar.
      }
    }
  }, [user])

  const profile = {
    name: user ? `${user.name} ${user.surname}`.trim() : '',
    email: user?.email ?? '',
    role: user?.role === 'ADMINISTRATOR' ? 'Administrador' : 'Usuário',
    dept,
    photo,
  }

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