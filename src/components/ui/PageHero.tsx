import type { ReactNode } from 'react'

/** Soft maroon-tinted hero used by About, Search, Success Stories, Membership and Help. */
export function PageHero({ eyebrow, title, text, children }: { eyebrow?: string; title: string; text?: string; children?: ReactNode }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-tint-3 via-tint-2 to-tint-1">
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" aria-hidden="true" />
      <div className="container-page relative py-12 text-center md:py-20">
        {eyebrow && <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">{eyebrow}</p>}
        <h1 className="mx-auto max-w-3xl text-3xl leading-tight md:text-5xl">{title}</h1>
        {text && <p className="mx-auto mt-4 max-w-2xl text-base text-text-muted md:text-lg">{text}</p>}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  )
}
