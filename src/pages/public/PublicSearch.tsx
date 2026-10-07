import { useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ProfileCard } from '../../components/profile/ProfileCard'
import { Button } from '../../components/ui/Button'
import { SelectInput } from '../../components/ui/Form'
import { Icon } from '../../components/ui/Icon'
import { PageHero } from '../../components/ui/PageHero'
import { OPTIONS } from '../../data/options'
import { SAMPLE_PROFILES, sampleGender } from '../../data/sample'

const PAGE_SIZE = 5

type Filters = { lookingFor: string; age: string; religion: string; community: string; city: string; education: string; profession: string; marital: string; income: string }

const initial = (p: URLSearchParams): Filters => ({
  lookingFor: p.get('lookingFor') ?? 'Bride',
  age: p.get('age') ?? '22 - 25',
  religion: p.get('religion') ?? 'Hindu',
  community: p.get('community') ?? 'Any',
  city: 'Any City',
  education: 'Any',
  profession: 'Any',
  marital: 'Never Married',
  income: 'Any',
})

export default function PublicSearch() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [form, setForm] = useState<Filters>(() => initial(params))
  const [applied, setApplied] = useState<Filters>(form)
  const [sort, setSort] = useState('Newest First')
  const [page, setPage] = useState(1)
  const set = (k: keyof Filters) => (e: React.ChangeEvent<HTMLSelectElement>) => setForm((f) => ({ ...f, [k]: e.target.value }))

  // Guests browse a teaser list. Real results come from the profile API; until then this filters demo data only.
  const results = useMemo(() => {
    let list = SAMPLE_PROFILES.filter((p) => sampleGender(p) === applied.lookingFor)
    const [min, max] = applied.age.replace('+', ' - 99').split('-').map((n) => parseInt(n, 10))
    if (min && max) list = list.filter((p) => p.age >= min - 4 && p.age <= max + 4)
    if (applied.city !== 'Any City') list = list.filter((p) => p.location.startsWith(applied.city))
    if (applied.profession !== 'Any') list = list.filter((p) => p.profession.includes(applied.profession.split(' ')[0]))
    if (sort === 'Age: Low to High') list = [...list].sort((a, b) => a.age - b.age)
    if (sort === 'Age: High to Low') list = [...list].sort((a, b) => b.age - a.age)
    return list
  }, [applied, sort])

  const pages = Math.max(1, Math.ceil(results.length / PAGE_SIZE))
  const shown = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const toLogin = () => navigate('/login') // guests are sent to Login for view/shortlist (PRD 10.1 #5, assumed)

  return (
    <>
      <PageHero eyebrow="Find your perfect match" title="Search for Like-Minded People" text="Discover profiles that match your preferences, values and lifestyle." />

      <section className="container-page relative z-10 -mt-8">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            setApplied(form)
            setPage(1)
          }}
          className="grid gap-4 rounded-xl border border-border-light bg-white p-5 shadow-[0_12px_40px_rgba(101,21,45,0.12)] sm:grid-cols-2 lg:grid-cols-5 lg:p-6"
        >
          <SelectInput label="I am looking for" options={OPTIONS.lookingForGender} value={form.lookingFor} onChange={set('lookingFor')} />
          <SelectInput label="Age Range" options={OPTIONS.ageRange} value={form.age} onChange={set('age')} />
          <SelectInput label="Religion" options={OPTIONS.religion} value={form.religion} onChange={set('religion')} />
          <SelectInput label="Community" options={OPTIONS.communityAny} value={form.community} onChange={set('community')} />
          <SelectInput label="Location" options={OPTIONS.cityAny} value={form.city} onChange={set('city')} />
          <SelectInput label="Education" options={OPTIONS.educationAny} value={form.education} onChange={set('education')} />
          <SelectInput label="Profession" options={OPTIONS.professionAny} value={form.profession} onChange={set('profession')} />
          <SelectInput label="Marital Status" options={OPTIONS.maritalAny} value={form.marital} onChange={set('marital')} />
          <SelectInput label="Annual Income" options={OPTIONS.incomeAny} value={form.income} onChange={set('income')} />
          <div className="flex items-end">
            <Button type="submit" full>
              Search <Icon name="arrowRight" size={18} />
            </Button>
          </div>
        </form>
      </section>

      <section className="container-page py-10 lg:py-14" aria-live="polite">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <p className="text-lg text-text-strong">
            <strong className="text-primary">{results.length}</strong> Matches Found
          </p>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm text-text-muted">
              Sort by
              <SelectInput compact aria-label="Sort by" className="w-44" options={OPTIONS.sort} value={sort} onChange={(e) => setSort(e.target.value)} />
            </label>
            <span className="hidden h-11 w-11 place-items-center rounded-sm border border-primary bg-tint-2 text-primary sm:grid" title="Grid view">
              <Icon name="grid" size={20} />
            </span>
          </div>
        </div>

        {shown.length ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-5">
            {shown.map((p) => (
              <ProfileCard key={p.id} profile={p} variant="public" onView={toLogin} onToggleShortlist={toLogin} />
            ))}
          </div>
        ) : (
          <div className="rounded-md border border-dashed border-border bg-surface-alt p-12 text-center text-text-muted">No profiles match these filters. Try widening your search.</div>
        )}

        {pages > 1 && (
          <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Pagination">
            <PageBtn disabled={page === 1} onClick={() => setPage(page - 1)} label="Previous page">
              <Icon name="chevronLeft" size={18} />
            </PageBtn>
            {Array.from({ length: pages }, (_, i) => (
              <PageBtn key={i} active={page === i + 1} onClick={() => setPage(i + 1)} label={`Page ${i + 1}`}>
                {i + 1}
              </PageBtn>
            ))}
            <PageBtn disabled={page === pages} onClick={() => setPage(page + 1)} label="Next page">
              <Icon name="chevronRight" size={18} />
            </PageBtn>
          </nav>
        )}
      </section>
    </>
  )
}

function PageBtn({ children, active, disabled, onClick, label }: { children: React.ReactNode; active?: boolean; disabled?: boolean; onClick: () => void; label: string }) {
  return (
    <button type="button" aria-label={label} aria-current={active ? 'page' : undefined} disabled={disabled} onClick={onClick} className={`grid h-10 min-w-10 place-items-center rounded-sm border px-3 text-sm font-medium disabled:opacity-40 ${active ? 'border-primary bg-primary text-white' : 'border-border bg-white text-text hover:bg-tint-2'}`}>
      {children}
    </button>
  )
}
