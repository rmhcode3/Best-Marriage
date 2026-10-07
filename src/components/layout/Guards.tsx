import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { STEPS } from '../../data/onboarding'
import { useApp, type UserState } from '../../context/AppContext'

export function Splash() {
  return (
    <div className="grid min-h-screen place-items-center" role="status" aria-label="Loading">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-tint-1 border-t-primary" />
    </div>
  )
}

/** Where a user in a given state belongs (PRD 1.1). */
export function homeFor(state: UserState, step = 0): string {
  switch (state) {
    case 'member':
      return '/app/dashboard'
    case 'registering':
      return STEPS[Math.min(step, STEPS.length - 1)].path
    case 'unverified':
      return '/verify-otp'
    default:
      return '/login'
  }
}

/** Public pages: a registering user is kept inside onboarding until the profile is submitted. */
export function PublicOnly() {
  const { state, profile } = useApp()
  if (state === 'loading') return <Splash />
  if (state === 'registering' || state === 'unverified') return <Navigate to={homeFor(state, profile.step)} replace />
  return <Outlet />
}

/** Login / register / OTP are for people who are not signed in (OTP also for unverified). */
export function GuestOnly({ allow }: { allow?: UserState[] }) {
  const { state, profile } = useApp()
  if (state === 'loading') return <Splash />
  if (state !== 'guest' && !allow?.includes(state)) return <Navigate to={homeFor(state, profile.step)} replace />
  return <Outlet />
}

/** Onboarding: only for verified accounts whose profile is not yet submitted. */
export function RegisteringOnly() {
  const { state, profile } = useApp()
  const { pathname } = useLocation()
  if (state === 'loading') return <Splash />
  if (state === 'registering') {
    // A registering user may revisit earlier steps and the furthest step reached, never skip ahead.
    const idx = STEPS.findIndex((s) => s.path === pathname)
    const furthest = Math.min(profile.step, STEPS.length - 1)
    if (idx > furthest) return <Navigate to={STEPS[furthest].path} replace />
    return <Outlet />
  }
  return <Navigate to={state === 'guest' ? '/login' : homeFor(state, profile.step)} replace />
}

/** Member routes. A registering user stays inside onboarding until the profile is submitted. */
export function MemberOnly() {
  const { state, profile } = useApp()
  if (state === 'loading') return <Splash />
  if (state === 'member') return <Outlet />
  return <Navigate to={homeFor(state, profile.step)} replace />
}
