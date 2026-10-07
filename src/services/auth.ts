import type { Account } from '../types'
import { isSupabaseConfigured, supabase } from '../lib/supabase'

/**
 * Auth service. Uses Supabase when configured; otherwise a local MOCK that exists
 * only so the app can be exercised before a Supabase project is connected.
 * Mock OTP is always MOCK_OTP. Never ship the mock: it keeps data in localStorage.
 */
export const MOCK_OTP = '123456'
export const isMockAuth = !isSupabaseConfigured

type Listener = (account: Account | null) => void

const listeners = new Set<Listener>()
const emit = (a: Account | null) => listeners.forEach((l) => l(a))

// ---------- mock implementation ----------
type MockUser = { id: string; phone: string; hash: string; verified: boolean; email?: string }
const USERS_KEY = 'bmm.mock.users'
const SESSION_KEY = 'bmm.mock.session'

const readUsers = (): Record<string, MockUser> => {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) ?? '{}')
  } catch {
    return {}
  }
}
const writeUsers = (u: Record<string, MockUser>) => localStorage.setItem(USERS_KEY, JSON.stringify(u))

async function sha256(text: string) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, '0')).join('')
}

const toAccount = (u: MockUser): Account => ({ id: u.id, phone: u.phone, email: u.email, phoneVerified: u.verified })

function mockCurrent(): Account | null {
  const phone = localStorage.getItem(SESSION_KEY)
  const user = phone ? readUsers()[phone] : undefined
  return user ? toAccount(user) : null
}

// ---------- public API ----------
export const authService = {
  async getAccount(): Promise<Account | null> {
    if (supabase) {
      const { data } = await supabase.auth.getSession()
      return data.session ? fromSupabase(data.session.user) : null
    }
    return mockCurrent()
  },

  subscribe(cb: Listener): () => void {
    listeners.add(cb)
    let unsub = () => {}
    if (supabase) {
      const { data } = supabase.auth.onAuthStateChange((_e, session) => cb(session ? fromSupabase(session.user) : null))
      unsub = () => data.subscription.unsubscribe()
    }
    return () => {
      listeners.delete(cb)
      unsub()
    }
  },

  /** Creates the account and sends a 6-digit OTP to the phone. */
  async signUp(phone: string, password: string): Promise<void> {
    if (supabase) {
      const { error } = await supabase.auth.signUp({ phone, password })
      if (error) throw new Error(error.message)
      return
    }
    const users = readUsers()
    if (users[phone]?.verified) throw new Error('An account with this mobile number already exists.')
    users[phone] = { id: crypto.randomUUID(), phone, hash: await sha256(password), verified: false }
    writeUsers(users)
    localStorage.setItem(SESSION_KEY, phone)
    emit(toAccount(users[phone]))
  },

  async verifyOtp(phone: string, code: string): Promise<void> {
    if (supabase) {
      const { error } = await supabase.auth.verifyOtp({ phone, token: code, type: 'sms' })
      if (error) throw new Error('That code is incorrect or has expired.')
      return
    }
    if (code !== MOCK_OTP) throw new Error('That code is incorrect or has expired.')
    const users = readUsers()
    if (!users[phone]) throw new Error('Account not found.')
    users[phone].verified = true
    writeUsers(users)
    emit(toAccount(users[phone]))
  },

  async resendOtp(phone: string): Promise<void> {
    if (supabase) {
      const { error } = await supabase.auth.resend({ type: 'sms', phone })
      if (error) throw new Error(error.message)
    }
  },

  /** identifier is an email or an E.164 mobile number. */
  async signIn(identifier: string, password: string): Promise<void> {
    if (supabase) {
      const creds = identifier.includes('@') ? { email: identifier, password } : { phone: identifier, password }
      const { error } = await supabase.auth.signInWithPassword(creds)
      if (error) throw new Error('Incorrect login details. Please check and try again.')
      return
    }
    const hash = await sha256(password)
    const user = Object.values(readUsers()).find((u) => (u.phone === identifier || u.email === identifier) && u.verified)
    if (!user || user.hash !== hash) throw new Error('Incorrect login details. Please check and try again.')
    localStorage.setItem(SESSION_KEY, user.phone)
    emit(toAccount(user))
  },

  async signInWithGoogle(): Promise<void> {
    if (!supabase) throw new Error('Google sign-in needs Supabase to be configured.')
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/login` },
    })
    if (error) throw new Error(error.message)
  },

  async signOut(): Promise<void> {
    if (supabase) await supabase.auth.signOut()
    else localStorage.removeItem(SESSION_KEY)
    emit(null)
  },
}

function fromSupabase(u: { id: string; phone?: string; email?: string; phone_confirmed_at?: string | null; email_confirmed_at?: string | null; app_metadata?: { provider?: string } }): Account {
  const viaGoogle = u.app_metadata?.provider === 'google'
  return {
    id: u.id,
    phone: u.phone ? `+${u.phone.replace(/^\+/, '')}` : undefined,
    email: u.email || undefined,
    // Google users have no phone yet; the PRD flow still routes them through mobile verification.
    phoneVerified: Boolean(u.phone_confirmed_at) && !viaGoogle,
  }
}
