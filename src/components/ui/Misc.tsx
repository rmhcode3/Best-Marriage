import type { ReactNode } from 'react'
import { Icon, type IconName } from './Icon'

/** 3-step indicator used on A2, A3 and O1: create account → verify number → complete profile. */
export function StepIndicator({ active }: { active: 1 | 2 | 3 }) {
  const labels = ['Create Account', 'Verify Number', 'Complete Profile']
  return (
    <ol className="mx-auto mb-7 flex max-w-xs items-start justify-between" aria-label="Sign-up progress">
      {labels.map((label, i) => {
        const n = i + 1
        const current = n === active
        return (
          <li key={label} className="relative flex flex-1 flex-col items-center gap-1.5" aria-current={current ? 'step' : undefined}>
            {i > 0 && <span className={`absolute right-1/2 top-[18px] h-0.5 w-full ${n <= active ? 'bg-primary' : 'bg-border-light'}`} aria-hidden="true" />}
            <span
              className={`relative z-10 grid h-9 w-9 place-items-center rounded-full text-sm font-semibold ${
                current ? 'bg-primary text-white' : 'border border-border bg-white text-text-faint'
              }`}
            >
              {n}
            </span>
            <span className="sr-only">{label}</span>
          </li>
        )
      })}
    </ol>
  )
}

/** Percentage ring shared by onboarding, dashboard and My Profile. */
export function CompletionRing({ value, size = 96, label = true }: { value: number; size?: number; label?: boolean }) {
  const stroke = size / 9
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }} role="img" aria-label={`${value}% complete`}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-tint-1)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--color-success)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - value / 100)}
          style={{ transition: 'stroke-dashoffset .4s' }}
        />
      </svg>
      <div className="absolute text-center leading-tight">
        <div className="text-lg font-semibold text-text-strong">{value}%</div>
        {label && <div className="text-[11px] text-text-subtle">Complete</div>}
      </div>
    </div>
  )
}

const WHY: { icon: IconName; title: string; text: string }[] = [
  { icon: 'shieldCheck', title: 'Verified Profiles', text: 'Authentic and genuine profiles' },
  { icon: 'lock', title: 'Safe & Secure', text: 'Your privacy is our priority' },
  { icon: 'users', title: 'Meaningful Connections', text: 'Connect with compatible matches' },
  { icon: 'heart', title: 'Tamil Community Focused', text: 'Built for the Tamil community' },
]

/** "Why Join BMM?" panel (A1–A3, O1–O10 desktop). */
export function WhyJoin({ footer = true }: { footer?: boolean }) {
  return (
    <aside className="rounded-xl bg-tint-3 p-6">
      <h2 className="mb-5 text-2xl">Why Join BMM?</h2>
      <ul className="space-y-4">
        {WHY.map((w) => (
          <li key={w.title} className="flex items-center gap-3">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white text-primary shadow-sm">
              <Icon name={w.icon} />
            </span>
            <span>
              <span className="block font-semibold text-text-strong">{w.title}</span>
              <span className="text-sm text-text-muted">{w.text}</span>
            </span>
          </li>
        ))}
      </ul>
      {footer && (
        <div className="mt-6 border-t border-tint-1 pt-5">
          <p className="font-heading text-lg font-semibold text-primary">Be a part of a trustworthy community</p>
          <p className="mt-1 text-sm text-text-muted">Join thousands of Tamil families who trust BMM</p>
        </div>
      )}
    </aside>
  )
}

export function Chip({ children, onRemove, selected, onClick }: { children: ReactNode; onRemove?: () => void; selected?: boolean; onClick?: () => void }) {
  const style = selected ? 'border-primary bg-primary text-white' : 'border-tint-1 bg-tint-2 text-primary'
  const content = (
    <>
      {selected && <Icon name="check" size={14} />}
      {children}
      {onRemove && <Icon name="close" size={14} />}
    </>
  )
  const common = `inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium ${style}`
  if (onRemove || onClick) {
    return (
      <button type="button" onClick={onRemove ?? onClick} className={common} aria-label={onRemove ? `Remove ${String(children)}` : undefined} aria-pressed={onClick ? !!selected : undefined}>
        {content}
      </button>
    )
  }
  return <span className={common}>{content}</span>
}

export function SectionHeading({ eyebrow, title, text, center = true, accent = false, upper = false }: { eyebrow?: string; title: string; text?: string; center?: boolean; accent?: boolean; upper?: boolean }) {
  return (
    <div className={center ? 'mx-auto max-w-2xl text-center' : ''}>
      {eyebrow && <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">{eyebrow}</p>}
      <h2 className={`text-2xl md:text-3xl ${upper ? "uppercase lg:normal-case" : ""}`}>{title}</h2>
      {accent && <span className="mx-auto mt-3 block h-0.5 w-12 bg-primary" aria-hidden="true" />}
      {text && <p className="mt-3 text-text-muted">{text}</p>}
    </div>
  )
}

export function Divider({ children = 'OR' }: { children?: ReactNode }) {
  return (
    <div className="my-5 flex items-center gap-3 text-xs text-text-faint" role="separator">
      <span className="h-px flex-1 bg-border-light" />
      {children}
      <span className="h-px flex-1 bg-border-light" />
    </div>
  )
}
