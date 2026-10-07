import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ProfileCard } from '../../components/profile/ProfileCard'
import { ButtonLink, Button } from '../../components/ui/Button'
import { Icon, type IconName } from '../../components/ui/Icon'
import { SectionHeading } from '../../components/ui/Misc'
import { SelectInput } from '../../components/ui/Form'
import { SAMPLE_PROFILES, SAMPLE_STORIES } from '../../data/sample'
import { OPTIONS } from '../../data/options'

const FEATURES: { icon: IconName; label: string }[] = [
  { icon: 'shieldCheck', label: 'Verified Profiles' },
  { icon: 'lock', label: 'Safe & Secure Platform' },
  { icon: 'users', label: 'Meaningful Connections' },
  { icon: 'heart', label: 'Focused on Tamil Community' },
]

const HOW: { icon: IconName; title: string; text: string; mobile?: string }[] = [
  { icon: 'user', title: 'Create Your Profile', text: 'Quick and easy registration' },
  { icon: 'shieldCheck', title: 'Get Verified', text: 'Build trust in the community' },
  { icon: 'search', title: 'Find Matches', text: 'Search and connect' },
  { icon: 'heart', title: 'Begin Your Journey', text: 'Start your journey together', mobile: 'Take the next step towards a brighter future' },
]

/** Horizontally swipeable on mobile (with dots), a grid on desktop. */
function Swipe({ count, children, desktopCols }: { count: number; children: React.ReactNode; desktopCols: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const onScroll = () => {
    const el = ref.current
    if (!el) return
    setActive(Math.round((el.scrollLeft / (el.scrollWidth - el.clientWidth || 1)) * (count - 1)))
  }
  return (
    <>
      <div ref={ref} onScroll={onScroll} className={`no-scrollbar -mx-[18px] flex snap-x snap-mandatory gap-4 overflow-x-auto px-[18px] pb-2 lg:mx-0 lg:grid lg:overflow-visible lg:px-0 ${desktopCols}`}>
        {children}
      </div>
      <div className="mt-4 flex justify-center gap-2 lg:hidden" aria-hidden="true">
        {Array.from({ length: Math.min(count, 3) }, (_, i) => (
          <span key={i} className={`h-2 rounded-full transition-all ${i === Math.min(active, 2) ? 'w-6 bg-primary' : 'w-2 bg-tint-1'}`} />
        ))}
      </div>
    </>
  )
}

function QuickSearch() {
  const navigate = useNavigate()
  const [v, setV] = useState({ lookingFor: 'Bride', age: '25 - 32', country: 'United Kingdom', community: 'Any' })
  const set = (k: keyof typeof v) => (e: React.ChangeEvent<HTMLSelectElement>) => setV((p) => ({ ...p, [k]: e.target.value }))
  const go = () => navigate(`/search?${new URLSearchParams({ lookingFor: v.lookingFor, age: v.age, country: v.country, community: v.community })}`)

  return (
    <section className="container-page relative z-10 -mt-4 lg:-mt-10" aria-label="Find your match">
      <div className="rounded-xl border border-tint-1 bg-tint-4 p-5 shadow-[0_12px_40px_rgba(101,21,45,0.10)] lg:border-border-light lg:bg-white lg:p-6 lg:shadow-[0_12px_40px_rgba(101,21,45,0.14)]">
        <div className="mb-4 flex items-center justify-between lg:mb-5 lg:justify-start lg:gap-8 lg:border-b lg:border-border-light">
          <h2 className="flex items-center gap-2.5 font-sans text-lg font-semibold text-primary lg:border-b-2 lg:border-primary lg:pb-3 lg:text-base lg:text-primary">
            <Icon name="search" size={24} /> Find Your Match
          </h2>
          <Link to="/search" className="hidden pb-3 text-base font-medium text-text-muted hover:text-primary lg:block">
            Advanced Search
          </Link>
          <Icon name="filter" size={20} className="text-primary lg:hidden" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[repeat(4,1fr)_auto] lg:items-end">
          <SelectInput label={<><span className="lg:hidden">Looking For</span><span className="max-lg:hidden">I am looking for</span></>} options={OPTIONS.lookingForGender} value={v.lookingFor} onChange={set('lookingFor')} />
          <SelectInput label="Age Range" options={OPTIONS.ageRange} value={v.age} onChange={set('age')} />
          <SelectInput label="Country" options={OPTIONS.countryAny.filter((o) => o.value !== 'Any')} value={v.country} onChange={set('country')} />
          <SelectInput label="Community" options={OPTIONS.communityAny} value={v.community} onChange={set('community')} />
          <Button onClick={go} className="mt-2 sm:col-span-2 lg:mt-0 lg:col-span-1 lg:px-8">
            <span className="lg:hidden">Let's Begin</span>
            <span className="hidden lg:inline">Search Profiles</span> <Icon name="arrowRight" size={18} />
          </Button>
        </div>
      </div>
    </section>
  )
}

export default function Landing() {
  const navigate = useNavigate()
  return (
    <>
      {/* Hero: the Figma artwork already carries the tagline and the region strip. */}
      <section className="relative bg-[#fff9f6]">
        <div className="relative flex flex-col lg:block">
          <div className="relative order-first lg:static">
            <img src="/images/hero.png" alt="A Tamil couple with a globe, temple and London skyline behind them" className="h-[400px] w-full object-cover object-[52%_35%] sm:h-[460px] lg:aspect-[1440/652] lg:h-auto" fetchPriority="high" />
            <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#fff9f6] via-[#fff9f6] via-35% to-transparent lg:hidden" aria-hidden="true" />
            <p className="absolute left-4 top-4 font-heading text-[17px] font-semibold leading-[1.25] text-primary lg:hidden">
              Same
              <br />
              Culture
              <br />
              Stronger
              <br />
              Together
              <span className="mt-2 block h-0.5 w-9 bg-primary" />
            </p>
          </div>
          <div className="container-page relative z-10 -mt-28 pb-4 sm:-mt-32 lg:absolute lg:inset-x-0 lg:top-0 lg:mt-0 lg:pb-0 lg:pt-[4.5vw]">
            <div className="max-w-[22rem] lg:max-w-[40%]">
              <h1 className="text-[38px] leading-[1.1] text-[#171717] sm:text-5xl lg:text-[clamp(38px,4.03vw,58px)]">
                Find Your <br />
                Life Partner <br />
                <span className="text-primary">with BMM</span>
              </h1>
              <p className="mt-3 max-w-[22rem] text-sm text-text-muted sm:text-base lg:mt-5 lg:max-w-[25rem]">A trusted matrimonial platform for Tamil individuals and families in the UK and beyond.</p>
              <ButtonLink to="/register" className="mt-7 max-lg:hidden">
                Create a Free Account <Icon name="arrowRight" size={18} />
              </ButtonLink>
            </div>
          </div>
        </div>
        <div className="container-page pb-16 pt-1 lg:hidden">
          <ButtonLink to="/register" full>
            Create a Free Account <Icon name="arrowRight" size={18} />
          </ButtonLink>
          <ul className="mt-5 grid grid-cols-2 gap-3">
            {FEATURES.map((f) => (
              <li key={f.label} className="flex flex-col items-center gap-2 rounded-md border border-tint-1 bg-white p-4 text-center text-sm font-medium text-text-strong shadow-sm">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-tint-2 text-primary">
                  <Icon name={f.icon} />
                </span>
                {f.label}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="-mt-6 lg:mt-0">
        <QuickSearch />
      </div>

      <section className="container-page py-14 lg:py-20">
        <SectionHeading eyebrow="Real people. Real stories." title="Find Matches That Matter" accent />
        <div className="mt-10">
          <Swipe count={SAMPLE_PROFILES.length} desktopCols="lg:grid-cols-5">
            {SAMPLE_PROFILES.slice(0, 5).map((p) => (
              <div key={p.id} className="w-[72%] shrink-0 snap-center sm:w-[44%] lg:w-auto">
                <ProfileCard profile={p} variant="guest" onToggleShortlist={() => navigate('/login')} />
              </div>
            ))}
          </Swipe>
        </div>
        <div className="mt-8 text-center">
          <ButtonLink to="/login" variant="secondary" className="border-primary text-primary">
            View More Profiles <Icon name="arrowRight" size={18} />
          </ButtonLink>
        </div>
      </section>

      <section className="bg-tint-4 py-14 lg:py-20">
        <div className="container-page">
          <SectionHeading title="How It Works" accent upper />
          <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {HOW.map((h, i) => (
              <li key={h.title} className="flex items-center gap-4 rounded-md border border-border-light bg-white p-5 shadow-sm">
                <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-tint-2 text-primary lg:h-12 lg:w-12">
                  <Icon name={h.icon} size={26} />
                </span>
                <span>
                  <span className="block font-semibold text-primary">
                    {i + 1}. {h.title}
                  </span>
                  <span className="text-sm text-text-subtle"><span className={h.mobile ? "lg:hidden" : ""}>{h.mobile ?? h.text}</span>{h.mobile && <span className="max-lg:hidden">{h.text}</span>}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="container-page py-14 lg:py-20">
        <div className="relative overflow-hidden rounded-xl bg-primary bg-cover bg-center px-6 py-12 text-center text-white md:px-12" style={{ backgroundImage: "url('/images/cta-banner.png')" }}>
          <h2 className="text-2xl text-white md:text-3xl">Join Thousands of Tamil Families on BMM</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/90">A safe, trusted and culturally aligned platform.</p>
          <ButtonLink to="/register" variant="light" className="mt-7 w-full sm:w-auto sm:min-w-64">
            Create a Free Account <Icon name="arrowRight" size={18} />
          </ButtonLink>
        </div>
      </section>

      <section className="container-page pb-14 lg:pb-20">
        <SectionHeading title="Success Stories" accent />
        <div className="mt-10">
          <Swipe count={3} desktopCols="lg:grid-cols-2">
            {SAMPLE_STORIES.slice(0, 3).map((s, i) => (
              <figure key={s.id} className={`flex w-[92%] shrink-0 snap-center items-center gap-4 rounded-md border border-border-light bg-white p-5 shadow-sm sm:w-[60%] sm:gap-5 sm:p-6 lg:w-auto ${i === 2 ? 'lg:hidden' : ''}`}>
                <img src="/images/story-couple.png" alt="" className="h-20 w-20 shrink-0 rounded-full object-cover sm:h-[110px] sm:w-[110px]" width={110} height={110} loading="lazy" />
                <div>
                  <blockquote className="font-heading italic text-text-muted">“{s.quote}”</blockquote>
                  <figcaption className="mt-3 font-semibold text-text-strong">– {s.couple}</figcaption>
                  <p className="text-sm text-text-subtle">{s.place}</p>
                </div>
              </figure>
            ))}
          </Swipe>
        </div>
      </section>

      <section className="container-page pb-16 lg:pb-24">
        <div className="overflow-hidden rounded-xl bg-tint-3 bg-cover bg-center p-8 text-center md:p-12" style={{ backgroundImage: "url('/images/ready-card.png')" }}>
          <h2 className="text-2xl text-primary md:text-3xl">Ready to find your perfect match?</h2>
          <p className="mt-2 text-text-muted">Create your free account today and start your journey with BMM.</p>
          <ButtonLink to="/register" className="mt-6 w-full sm:w-auto sm:min-w-64">
            Get Started Now <Icon name="arrowRight" size={18} />
          </ButtonLink>
        </div>
      </section>
    </>
  )
}
