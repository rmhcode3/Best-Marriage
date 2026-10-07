import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { MAX_PHOTOS, STEPS } from '../data/onboarding'
import { authService } from '../services/auth'
import { profileService } from '../services/profile'
import type { Account, ProfileData, ProfileRecord } from '../types'

/** PRD 1.1 user states, plus the short window before the mobile number is verified. */
export type UserState = 'loading' | 'guest' | 'unverified' | 'registering' | 'member'

type AppContextValue = {
  state: UserState
  account: Account | null
  profile: ProfileRecord
  completion: number
  /** Saves the fields of one step and advances the "furthest step reached" marker. */
  saveStep: (stepIndex: number, values: ProfileData) => Promise<void>
  setPhotos: (photos: string[]) => Promise<void>
  submitProfile: () => Promise<void>
  signOut: () => Promise<void>
}

const emptyProfile: ProfileRecord = { data: {}, step: 0, photos: [], submitted: false }

const AppContext = createContext<AppContextValue | null>(null)

const isFilled = (v: string | string[] | undefined) => (Array.isArray(v) ? v.length > 0 : Boolean(v && v.trim()))

export function computeCompletion(profile: ProfileRecord): number {
  const required = STEPS.flatMap((s) => s.fields.filter((f) => f.required))
  const filled = required.filter((f) => isFilled(profile.data[f.name])).length + (profile.photos.length > 0 ? 1 : 0)
  return Math.round((filled / (required.length + 1)) * 100)
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<Account | null>(null)
  const [profile, setProfile] = useState<ProfileRecord>(emptyProfile)
  const [ready, setReady] = useState(false)
  // Latest profile for async handlers; kept in sync wherever the profile state is set.
  const profileRef = useRef(profile)

  // Follow the auth session.
  useEffect(() => {
    let cancelled = false
    authService.getAccount().then((a) => {
      if (cancelled) return
      setAccount(a)
      if (!a) setReady(true)
    })
    const unsub = authService.subscribe((a) => {
      setAccount(a)
      if (!a) {
        profileRef.current = emptyProfile
        setProfile(emptyProfile)
        setReady(true)
      }
    })
    return () => {
      cancelled = true
      unsub()
    }
  }, [])

  // Load the stored profile once the account is known.
  const accountId = account?.id
  useEffect(() => {
    if (!accountId) return
    let cancelled = false
    profileService.load(accountId).then((p) => {
      if (cancelled) return
      profileRef.current = p
      setProfile(p)
      setReady(true)
    })
    return () => {
      cancelled = true
    }
  }, [accountId])

  const persist = useCallback(
    async (next: ProfileRecord) => {
      if (!account) return
      profileRef.current = next
      setProfile(next)
      await profileService.save(account.id, next)
    },
    [account],
  )

  const value = useMemo<AppContextValue>(() => {
    let state: UserState = 'member'
    if (!ready) state = 'loading'
    else if (!account) state = 'guest'
    else if (!account.phoneVerified) state = 'unverified'
    else if (!profile.submitted) state = 'registering'

    return {
      state,
      account,
      profile,
      completion: computeCompletion(profile),
      saveStep: async (stepIndex, values) => {
        const cur = profileRef.current
        await persist({ ...cur, data: { ...cur.data, ...values }, step: Math.max(cur.step, stepIndex + 1) })
      },
      setPhotos: async (photos) => persist({ ...profileRef.current, photos: photos.slice(0, MAX_PHOTOS) }),
      submitProfile: async () => persist({ ...profileRef.current, submitted: true }),
      signOut: () => authService.signOut(),
    }
  }, [account, profile, ready, persist])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useApp(): AppContextValue {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}
