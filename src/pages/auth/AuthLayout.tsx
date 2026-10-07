import type { ReactNode } from 'react'
import { WhyJoin } from '../../components/ui/Misc'

/** Card on the left, "Why Join BMM?" on the right at desktop (PRD A1–A3). */
export function AuthLayout({ children, hero = false }: { children: ReactNode; hero?: boolean }) {
  return (
    <div className="bg-gradient-to-b from-tint-3 to-white">
      {hero && (
        <div className="h-[230px] overflow-hidden md:hidden">
          <img src="/images/hero.png" alt="" className="h-[290px] w-full object-cover object-[50%_0%]" />
        </div>
      )}
      <div className="container-page grid grid-cols-[minmax(0,1fr)] items-start gap-8 pb-16 lg:grid-cols-[minmax(0,560px)_minmax(0,1fr)] lg:justify-center lg:gap-14 lg:py-14">
        <div className={`rounded-xl border border-border-light bg-white p-6 shadow-[0_8px_30px_rgba(155,18,56,0.08)] sm:p-9 ${hero ? "-mt-8 md:mt-0" : "mt-8 lg:mt-0"}`}>{children}</div>
        <div className="hidden max-w-lg lg:block">
          <WhyJoin />
        </div>
      </div>
    </div>
  )
}

export function FormError({ children }: { children?: string }) {
  if (!children) return null
  return (
    <p role="alert" className="mb-4 rounded-sm border border-danger/30 bg-danger/5 px-3 py-2 text-sm text-danger">
      {children}
    </p>
  )
}
