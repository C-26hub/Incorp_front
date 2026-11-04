import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { FavoritesProvider } from './context/FavoritesContext'
import ProtectedRoute from './components/ProtectedRoute'
import AppLayout from './components/AppLayout' // navbar + <Outlet />
import Login from './pages/login/Login'
import Cadastro from './pages/cadastro/Cadastro'
import Home from './pages/Home'
import Agents from './pages/Agents'
import Workspace from './pages/Workspace'
import Dashboard from './pages/Dashboard'
import History from './pages/History'
import Settings from './pages/Settings'

export default function App() {
  return (
    <FavoritesProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/home" element={<Home />} />
              <Route path="/agentes" element={<Agents />} />
              <Route path="/agentes/:id" element={<Workspace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/historico" element={<History />} />
              <Route path="/configuracoes" element={<Settings />} />
              {/* rota antiga: redireciona para o filtro de favoritos */}
              <Route path="/favoritos" element={<Navigate to="/agentes?filtro=favoritos" replace />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </FavoritesProvider>
  )
}