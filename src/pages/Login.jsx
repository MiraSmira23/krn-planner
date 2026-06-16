import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { checkPassword, isLoggedIn } from '../lib/auth'

export default function Login() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)

  useEffect(() => {
    if (isLoggedIn()) navigate('/dashboard', { replace: true })
  }, [navigate])

  function submit(e) {
    e.preventDefault()
    if (checkPassword(password)) {
      navigate('/dashboard', { replace: true })
    } else {
      setError(true)
    }
  }

  return (
    <div className="flex min-h-svh items-center justify-center px-4">
      <form
        onSubmit={submit}
        className="fade-up w-full max-w-[340px] rounded-[14px] border border-[#22222e] bg-[#16161f] p-6"
      >
        <div className="mb-1 text-[18px]">
          <span className="text-white">KRN</span>
          <span className="text-[#a78bfa]"> planner</span>
        </div>
        <p className="mb-5 text-[13px] text-[#6b6880]">
          Zadej heslo pro přístup do dashboardu.
        </p>

        <input
          type="password"
          autoFocus
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
            setError(false)
          }}
          placeholder="Heslo"
          className="mb-3 w-full rounded-[9px] border border-[#2a2a38] bg-[#1a1a24] px-3 py-2.5 text-[14px] text-[#e8e6f0] outline-none placeholder:text-[#6b6880] focus:border-[#7c6fe0]"
        />

        {error && (
          <p className="mb-3 text-[13px] text-[#d84050]">Špatné heslo.</p>
        )}

        <button
          type="submit"
          className="w-full rounded-[9px] bg-[#7c6fe0] py-2.5 text-[14px] text-white transition-all hover:-translate-y-px hover:bg-[#8f84e8]"
        >
          Vstoupit
        </button>
      </form>
    </div>
  )
}
