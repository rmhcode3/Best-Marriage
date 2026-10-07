import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { Icon } from '../../components/ui/Icon'
import { useApp } from '../../context/AppContext'
import { REVIEW_INDEX, STEPS } from '../../data/onboarding'
import { formatDate } from '../../lib/format'
import { validateFields } from '../../lib/validate'
import type { ProfileData } from '../../types'
import { FormError } from '../auth/AuthLayout'
import { OnboardingLayout } from './OnboardingLayout'

type Card = { title: string; step: string; left: [string, (d: ProfileData, photos: number) => string]; right?: [string, (d: ProfileData, photos: number) => string] }

const s = (d: ProfileData, k: string) => {
  const v = d[k]
  return (Array.isArray(v) ? v.join(', ') : v) || '—'
}

// PRD O10: nine summary cards, two values each (order as designed).
const CARDS: Card[] = [
  { title: 'Personal Information', step: 'personal', left: ['Name', (d) => [d.firstName, d.lastName].filter(Boolean).join(' ') || '—'], right: ['Date of Birth', (d) => (d.dob ? formatDate(String(d.dob)) : '—')] },
  { title: 'Education & Career', step: 'education', left: ['Education', (d) => s(d, 'highestEducation')], right: ['Occupation', (d) => s(d, 'occupation')] },
  { title: 'Location & Residency', step: 'location', left: ['Current Location', (d) => [d.currentLocation, d.country].filter(Boolean).join(', ') || '—'], right: ['Residential Status', (d) => s(d, 'residentialStatus')] },
  { title: 'Family Details', step: 'family', left: ['Family Type', (d) => s(d, 'familyType')], right: ['Family Values', (d) => s(d, 'familyValues')] },
  { title: 'Tamil Cultural Information', step: 'culture', left: ['Caste / Community', (d) => s(d, 'caste')], right: ['Star (Nakshatram)', (d) => s(d, 'star')] },
  { title: 'Marriage Intentions', step: 'marriage', left: ['Looking For', (d) => s(d, 'lookingFor')], right: ['Preferred Place to Settle', (d) => s(d, 'preferredPlace')] },
  { title: 'Partner Preferences', step: 'partner', left: ['Preferred Age Range', (d) => s(d, 'prefAge')], right: ['Location Preference', (d) => s(d, 'prefLocation')] },
  { title: 'Photos', step: 'photos', left: ['Photos Uploaded', (_d, n) => `${n} ${n === 1 ? 'Photo' : 'Photos'}`], right: ['Profile Photo', (_d, n) => (n > 0 ? 'Added' : 'Not added')] },
  { title: 'About You', step: 'about', left: ['About Me', (d) => s(d, 'about')] },
]

export default function ReviewPage() {
  const navigate = useNavigate()
  const { profile, submitProfile } = useApp()
  const [error, setError] = useState('')
  const [missing, setMissing] = useState<{ title: string; path: string } | null>(null)
  const [busy, setBusy] = useState(false)

  async function onSubmit() {
    setError('')
    setMissing(null)
    for (const step of STEPS) {
      if (Object.keys(validateFields(step.fields, profile.data)).length) {
        setError(`Some required details are missing in “${step.stepLabel}”.`)
        setMissing({ title: step.stepLabel, path: `${step.path}?from=review` })
        return
      }
    }
    setBusy(true)
    try {
      await submitProfile()
      navigate('/app/dashboard', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <OnboardingLayout stepIndex={REVIEW_INDEX}>
      <div className="rounded-xl border border-border-light bg-white p-5 shadow-sm sm:p-8">
        <h1 className="text-2xl md:text-3xl">Review &amp; Submit</h1>
        <p className="mb-6 mt-1.5 text-text-muted">{STEPS[REVIEW_INDEX].helper}</p>
        <FormError>{error}</FormError>
        {missing && (
          <p className="-mt-2 mb-4 text-sm">
            <Link to={missing.path} className="font-semibold text-primary hover:underline">
              Go to {missing.title}
            </Link>
          </p>
        )}
        <div className="space-y-3">
          {CARDS.map((c) => {
            const step = STEPS.find((x) => x.id === c.step)!
            return (
              <section key={c.title} className="rounded-md border border-border-light p-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-sans text-base font-semibold">{c.title}</h2>
                  <Link to={`${step.path}?from=review`} className="inline-flex items-center gap-1.5 rounded-sm px-2 py-1 text-sm font-medium text-primary hover:bg-tint-2" aria-label={`Edit ${c.title}`}>
                    <Icon name="pencil" size={15} /> Edit
                  </Link>
                </div>
                <dl className="mt-3 grid gap-3 sm:grid-cols-2">
                  {[c.left, c.right].filter(Boolean).map((pair) => {
                    const [label, get] = pair as Card['left']
                    return (
                      <div key={label} className={c.right ? '' : 'sm:col-span-2'}>
                        <dt className="text-xs text-text-subtle">{label}</dt>
                        <dd className="mt-0.5 break-words text-sm font-medium text-text-strong">{get(profile.data, profile.photos.length)}</dd>
                      </div>
                    )
                  })}
                </dl>
              </section>
            )
          })}
        </div>
        <div className="mt-8 flex justify-between gap-3">
          <Button variant="secondary" className="min-w-24 border-primary text-primary hover:bg-tint-3" onClick={() => navigate(STEPS[REVIEW_INDEX - 1].path)}>
            <Icon name="arrowLeft" size={18} /> Back
          </Button>
          <Button className="flex-1 whitespace-nowrap sm:min-w-44 sm:flex-none" onClick={onSubmit} disabled={busy}>
            {busy ? 'Submitting…' : 'Submit Profile'} <Icon name="arrowRight" size={18} />
          </Button>
        </div>
      </div>
    </OnboardingLayout>
  )
}
