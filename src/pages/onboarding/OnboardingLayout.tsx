import { useEffect, type ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { Icon } from '../../components/ui/Icon'
import { Logo } from '../../components/ui/Logo'
import { CompletionRing, WhyJoin } from '../../components/ui/Misc'
import { useApp } from '../../context/AppContext'
import { STEPS } from '../../data/onboarding'

const STEP_ICONS = ['user', 'pin', 'cap', 'home', 'spark', 'rings', 'heart', 'camera', 'pencil', 'check'] as const

function Sidebar({ current }: { current: number }) {
  const { profile } = useApp()
  const furthest = Math.min(profile.step, STEPS.length - 1)
  return (
    <aside className="rounded-xl border border-border-light bg-white p-5 shadow-sm">
      <p className="mb-4 font-heading text-lg font-semibold text-primary">Same Culture Stronger Together</p>
      <ol className="space-y-1">
        {STEPS.map((s, i) => {
          const active = i === current
          const reachable = i <= furthest
          const cls = `flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm font-medium ${active ? 'bg-primary text-white' : reachable ? 'text-text hover:bg-tint-2' : 'cursor-not-allowed text-text-faint'}`
          const inner = (
            <>
              <Icon name={STEP_ICONS[i]} size={18} />
              {s.stepLabel}
            </>
          )
          return (
            <li key={s.id}>
              {reachable ? (
                <Link to={s.path} className={cls} aria-current={active ? 'step' : undefined}>
                  {inner}
                </Link>
              ) : (
                <span className={cls} aria-disabled="true">
                  {inner}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </aside>
  )
}

function CompletionCard() {
  const { completion, profile } = useApp()
  const items = [
    { label: 'Personal Information', done: profile.step >= 1 },
    { label: 'Additional Details', done: profile.step >= 7 },
    { label: 'Preferences', done: profile.step >= 7 },
    { label: 'Photos', done: profile.photos.length > 0 },
    // Identity verification is not designed (PRD 10.2), so this stays pending for now.
    { label: 'Verification', done: false },
  ]
  return (
    <section className="rounded-xl border border-border-light bg-white p-5 shadow-sm">
      <h2 className="mb-4 font-sans text-base font-semibold">Profile Completion</h2>
      <div className="flex items-center gap-5">
        <CompletionRing value={completion} size={92} />
        <ul className="space-y-2 text-sm">
          {items.map((it) => (
            <li key={it.label} className={`flex items-center gap-2 ${it.done ? 'text-text-strong' : 'text-text-faint'}`}>
              <span className={`grid h-4 w-4 place-items-center rounded-full ${it.done ? 'bg-success text-white' : 'border border-border'}`}>{it.done && <Icon name="check" size={11} strokeWidth={3} />}</span>
              {it.label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/** Shell for O1–O10: step list (left), content (centre), completion + Why Join (right). */
export function OnboardingLayout({ stepIndex, children }: { stepIndex: number; children: ReactNode }) {
  const { signOut } = useApp()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="min-h-screen bg-surface-alt">
      {/* PRD 10.1 #11: header for the Registering state is undecided — logo + log out is a neutral choice. */}
      <header className="border-b border-border-light bg-white">
        <div className="container-page flex h-[72px] items-center justify-between lg:h-20">
          <Logo />
          <Button
            size="sm"
            variant="secondary"
            onClick={async () => {
              await signOut()
              navigate('/login')
            }}
          >
            <Icon name="logout" size={16} /> Log out
          </Button>
        </div>
      </header>
      <div className="container-page grid gap-6 py-6 lg:grid-cols-[250px_minmax(0,1fr)] lg:py-10 xl:grid-cols-[260px_minmax(0,1fr)_320px]">
        <div className="hidden lg:block">
          <div className="sticky top-6">
            <Sidebar current={stepIndex} />
          </div>
        </div>
        <main className="min-w-0">
          {children}
        </main>
        <div className="hidden space-y-6 xl:block">
          <CompletionCard />
          <WhyJoin footer={false} />
        </div>
      </div>
    </div>
  )
}
