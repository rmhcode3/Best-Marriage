import { Link } from 'react-router-dom'
import type { SampleProfile } from '../../data/sample'
import { Button } from '../ui/Button'
import { HeartFilled, Icon } from '../ui/Icon'

/** PRD section 8: guest teaser, dashboard, result, shortlist, public search. */
export type ProfileCardVariant = 'guest' | 'dashboard' | 'result' | 'shortlist' | 'public'

type Props = {
  profile: SampleProfile
  variant: ProfileCardVariant
  shortlisted?: boolean
  onToggleShortlist?: (id: string) => void
  onSendInterest?: (id: string) => void
  onView?: (id: string) => void
  /** where tapping the card goes (guests are sent to login) */
  to?: string
  /** photo URL; when absent a neutral placeholder is shown */
  photoUrl?: string
}

const TINTS = ['from-tint-1 to-tint-3', 'from-tint-2 to-tint-1', 'from-tint-3 to-tint-1']

export function ProfileCard({ profile, variant, shortlisted, onToggleShortlist, onSendInterest, onView, to = '/login', photoUrl }: Props) {
  const tint = TINTS[profile.name.length % TINTS.length]
  const locked = variant === 'guest'
  const showOnline = (variant === 'result' || variant === 'shortlist' || variant === 'public') && profile.online
  const showVerified = variant === 'guest' || variant === 'dashboard'

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-md border border-border-light bg-white shadow-[0_2px_10px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-md">
      <div className="relative">
      <Link to={to} className="relative block aspect-[4/5] overflow-hidden" aria-label={`View ${profile.name}'s profile`}>
        {locked ? (
          // Photos are for logged-in members only: guests get a blurred teaser with a lock.
          <>
            <img src="/images/profile-teaser.png" alt="" className="h-full w-full scale-105 object-cover blur-[4px]" loading="lazy" />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-primary">
              <Icon name="lock" size={26} />
            </span>
          </>
        ) : photoUrl ? (
          <img src={photoUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className={`grid h-full w-full place-items-center bg-gradient-to-br ${tint}`}>
            <Icon name="user" size={64} className="text-primary/30" />
          </div>
        )}
        {showOnline && (
          <span className="absolute left-2.5 top-2.5 inline-flex items-center gap-1 rounded-full bg-success px-2 py-0.5 text-xs font-medium text-white">
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
            Online
          </span>
        )}
        {showVerified && (
          <span className="absolute bottom-2.5 left-2.5 inline-flex items-center gap-1 rounded-full bg-success px-2 py-0.5 text-xs font-medium text-white">
            <Icon name="check" size={12} />
            Verified
          </span>
        )}
        {profile.matchPercent && (
          <span className="absolute right-2.5 top-2.5 rounded-full bg-primary px-2 py-0.5 text-xs font-medium text-white">{profile.matchPercent}% Match</span>
        )}
      </Link>
      {(variant === 'guest' || variant === 'dashboard') && (
        <button
          type="button"
          onClick={() => onToggleShortlist?.(profile.id)}
          aria-pressed={!!shortlisted}
          aria-label={shortlisted ? 'Remove from shortlist' : locked ? 'Log in to shortlist' : 'Add to shortlist'}
          className="absolute right-2.5 top-2.5 grid h-8 w-8 place-items-center rounded-full text-white drop-shadow hover:scale-110"
        >
          {shortlisted ? <HeartFilled size={22} /> : <Icon name="heart" size={22} />}
        </button>
      )}
      </div>

      <div className="flex flex-1 flex-col p-3.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-sans text-base font-bold text-text-strong">
            {profile.name}, {profile.age}
          </h3>
        </div>
        <p className="mt-0.5 text-sm text-text-muted">{profile.profession}</p>
        <p className="text-sm text-text-subtle">{profile.location}</p>
        <p className="mt-1 text-xs text-text-faint">
          {profile.religion} • {profile.tongue}
        </p>

        {variant === 'result' && (
          <div className="mt-3 flex gap-2">
            <Button size="sm" full onClick={() => onSendInterest?.(profile.id)}>
              <Icon name="send" size={15} /> Send Interest
            </Button>
            <HeartButton square active={shortlisted} onClick={() => onToggleShortlist?.(profile.id)} />
          </div>
        )}
        {variant === 'shortlist' && (
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Button size="sm" full onClick={() => undefined}>
              View Profile
            </Button>
            <Button size="sm" variant="secondary" full onClick={() => onToggleShortlist?.(profile.id)}>
              <Icon name="heart" size={15} /> Remove
            </Button>
          </div>
        )}
        {variant === 'public' && (
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Button size="sm" variant="secondary" full onClick={() => onView?.(profile.id)}>
              view profile
            </Button>
            <Button size="sm" variant="secondary" full onClick={() => onToggleShortlist?.(profile.id)}>
              <Icon name="heart" size={15} /> Shortlist
            </Button>
          </div>
        )}
      </div>
    </article>
  )
}

function HeartButton({ active, onClick, square, locked }: { active?: boolean; onClick: () => void; square?: boolean; locked?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={!!active}
      aria-label={active ? 'Remove from shortlist' : locked ? 'Log in to shortlist' : 'Add to shortlist'}
      className={`grid shrink-0 place-items-center text-primary ${square ? 'h-10 w-10 rounded-sm border border-border hover:bg-tint-2' : 'h-7 w-7 hover:text-primary-dark'}`}
    >
      {active ? <HeartFilled size={square ? 20 : 22} /> : <Icon name="heart" size={square ? 20 : 22} />}
    </button>
  )
}
