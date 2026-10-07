import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { Checkbox, PasswordInput, SelectInput, FieldShell } from '../../components/ui/Form'
import { BrandIcon } from '../../components/ui/Icon'
import { Divider, StepIndicator } from '../../components/ui/Misc'
import { COUNTRY_CODES } from '../../data/options'
import { isValidPhone, toE164 } from '../../lib/format'
import { authService } from '../../services/auth'
import { AuthLayout, FormError } from './AuthLayout'

export const PENDING_PHONE_KEY = 'bmm.pendingPhone'

// Password rules are not specified in the PRD; 8+ characters with a letter and a number is provisional.
const passwordProblem = (p: string) => (p.length < 8 || !/[A-Za-z]/.test(p) || !/\d/.test(p) ? 'Use at least 8 characters, including a letter and a number.' : '')

export default function Register() {
  const navigate = useNavigate()
  const [code, setCode] = useState('+44')
  const [number, setNumber] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [agree, setAgree] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState('')
  const [busy, setBusy] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    const next: Record<string, string> = {}
    if (!number.trim()) next.number = 'Enter your mobile number.'
    else if (!isValidPhone(number)) next.number = 'Enter a valid mobile number.'
    const pw = passwordProblem(password)
    if (pw) next.password = pw
    if (!confirm) next.confirm = 'Re-enter your password.'
    else if (confirm !== password) next.confirm = 'Passwords do not match.'
    if (!agree) next.agree = 'You must agree to continue.'
    setErrors(next)
    setFormError('')
    if (Object.keys(next).length) return

    const phone = toE164(code, number)
    setBusy(true)
    try {
      await authService.signUp(phone, password)
      sessionStorage.setItem(PENDING_PHONE_KEY, phone)
      navigate('/verify-otp')
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
      <StepIndicator active={1} />
      <h1 className="text-[30px] text-primary">Create Your Account</h1>
      <p className="mb-7 mt-1.5 text-text-muted">Join BMM and take the first step towards your life partner</p>
      <FormError>{formError}</FormError>
      <form onSubmit={onSubmit} noValidate className="space-y-5">
        <FieldShell label="Mobile Number" required htmlFor="reg-mobile" error={errors.number}>
          <div className="flex gap-2">
            <SelectInput id="reg-code" aria-label="Country code" className="w-[84px] shrink-0" options={COUNTRY_CODES} value={code} onChange={(e) => setCode(e.target.value)} />
            <input
              id="reg-mobile"
              type="tel"
              inputMode="tel"
              autoComplete="tel-national"
              placeholder="Enter your mobile number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              aria-invalid={!!errors.number}
              aria-describedby={errors.number ? 'reg-mobile-error' : undefined}
              className={`h-control min-w-0 flex-1 rounded-sm border bg-white px-4 text-base placeholder:text-text-faint focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary ${errors.number ? 'border-danger' : 'border-border'}`}
            />
          </div>
        </FieldShell>
        <PasswordInput label="Password" required placeholder="Create a strong password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} error={errors.password} />
        <PasswordInput label="Confirm Password" required placeholder="Re-enter your password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} error={errors.confirm} />
        <Checkbox checked={agree} onChange={setAgree} error={errors.agree}>
          {/* Terms and Privacy pages are not designed (PRD 10.2), so these are not links yet. */}
          I agree to the <span className="font-medium text-primary">Terms &amp; Conditions</span> and <span className="font-medium text-primary">Privacy Policy</span>
        </Checkbox>
        <Button type="submit" full disabled={busy}>
          {busy ? 'Creating account…' : 'Create Account'}
        </Button>
      </form>
      <Divider />
      <Button variant="secondary" full onClick={onGoogle}>
        <BrandIcon name="google" /> Continue with Google
      </Button>
      <p className="mt-6 text-center text-sm text-text-muted">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-primary hover:underline">
          Login
        </Link>
      </p>
    </AuthLayout>
  )
}
