import { Navigate, Routes, Route } from 'react-router-dom'
import { isLoggedIn } from './lib/auth'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import NewEvent from './pages/NewEvent'
import EventPage from './pages/EventPage'
import ResultsPage from './pages/ResultsPage'

function ProtectedRoute({ children }) {
  return isLoggedIn() ? children : <Navigate to="/" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/new"
        element={
          <ProtectedRoute>
            <NewEvent />
          </ProtectedRoute>
        }
      />
      <Route path="/event/:id" element={<EventPage />} />
      <Route path="/event/:id/results" element={<ResultsPage />} />
    </Routes>
  )
}
