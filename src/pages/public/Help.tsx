import { useState } from 'react'
import { Button } from '../../components/ui/Button'
import { Icon, type IconName } from '../../components/ui/Icon'
import { PageHero } from '../../components/ui/PageHero'
import { SectionHeading } from '../../components/ui/Misc'

const TOPICS: { icon: IconName; title: string; text: string }[] = [
  { icon: 'user', title: 'Account & Profile', text: 'Learn how to create and manage your profile.' },
  { icon: 'crown', title: 'Membership & Plans', text: 'Know about our plans and features.' },
  { icon: 'shieldCheck', title: 'Safety & Privacy', text: 'Your safety is our priority.' },
  { icon: 'help', title: 'General Help', text: 'Get answers to common questions.' },
]

const ARTICLES = ['How do I create an account?', 'How do I upgrade my membership plan?', 'Is my personal information safe?', 'How do I search for matches?', 'Can I get a refund if I am not satisfied?']

export default function Help() {
  const [q, setQ] = useState('')
  const [applied, setApplied] = useState('')
  const list = ARTICLES.filter((a) => a.toLowerCase().includes(applied.trim().toLowerCase()))

  return (
    <>
      <PageHero title="How Can We Help You?" text="Find quick answers to common questions or get in touch with our support team.">
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault()
            setApplied(q)
          }}
          className="mx-auto flex max-w-xl gap-2"
        >
          <div className="relative flex-1">
            <Icon name="search" size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-faint" />
            <input aria-label="Search help articles" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search help articles..." className="h-12 w-full rounded-sm border border-border bg-white pl-11 pr-3 text-base focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>
          <Button type="submit">Search</Button>
        </form>
      </PageHero>

      <section className="container-page py-12 lg:py-16">
        <SectionHeading title="Browse Help Topics" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TOPICS.map((t) => (
            <div key={t.title} className="rounded-md border border-border-light bg-white p-6 text-center shadow-sm">
              <span className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-tint-2 text-primary">
                <Icon name={t.icon} size={26} />
              </span>
              <h3 className="font-sans text-base font-semibold">{t.title}</h3>
              <p className="mt-1.5 text-sm text-text-muted">{t.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page pb-16 lg:pb-24">
        <div className="mx-auto max-w-3xl">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl">Popular Articles</h2>
          </div>
          <ul className="divide-y divide-border-light rounded-md border border-border-light bg-white">
            {list.map((a) => (
              <li key={a} className="flex items-center justify-between gap-3 p-4 text-text-strong">
                {a}
                <Icon name="chevronRight" size={18} className="shrink-0 text-text-faint" />
              </li>
            ))}
            {!list.length && <li className="p-6 text-center text-text-muted">No articles found for “{applied}”.</li>}
          </ul>
          {/* Article pages are not designed yet (PRD 10.2), so articles and "View All Articles" are not linked. */}
        </div>
      </section>
    </>
  )
}
