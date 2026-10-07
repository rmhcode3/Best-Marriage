import { useState } from 'react'
import { Icon } from '../../components/ui/Icon'
import { PageHero } from '../../components/ui/PageHero'
import { SAMPLE_STORIES } from '../../data/sample'

const TABS = ['All Stories', 'Arranged Marriage', 'Love Marriage', 'Same Community', 'Different Community', 'International', 'Recent']

export default function SuccessStories() {
  const [tab, setTab] = useState(TABS[0])
  const stories = tab === TABS[0] ? SAMPLE_STORIES : SAMPLE_STORIES.filter((s) => s.tags.includes(tab))

  return (
    <>
      <PageHero eyebrow="Success stories" title="More Than Matches, Meaningful Connections" text="Real stories of love, trust and new beginnings created on BMM." />
      <section className="container-page py-10 lg:py-14">
        <div role="tablist" aria-label="Story categories" className="no-scrollbar -mx-[18px] mb-8 flex gap-2 overflow-x-auto px-[18px] pb-2 lg:mx-0 lg:justify-center lg:px-0">
          {TABS.map((t) => (
            <button key={t} role="tab" aria-selected={tab === t} onClick={() => setTab(t)} className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${tab === t ? 'border-primary bg-primary text-white' : 'border-border bg-white text-text hover:bg-tint-2'}`}>
              {t}
            </button>
          ))}
        </div>
        {stories.length ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {stories.map((s) => (
              <article key={s.id} className="overflow-hidden rounded-md border border-border-light bg-white shadow-sm">
                <div className="grid aspect-[16/10] place-items-center bg-gradient-to-br from-tint-1 to-tint-3 text-primary/50" aria-hidden="true">
                  <Icon name="rings" size={64} />
                </div>
                <div className="p-5">
                  <h2 className="font-sans text-lg font-semibold">{s.title}</h2>
                  <p className="mt-2 text-text-muted">“{s.quote}”</p>
                  <p className="mt-4 font-semibold text-text-strong">{s.couple}</p>
                  <p className="text-sm text-text-subtle">{s.place}</p>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="py-12 text-center text-text-muted">No stories in this category yet.</p>
        )}
      </section>
    </>
  )
}
