import { Link } from 'react-router-dom'

export default function Topbar({ eventTitle, right }) {
  return (
    <header
      className="flex items-center justify-between px-5 py-3.5"
      style={{ background: '#0f0f11', borderBottom: '1px solid #1e1e26' }}
    >
      <div className="flex items-center gap-3">
        <Link to="/dashboard" className="text-2xl font-semibold tracking-tight">
          <span className="text-white">KRN</span>
          <span className="text-[#a78bfa]"> planner</span>
        </Link>
        {eventTitle && (
          <span className="text-base text-[#4a4860]">· {eventTitle}</span>
        )}
      </div>
      {right}
    </header>
  )
}
