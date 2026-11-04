import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { agents } from '../data/agents'

// Chave nova (v2): ignora a lista vazia que a versão anterior pode ter salvo.
const KEY = 'incorp:favorites:v2'

const FavoritesContext = createContext(null)

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY))
      if (Array.isArray(saved)) return saved
    } catch {
      /* ignora dados corrompidos */
    }
    // primeira vez: começa com os agentes marcados com fav: true em data/agents
    return agents.filter((a) => a.fav).map((a) => a.id)
  })

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(favorites))
    } catch {
      /* armazenamento bloqueado: os favoritos valem só nesta sessão */
    }
  }, [favorites])

  const toggleFavorite = useCallback((id) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]))
  }, [])

  const isFavorite = useCallback((id) => favorites.includes(id), [favorites])

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext)
  if (!ctx) throw new Error('useFavorites deve ser usado dentro de <FavoritesProvider>')
  return ctx
}