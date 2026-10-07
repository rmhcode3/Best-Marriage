import { ButtonLink, Button } from '../../components/ui/Button'
import { Icon, type IconName } from '../../components/ui/Icon'
import { PageHero } from '../../components/ui/PageHero'
import { SectionHeading } from '../../components/ui/Misc'

const STATS = [
  ['50,000+', 'Verified Members'],
  ['10,000+', 'Successful Matches'],
  ['100%', 'Privacy & Security'],
  ['4.8/5', 'Member Satisfaction'],
]

const DIFFERENT: { icon: IconName; title: string; text: string }[] = [
  { icon: 'shieldCheck', title: 'Verified Profiles', text: 'Authentic and verified members for your safety.' },
  { icon: 'heart', title: 'Personalized Matches', text: 'Smart matching based on your preferences.' },
  { icon: 'lock', title: 'Complete Privacy', text: 'Your data and privacy are always protected.' },
  { icon: 'help', title: 'Dedicated Support', text: "We're here to support you at every step." },
]

export default function About() {
  return (
    <>
      <PageHero
        eyebrow="About BMM"
        title="More Than Matches, Meaningful Connections"
        text="At BMM, we believe in bringing people together with trust, compatibility and shared values. Our mission is to make your journey to find the right life partner simple, safe and meaningful."
      >
        <Button onClick={() => document.getElementById('our-story')?.scrollIntoView({ behavior: 'smooth' })}>
          Our Story <Icon name="arrowRight" size={18} />
        </Button>
      </PageHero>

      <section className="container-page py-12 text-center lg:py-16">
        <p className="font-heading text-xl text-primary md:text-2xl">Real People. Real Stories. Real Relationships.</p>
        <dl className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {STATS.map(([n, l]) => (
            <div key={l} className="rounded-md border border-border-light bg-white p-5 shadow-sm">
              <dt className="order-2 mt-1 text-sm text-text-muted">{l}</dt>
              <dd className="font-heading text-3xl font-semibold text-primary">{n}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section id="our-story" className="bg-tint-4 py-14 lg:py-20">
        <div className="container-page grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">Our Story</p>
            <h2 className="text-2xl md:text-3xl">Built on Trust, Driven by People</h2>
            <p className="mt-4 text-text-muted">BMM began with a simple belief: finding a life partner should feel safe, respectful and rooted in the culture and values families hold dear.</p>
            <p className="mt-3 hidden text-text-muted md:block">Today, BMM is home to thousands of like-minded individuals and families who trust us to help them take that important step.</p>
            <ButtonLink to="/success-stories" className="mt-6">
              Our Story <Icon name="arrowRight" size={18} />
            </ButtonLink>
          </div>
          <div className="grid aspect-[4/3] place-items-center rounded-xl bg-gradient-to-br from-tint-1 to-tint-2 text-primary/60" aria-hidden="true">
            <Icon name="rings" size={96} />
          </div>
        </div>
      </section>

      <section className="container-page py-14 lg:py-20">
        <SectionHeading eyebrow="What makes us different" title="A Safer, Smarter Way to Find Your Match" />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {DIFFERENT.map((d) => (
            <div key={d.title} className="rounded-md border border-border-light bg-white p-6 text-center shadow-sm">
              <span className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-tint-2 text-primary">
                <Icon name={d.icon} size={26} />
              </span>
              <h3 className="font-sans text-base font-semibold">{d.title}</h3>
              <p className="mt-1.5 text-sm text-text-muted">{d.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page pb-16 lg:pb-24">
        <div className="rounded-xl bg-gradient-to-r from-primary to-primary-dark px-6 py-12 text-center text-white">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/80">Our Mission</p>
          <h2 className="text-2xl text-white md:text-3xl">Helping You Find a Brighter Tomorrow</h2>
          <p className="mx-auto mt-3 max-w-2xl text-white/90">We are committed to creating a trusted space where Tamil individuals and families can connect with confidence.</p>
          <ButtonLink to="/register" variant="light" className="mt-6">
            Join BMM Today <Icon name="arrowRight" size={18} />
          </ButtonLink>
          <p className="mt-5 text-sm text-white/80">Because every great story starts with a match.</p>
        </div>
      </section>
    </>
  )
}
