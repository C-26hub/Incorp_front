import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Agents from './pages/Agents'
import Dashboard from './pages/Dashboard'
import History from './pages/History'
import Favorites from './pages/Favorites'
import Settings from './pages/Settings'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/agentes" element={<Agents />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/historico" element={<History />} />
        <Route path="/favoritos" element={<Favorites />} />
        <Route path="/configuracoes" element={<Settings />} />
      </Route>
    </Routes>
  )
}