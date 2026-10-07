import { useEffect, useRef, useState, type ClipboardEvent, type KeyboardEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { Divider, StepIndicator } from '../../components/ui/Misc'
import { Icon } from '../../components/ui/Icon'
import { useApp } from '../../context/AppContext'
import { authService, isMockAuth, MOCK_OTP } from '../../services/auth'
import { AuthLayout, FormError } from './AuthLayout'
import { PENDING_PHONE_KEY } from './Register'

const LENGTH = 6
const RESEND_SECONDS = 45

export default function VerifyOtp() {
  const navigate = useNavigate()
  const { account } = useApp()
  const phone = sessionStorage.getItem(PENDING_PHONE_KEY) ?? account?.phone ?? ''
  const [digits, setDigits] = useState<string[]>(Array(LENGTH).fill(''))
  const [seconds, setSeconds] = useState(RESEND_SECONDS)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const refs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    if (seconds <= 0) return
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000)
    return () => clearTimeout(t)
  }, [seconds])

  useEffect(() => {
    refs.current[0]?.focus()
  }, [])

  if (!phone) return <Navigate to="/register" replace />

  const setAt = (i: number, v: string) => setDigits((d) => d.map((x, idx) => (idx === i ? v : x)))

  function onChange(i: number, raw: string) {
    const v = raw.replace(/\D/g, '').slice(-1)
    setAt(i, v)
    if (v && i < LENGTH - 1) refs.current[i + 1]?.focus()
  }

  function onKeyDown(i: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !digits[i] && i > 0) refs.current[i - 1]?.focus()
    if (e.key === 'ArrowLeft' && i > 0) refs.current[i - 1]?.focus()
    if (e.key === 'ArrowRight' && i < LENGTH - 1) refs.current[i + 1]?.focus()
  }

  function onPaste(e: ClipboardEvent) {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, LENGTH)
    if (!pasted) return
    e.preventDefault()
    setDigits(Array.from({ length: LENGTH }, (_, i) => pasted[i] ?? ''))
    refs.current[Math.min(pasted.length, LENGTH - 1)]?.focus()
  }

  async function onVerify() {
    const code = digits.join('')
    if (code.length < LENGTH) return setError('Enter the 6-digit code.')
    setError('')
    setBusy(true)
    try {
      await authService.verifyOtp(phone, code)
      sessionStorage.removeItem(PENDING_PHONE_KEY)
      navigate('/onboarding/personal', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
      setDigits(Array(LENGTH).fill(''))
      refs.current[0]?.focus()
    } finally {
      setBusy(false)
    }
  }

  async function onResend() {
    setError('')
    try {
      await authService.resendOtp(phone)
      setSeconds(RESEND_SECONDS)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not resend the code.')
    }
  }

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0')
  const ss = String(seconds % 60).padStart(2, '0')

  return (
    <AuthLayout hero>
      <StepIndicator active={2} />
      <h1 className="text-center text-[22px] sm:text-3xl">Verify Your Mobile Number</h1>
      <p className="mt-2 text-center text-text-muted">
        We have sent a 6-digit OTP to <strong className="text-text-strong">{phone}</strong>
      </p>
      <p className="mb-8 mt-1 text-center text-sm text-text-muted">Enter the code below to verify your number.</p>
      <FormError>{error}</FormError>
      <div className="flex justify-between gap-2 sm:justify-center sm:gap-3" onPaste={onPaste}>
        {digits.map((d, i) => (
          <input
            key={i}
            ref={(el) => {
              refs.current[i] = el
            }}
            value={d}
            onChange={(e) => onChange(i, e.target.value)}
            onKeyDown={(e) => onKeyDown(i, e)}
            inputMode="numeric"
            autoComplete={i === 0 ? 'one-time-code' : 'off'}
            maxLength={2}
            aria-label={`Digit ${i + 1}`}
            className="aspect-square h-auto w-full max-w-[52px] rounded-sm border border-border bg-white text-center text-xl font-semibold text-text-strong focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        ))}
      </div>
      <p className="mt-5 text-center text-sm text-text-muted">
        Didn't receive the code?{' '}
        {seconds > 0 ? (
          <span>
            <span className="text-primary">Resend OTP</span> in <span className="font-semibold text-primary tabular-nums">{mm}:{ss}</span>
          </span>
        ) : (
          <button type="button" onClick={onResend} className="font-semibold text-primary hover:underline">
            Resend OTP
          </button>
        )}
      </p>
      <Button full className="mt-6" onClick={onVerify} disabled={busy}>
        {busy ? 'Verifying…' : 'Verify & Continue'} <Icon name="arrowRight" size={18} />
      </Button>
      <Divider />
      <Button variant="secondary" full onClick={() => navigate('/register')}>
        <Icon name="arrowLeft" size={18} className="text-primary" /> Change Number
      </Button>
      {isMockAuth && (
        <p className="mt-4 rounded-sm bg-tint-4 p-2 text-center text-xs text-text-subtle">
          Dev mode: no SMS is sent. Use code <strong>{MOCK_OTP}</strong>.
        </p>
      )}
    </AuthLayout>
  )
}
