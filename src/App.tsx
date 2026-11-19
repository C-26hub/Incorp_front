import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ProfileProvider, useProfile } from './context/ProfileContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import AppLayout from './components/AppLayout'
import Login from './pages/login/Login'
import Cadastro from './pages/cadastro/Cadastro'
import Home from './pages/Home'
import Agents from './pages/Agents'
import Workspace from './pages/Workspace'
import LeadsWorkspace from './pages/LeadsWorkspace'
import SeoWorkspace from './pages/SeoWorkspace'
import SocialWorkspace from './pages/SocialWorkspace'
import ReportsWorkspace from './pages/ReportsWorkspace'
import TrafficWorkspace from './pages/TrafficWorkspace'
import History from './pages/History'
import Settings from './pages/Settings'
import Profile from './pages/Profile'
import Users from './pages/Users'

function CommercialLeadsRoute() {
  const { profile } = useProfile()
  return profile.dept === 'Comercial' ? <LeadsWorkspace /> : <Navigate to="/agentes" replace />
}

function AdministratorRoute() {
  const { user } = useAuth()
  return user?.role === 'ADMINISTRATOR' ? <Users /> : <Navigate to="/home" replace />
}

export default function App() {
  return (
    <AuthProvider>
      <ProfileProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />

            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/home" element={<Home />} />
                <Route path="/agentes" element={<Agents />} />
                <Route path="/agentes/lead" element={<CommercialLeadsRoute />} />
                <Route path="/agentes/seo" element={<SeoWorkspace />} />
                <Route path="/agentes/social" element={<SocialWorkspace />} />
                <Route path="/agentes/reports" element={<ReportsWorkspace />} />
                <Route path="/agentes/traffic" element={<TrafficWorkspace />} />
                <Route path="/agentes/:id" element={<Workspace />} />
                <Route path="/historico" element={<History />} />
                <Route path="/configuracoes" element={<Settings />} />
                <Route path="/perfil" element={<Profile />} />
                <Route path="/usuarios" element={<AdministratorRoute />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </ProfileProvider>
    </AuthProvider>
  )
}
