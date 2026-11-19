import { createContext, useCallback, useContext, useState } from 'react'
import { useAuth } from './AuthContext'
import { DEPARTMENTS } from '../data/agents'

/** @type {import('react').Context<any>} */
const ProfileContext = createContext(null)
const PROFILE_KEY = 'incorp:profile'

function loadDepartment() {
  try {
    const savedProfile = JSON.parse(localStorage.getItem(PROFILE_KEY))
    if (DEPARTMENTS.includes(savedProfile?.dept)) return savedProfile.dept
  } catch {
    // Ignora dados de perfil inválidos.
  }
  return 'Marketing'
}

export function getInitials(name = '') {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export function ProfileProvider({ children }) {
  const { user } = useAuth()
  const [dept, setDept] = useState(loadDepartment)
  const [photoState, setPhotoState] = useState({ userId: null, value: '' })
  const photo = photoState.userId === user?.id ? photoState.value : (() => {
    if (!user) return ''
    try {
      return localStorage.getItem(`incorp:profile:photo:${user.id}`) ?? ''
    } catch {
      return ''
    }
  })()

  const updateProfile = useCallback((patch) => {
    if (patch.dept && DEPARTMENTS.includes(patch.dept)) {
      setDept(patch.dept)
      try {
        localStorage.setItem(PROFILE_KEY, JSON.stringify({ dept: patch.dept }))
      } catch {
        // O departamento selecionado continua disponível durante esta sessão.
      }
    }

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