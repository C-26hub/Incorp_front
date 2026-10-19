import { Routes, Route, Navigate } from 'react-router-dom'

import Login from './pages/login/Login'
import Layout from './components/Layout'

import Home from './pages/Home'
import Agents from './pages/Agents'
import Dashboard from './pages/Dashboard'
import History from './pages/History'
import Favorites from './pages/Favorites'
import Settings from './pages/Settings'
import Cadastro from "./pages/cadastro/Cadastro";

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />

      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/agentes" element={<Agents />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/historico" element={<History />} />
        <Route path="/favoritos" element={<Favorites />} />
        <Route path="/configuracoes" element={<Settings />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App