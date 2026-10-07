import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { BrandIcon } from '../../components/ui/Icon'
import { TextInput, PasswordInput } from '../../components/ui/Form'
import { Divider } from '../../components/ui/Misc'
import { isMockAuth, authService } from '../../services/auth'
import { isValidEmail, isValidPhone, toE164 } from '../../lib/format'
import { AuthLayout, FormError } from './AuthLayout'

/** Email stays as-is; a mobile number without a country code is assumed to be UK (+44) — provisional. */
function normaliseIdentifier(raw: string): string {
  const v = raw.trim()
  if (v.includes('@')) return v
  return v.startsWith('+') ? `+${v.replace(/\D/g, '')}` : toE164('+44', v)
}

export default function Login() {
  const navigate = useNavigate()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState('')
  const [busy, setBusy] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    const next: Record<string, string> = {}
    const id = identifier.trim()
    if (!id) next.identifier = 'Enter your email or mobile number.'
    else if (id.includes('@') ? !isValidEmail(id) : !isValidPhone(id)) next.identifier = 'Enter a valid email or mobile number.'
    if (!password) next.password = 'Enter your password.'
    setErrors(next)
    setFormError('')
    if (Object.keys(next).length) return

    setBusy(true)
    try {
      await authService.signIn(normaliseIdentifier(id), password)
      // Route guards send the user to the dashboard or back to the onboarding step they stopped at.
      navigate('/app/dashboard', { replace: true })
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setBusy(false)
    }
  }

  async function onGoogle() {
    setFormError('')
    try {
      await authService.signInWithGoogle()
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Something went wrong.')
    }
  }

  return (
    <AuthLayout hero>
      <h1 className="text-[34px] text-primary">Welcome Back</h1>
      <p className="mb-7 mt-1.5 text-text-muted">Login to continue your journey with BMM</p>
      <FormError>{formError}</FormError>
      <form onSubmit={onSubmit} noValidate className="space-y-5">
        <TextInput
          label="Email ID / Mobile Number"
          icon="mail"
          placeholder="Enter your email or mobile number"
          autoComplete="username"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          error={errors.identifier}
        />
        <PasswordInput label="Password" placeholder="Enter your password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} />
        <div className="text-right">
          {/* Forgot-password screen is not designed (PRD 10.2) — no destination yet. */}
          <span className="cursor-default text-sm font-medium text-primary" title="Coming soon">
            Forgot password?
          </span>
        </div>
        <Button type="submit" full disabled={busy}>
          {busy ? 'Logging in…' : 'Log In'}
        </Button>
      </form>
      <Divider />
      <Button variant="secondary" full onClick={onGoogle}>
        <BrandIcon name="google" /> Continue with Google
      </Button>
      <p className="mt-6 text-center text-sm text-text-muted">
        New to BMM?{' '}
        <Link to="/register" className="font-semibold text-primary hover:underline">
          Create an account
        </Link>
      </p>
      {isMockAuth && <p className="mt-4 rounded-sm bg-tint-4 p-2 text-center text-xs text-text-subtle">Dev mode: Supabase is not configured, so accounts are stored locally in this browser.</p>}
    </AuthLayout>
  )
}
