import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { currentYear } from '../../lib/format'
import { ButtonLink } from '../ui/Button'
import { BrandIcon, Icon } from '../ui/Icon'
import { Logo } from '../ui/Logo'

const NAV = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About' },
  { to: '/search', label: 'Search' },
  { to: '/success-stories', label: 'Success Stories' },
  { to: '/membership', label: 'Membership' },
  { to: '/help', label: 'Help' },
]

const navClass = ({ isActive }: { isActive: boolean }) =>
  `border-b-2 py-1 text-[15px] font-medium transition-colors ${isActive ? 'border-primary text-primary' : 'border-transparent text-text hover:text-primary'}`

function RegionSelector() {
  // Region options are an open point (PRD 10.1 #9); shown as the designed static label for now.
  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-text-muted" title="Region">
      <Icon name="globe" size={18} />
      UK
      <Icon name="chevronDown" size={14} />
    </span>
  )
}

function AuthActions({ stacked = false }: { stacked?: boolean }) {
  const { state } = useApp()
  const wrap = stacked ? 'flex w-full flex-col gap-3' : 'flex items-center gap-3'
  if (state === 'member') {
    return (
      <div className={wrap}>
        <ButtonLink to="/app/dashboard" size="sm" full={stacked}>
          Dashboard
        </ButtonLink>
      </div>
    )
  }
  return (
    <div className={wrap}>
      <ButtonLink to="/login" size="sm" variant="secondary" full={stacked}>
        Login
      </ButtonLink>
      <ButtonLink to="/register" size="sm" full={stacked}>
        Register
      </ButtonLink>
    </div>
  )
}

function Header() {
  // The drawer is open only for the path it was opened on, so navigating closes it.
  const { pathname } = useLocation()
  const [openAt, setOpenAt] = useState<string | null>(null)
  const open = openAt === pathname
  const setOpen = (v: boolean) => setOpenAt(v ? pathname : null)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <header className="sticky top-0 z-40 border-b border-border-light bg-white">
      <div className="container-page flex h-[72px] items-center justify-between lg:h-20">
        <Logo />
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Main">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end} className={navClass}>
              {n.label}
            </NavLink>
          ))}
        </nav>
        <div className="hidden items-center gap-5 lg:flex">
          <RegionSelector />
          <AuthActions />
        </div>
        <button type="button" className="grid h-11 w-11 place-items-center rounded-sm text-text-strong hover:bg-tint-2 lg:hidden" onClick={() => setOpen(true)} aria-label="Open menu" aria-expanded={open}>
          <Icon name="menu" size={26} />
        </button>
      </div>

      {/* P7 — mobile drawer, slides in from the right over a dimmed page */}
      <div className={`fixed inset-0 z-50 lg:hidden ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open}>
        <div className={`absolute inset-0 bg-black/50 transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`} onClick={() => setOpen(false)} />
        <aside
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className={`absolute right-0 top-0 flex h-full w-[82%] max-w-sm flex-col items-center overflow-y-auto bg-white px-6 pb-8 pt-5 shadow-xl transition-transform ${open ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <button type="button" className="mb-2 ml-auto grid h-10 w-10 place-items-center rounded-sm hover:bg-tint-2" onClick={() => setOpen(false)} aria-label="Close menu" tabIndex={open ? 0 : -1}>
            <Icon name="close" size={24} />
          </button>
          <Logo />
          <nav className="mt-8 flex w-full flex-col items-center gap-5" aria-label="Mobile">
            {NAV.map((n) => (
              <NavLink key={n.to} to={n.to} end={n.end} className={navClass} tabIndex={open ? 0 : -1}>
                {n.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-6">
            <RegionSelector />
          </div>
          <div className="mt-6 w-full">
            <AuthActions stacked />
          </div>
        </aside>
      </div>
    </header>
  )
}

function Footer() {
  // Privacy, Terms and Contact pages are not designed (PRD 10.2), so they are not linked yet.
  const pending = ['Privacy', 'Terms']
  return (
    <footer className="bg-primary-dark text-white">
      <div className="container-page grid grid-cols-2 items-center gap-x-4 gap-y-6 py-10 md:flex md:justify-between">
        <Logo light />
        <ul className="order-last col-span-2 flex flex-wrap items-center justify-between gap-x-5 gap-y-2 text-sm font-medium text-white/90 md:order-none md:justify-center md:gap-x-7">
          <li>
            <Link to="/about" className="hover:text-white">About</Link>
          </li>
          {pending.map((p) => (
            <li key={p} className="cursor-default">{p}</li>
          ))}
          <li>
            <Link to="/help" className="hover:text-white">Help</Link>
          </li>
          <li className="cursor-default">Contact</li>
        </ul>
        <div className="flex items-center justify-end gap-3">
          {(['facebook', 'instagram', 'youtube', 'linkedin'] as const).map((s) => (
            <span key={s} className="grid h-8 w-8 place-items-center text-white" title={s}>
              <BrandIcon name={s} />
            </span>
          ))}
        </div>
      </div>
      <p className="border-t border-white/15 py-4 text-center text-xs text-white/70">© {currentYear} BMM. All rights reserved.</p>
    </footer>
  )
}

export function PublicLayout() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
