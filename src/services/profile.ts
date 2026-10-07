import { PHOTO_BUCKET, isSupabaseConfigured, supabase } from '../lib/supabase'
import type { ProfileRecord } from '../types'

const empty = (): ProfileRecord => ({ data: {}, step: 0, photos: [], submitted: false })
const localKey = (userId: string) => `bmm.mock.profile.${userId}`

/**
 * Profile persistence. Supabase `profiles` table when configured, localStorage mock otherwise.
 * Photos are stored as storage paths (Supabase) or small data URLs (mock) and resolved with
 * `photoUrl`, which uses short-lived signed URLs so photos are never publicly addressable.
 */
export const profileService = {
  async load(userId: string): Promise<ProfileRecord> {
    if (supabase) {
      const { data } = await supabase.from('profiles').select('data, step, photos, submitted').eq('user_id', userId).maybeSingle()
      return data ? { data: data.data ?? {}, step: data.step ?? 0, photos: data.photos ?? [], submitted: !!data.submitted } : empty()
    }
    try {
      return { ...empty(), ...JSON.parse(localStorage.getItem(localKey(userId)) ?? '{}') }
    } catch {
      return empty()
    }
  },

  async save(userId: string, record: ProfileRecord): Promise<void> {
    if (supabase) {
      const { error } = await supabase.from('profiles').upsert({
        user_id: userId,
        data: record.data,
        step: record.step,
        photos: record.photos,
        submitted: record.submitted,
        updated_at: new Date().toISOString(),
      })
      if (error) throw new Error('We could not save your progress. Please try again.')
      return
    }
    localStorage.setItem(localKey(userId), JSON.stringify(record))
  },

  async uploadPhoto(userId: string, file: File): Promise<string> {
    if (supabase) {
      const path = `${userId}/${crypto.randomUUID()}.jpg`
      const blob = await resizeImage(file, 1200, 'blob')
      const { error } = await supabase.storage.from(PHOTO_BUCKET).upload(path, blob, { contentType: 'image/jpeg' })
      if (error) throw new Error('Photo upload failed. Please try again.')
      return path
    }
    return resizeImage(file, 480, 'dataUrl')
  },

  async removePhoto(path: string): Promise<void> {
    if (supabase) await supabase.storage.from(PHOTO_BUCKET).remove([path])
  },

  /** Resolve a stored photo reference to a displayable URL. */
  async photoUrl(ref: string): Promise<string> {
    if (!supabase || ref.startsWith('data:')) return ref
    const { data } = await supabase.storage.from(PHOTO_BUCKET).createSignedUrl(ref, 3600)
    return data?.signedUrl ?? ''
  },
}

// Photo rules are not specified in the PRD (10.2); these are provisional defaults.
export const PHOTO_RULES = { types: ['image/jpeg', 'image/png', 'image/webp'], maxMb: 8 }

export function validatePhoto(file: File): string | null {
  if (!PHOTO_RULES.types.includes(file.type)) return 'Please choose a JPG, PNG or WebP image.'
  if (file.size > PHOTO_RULES.maxMb * 1024 * 1024) return `Photos must be under ${PHOTO_RULES.maxMb} MB.`
  return null
}

function resizeImage(file: File, maxSide: number, as: 'blob'): Promise<Blob>
function resizeImage(file: File, maxSide: number, as: 'dataUrl'): Promise<string>
function resizeImage(file: File, maxSide: number, as: 'blob' | 'dataUrl'): Promise<Blob | string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const objectUrl = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(objectUrl)
      const scale = Math.min(1, maxSide / Math.max(img.width, img.height))
      const canvas = document.createElement('canvas')
      canvas.width = Math.round(img.width * scale)
      canvas.height = Math.round(img.height * scale)
      canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height)
      if (as === 'dataUrl') return resolve(canvas.toDataURL('image/jpeg', 0.8))
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Could not process image.'))), 'image/jpeg', 0.85)
    }
    img.onerror = () => reject(new Error('Could not read that image.'))
    img.src = objectUrl
  })
}

export { isSupabaseConfigured }
