import { Navigate, Outlet } from 'react-router-dom'

export default function ProtectedRoute() {
  const logged = localStorage.getItem('incorp:auth') === 'true'
  return logged ? <Outlet /> : <Navigate to="/login" replace />
}