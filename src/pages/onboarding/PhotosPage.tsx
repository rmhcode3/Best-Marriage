import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Icon } from '../../components/ui/Icon'
import { useApp } from '../../context/AppContext'
import { MAX_PHOTOS, PHOTOS_INDEX, REVIEW_INDEX, STEPS } from '../../data/onboarding'
import { PHOTO_RULES, profileService, validatePhoto } from '../../services/profile'
import { StepFrame } from './StepPage'

const GUIDELINES = ['Use a clear, recent photo', 'Your face should be clearly visible', 'Avoid group photos', 'Avoid heavily edited or inappropriate photos']

function usePhotoUrl(ref?: string) {
  const [resolved, setResolved] = useState<{ ref: string; url: string }>()
  useEffect(() => {
    let cancelled = false
    if (ref) profileService.photoUrl(ref).then((url) => !cancelled && setResolved({ ref, url }))
    return () => {
      cancelled = true
    }
  }, [ref])
  return resolved && resolved.ref === ref ? resolved.url : ''
}

function Slot({ index, photo, onAdd, onRemove, busy }: { index: number; photo?: string; onAdd: () => void; onRemove: () => void; busy: boolean }) {
  const url = usePhotoUrl(photo)
  const base = 'relative grid aspect-square place-items-center overflow-hidden rounded-md border-2 border-dashed'
  if (photo) {
    return (
      <div className={`${base} border-transparent bg-tint-2`}>
        {url && <img src={url} alt={`Photo ${index + 1}`} className="h-full w-full object-cover" />}
        {index === 0 && <span className="absolute bottom-2 left-2 rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-white">Profile photo</span>}
        <button type="button" onClick={onRemove} aria-label={`Remove photo ${index + 1}`} className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-danger shadow hover:bg-white">
          <Icon name="trash" size={16} />
        </button>
      </div>
    )
  }
  return (
    <button type="button" onClick={onAdd} disabled={busy} className={`${base} border-tint-1 bg-tint-4 text-primary transition-colors hover:border-primary hover:bg-tint-3 disabled:opacity-60`} aria-label={`Add photo ${index + 1}`}>
      <span className="flex flex-col items-center gap-1.5 text-sm font-medium">
        <Icon name={index === 0 ? 'upload' : 'user'} size={index === 0 ? 28 : 30} className={index === 0 ? '' : 'text-primary/40'} />
        {index === 0 ? 'Add Photo' : index + 1}
      </span>
    </button>
  )
}

export default function PhotosPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { account, profile, setPhotos, saveStep } = useApp()
  const fromReview = params.get('from') === 'review'
  const input = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function onFiles(files: FileList | null) {
    if (!files || !account) return
    setError('')
    setBusy(true)
    try {
      const added: string[] = []
      for (const file of Array.from(files).slice(0, MAX_PHOTOS - profile.photos.length)) {
        const problem = validatePhoto(file)
        if (problem) {
          setError(problem)
          continue
        }
        added.push(await profileService.uploadPhoto(account.id, file))
      }
      if (added.length) await setPhotos([...profile.photos, ...added])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed.')
    } finally {
      setBusy(false)
      if (input.current) input.current.value = ''
    }
  }

  async function onRemove(i: number) {
    const ref = profile.photos[i]
    await profileService.removePhoto(ref)
    await setPhotos(profile.photos.filter((_, idx) => idx !== i))
  }

  async function onContinue() {
    // Photos are saved as they are added; this marks the step as reached. Whether a photo is
    // mandatory is still open (PRD 10.2), so continuing without one is allowed.
    setBusy(true)
    try {
      await saveStep(PHOTOS_INDEX, {})
      navigate(fromReview ? STEPS[REVIEW_INDEX].path : STEPS[PHOTOS_INDEX + 1].path)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <StepFrame index={PHOTOS_INDEX} onSubmit={onContinue} busy={busy} error={error}>
      <div className="mb-6 flex gap-3 rounded-md bg-tint-3 p-4 text-sm text-text-muted">
        <Icon name="info" size={20} className="mt-0.5 shrink-0 text-primary" />
        Upload clear, recent photos to improve your chances of finding the right match. Your photos are secure and visible only to trusted members.
      </div>
      <input ref={input} type="file" accept={PHOTO_RULES.types.join(',')} multiple hidden onChange={(e) => onFiles(e.target.files)} />
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {Array.from({ length: MAX_PHOTOS }, (_, i) => (
          <Slot key={i} index={i} photo={profile.photos[i]} busy={busy} onAdd={() => input.current?.click()} onRemove={() => onRemove(i)} />
        ))}
      </div>
      <p className="mt-3 text-xs text-text-subtle">
        Up to {MAX_PHOTOS} photos · JPG, PNG or WebP · max {PHOTO_RULES.maxMb} MB each. The first photo is your profile photo.
      </p>
      <section className="mt-6 rounded-md border border-border-light p-4">
        <h3 className="mb-3 font-sans text-base font-semibold">Photo Guidelines</h3>
        <ul className="grid gap-2 text-sm text-text-muted sm:grid-cols-2">
          {GUIDELINES.map((g) => (
            <li key={g} className="flex items-center gap-2">
              <Icon name="check" size={16} className="text-success" />
              {g}
            </li>
          ))}
        </ul>
      </section>
    </StepFrame>
  )
}
