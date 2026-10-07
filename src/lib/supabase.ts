import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

/** True when Supabase env vars are present. Otherwise services fall back to a local, dev-only mock. */
export const isSupabaseConfigured = Boolean(url && anonKey)

export const supabase = isSupabaseConfigured ? createClient(url!, anonKey!) : null

export const PHOTO_BUCKET = 'profile-photos'
