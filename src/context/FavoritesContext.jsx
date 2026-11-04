import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { agents } from '../data/agents' 

const FavoritesContext = createContext(null)
const KEY = 'incorp:favorites'

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY))
    if (Array.isArray(saved)) return saved
  } catch {}
  return agents.filter((a) => a.fav).map((a) => a.id)
  })

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(favorites))
  }, [favorites])

  const toggleFavorite = useCallback((id) => {
    setFavorites((prev) => prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id])
  }, [])

  const isFavorite = useCallback((id) => favorites.includes(id), [favorites])

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export const useFavorites = () => useContext(FavoritesContext)