import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import NewEvent from './pages/NewEvent'
import EventPage from './pages/EventPage'
import ResultsPage from './pages/ResultsPage'
import { isLoggedIn } from './lib/auth'

function Protected({ children }) {
  return isLoggedIn() ? children : <Navigate to="/" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <Protected>
              <Dashboard />
            </Protected>
          }
        />
        <Route
          path="/dashboard/new"
          element={
            <Protected>
              <NewEvent />
            </Protected>
          }
        />
        <Route path="/event/:id" element={<EventPage />} />
        <Route path="/event/:id/results" element={<ResultsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
