import { useState, type FormEvent, type ReactNode } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { FieldRenderer } from '../../components/forms/FieldRenderer'
import { Button } from '../../components/ui/Button'
import { Icon } from '../../components/ui/Icon'
import { StepIndicator } from '../../components/ui/Misc'
import { useApp } from '../../context/AppContext'
import { REVIEW_INDEX, STEPS } from '../../data/onboarding'
import { validateFields } from '../../lib/validate'
import type { ProfileData } from '../../types'
import { FormError } from '../auth/AuthLayout'
import { OnboardingLayout } from './OnboardingLayout'

/**
 * Shared card + footer buttons for every onboarding step.
 * "Back" goes to the previous step (or Review when editing from Review); "Save & Continue"
 * saves, then goes forward (or back to Review when editing from Review).
 */
export function StepFrame({
  index,
  onSubmit,
  busy,
  error,
  children,
}: {
  index: number
  onSubmit: () => void
  busy?: boolean
  error?: string
  children: ReactNode
}) {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const step = STEPS[index]
  const fromReview = params.get('from') === 'review'
  // The Family Details mobile design centres its heading (the other steps are left-aligned).
  const centered = step.id === 'family'

  return (
    <OnboardingLayout stepIndex={index}>
      <form
        onSubmit={(e: FormEvent) => {
          e.preventDefault()
          onSubmit()
        }}
        noValidate
        className="rounded-xl border border-border-light bg-white p-5 shadow-sm sm:p-8"
      >
        {index === 0 && (
          <div className="lg:hidden">
            <StepIndicator active={3} />
          </div>
        )}
        {index === 0 && <h1 className="text-[26px] md:text-3xl">Complete Your Profile</h1>}
        {index === 0 ? (
          <>
            <p className="mt-1.5 text-sm text-text-muted md:text-base">{step.helper}</p>
            <h2 className="mb-6 mt-5 font-heading text-xl font-semibold text-primary">Personal Information</h2>
          </>
        ) : (
          <>
            <h2 className={`text-[24px] md:text-3xl ${centered ? "text-center md:text-left" : ""}`}>{step.title}</h2>
            <p className={`mb-6 mt-1.5 text-text-muted ${centered ? "text-center md:text-left" : ""}`}>{step.helper}</p>
          </>
        )}
        <FormError>{error}</FormError>
        {children}
        <div className={`mt-8 flex gap-3 ${index === 0 ? 'justify-end' : 'justify-between'}`}>
          {index > 0 && (
            <Button variant="secondary" className="min-w-24 border-primary text-primary hover:bg-tint-3" onClick={() => navigate(fromReview ? STEPS[REVIEW_INDEX].path : STEPS[index - 1].path)}>
              <Icon name="arrowLeft" size={18} /> Back
            </Button>
          )}
          <Button type="submit" className="flex-1 whitespace-nowrap sm:min-w-44 sm:flex-none" disabled={busy}>
            {busy ? 'Saving…' : 'Save & Continue'} <Icon name="arrowRight" size={18} />
          </Button>
        </div>
      </form>
    </OnboardingLayout>
  )
}

export default function StepPage({ index }: { index: number }) {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { profile, account, saveStep } = useApp()
  const step = STEPS[index]
  const fromReview = params.get('from') === 'review'

  const [values, setValues] = useState<ProfileData>(() => {
    const seed: ProfileData = { ...profile.data }
    if (step.fields.some((f) => f.name === 'phone') && !seed.phone && account?.phone) seed.phone = account.phone
    if (step.fields.some((f) => f.name === 'email') && !seed.email && account?.email) seed.email = account.email
    return seed
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState('')
  const [busy, setBusy] = useState(false)

  function onChange(name: string, value: string | string[]) {
    setValues((v) => ({ ...v, [name]: value }))
    if (errors[name]) setErrors((e) => ({ ...e, [name]: '' }))
  }

  async function onSubmit() {
    const found = validateFields(step.fields, values)
    setErrors(found)
    setFormError('')
    if (Object.keys(found).length) {
      setFormError('Please fix the highlighted fields to continue.')
      requestAnimationFrame(() => document.querySelector('[aria-invalid="true"]')?.scrollIntoView({ block: 'center', behavior: 'smooth' }))
      return
    }
    setBusy(true)
    try {
      // Only persist this step's own fields (plus the range pair for height).
      const own: ProfileData = {}
      for (const f of step.fields) {
        if (f.type === 'heightRange') {
          own[`${f.name}Min`] = values[`${f.name}Min`] ?? ''
          own[`${f.name}Max`] = values[`${f.name}Max`] ?? ''
        } else own[f.name] = values[f.name] ?? (f.type === 'chips' ? [] : '')
      }
      await saveStep(index, own)
      navigate(fromReview ? STEPS[REVIEW_INDEX].path : STEPS[index + 1].path)
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <StepFrame index={index} onSubmit={onSubmit} busy={busy} error={formError}>
      <div className="grid gap-5 md:grid-cols-2">
        {step.fields.map((f) => (
          <div key={f.name} className={`${f.wide ? 'md:col-span-2' : ''} ${f.desktopOnly ? 'hidden md:block' : ''}`}>
            <FieldRenderer field={f} values={values} errors={errors} onChange={onChange} />
          </div>
        ))}
      </div>
    </StepFrame>
  )
}
