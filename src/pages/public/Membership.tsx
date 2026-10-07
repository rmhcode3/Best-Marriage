import { useNavigate } from 'react-router-dom'
import { Button, ButtonLink } from '../../components/ui/Button'
import { Icon } from '../../components/ui/Icon'
import { PageHero } from '../../components/ui/PageHero'
import { useApp } from '../../context/AppContext'

// Prices are shown in ₹ exactly as designed; currency for a UK audience is an open point (PRD 10.1 #9).
const PLANS = [
  { name: 'Free Plan', line: 'Start your journey with basic access.', price: '₹0', period: 'Forever Free', month: '', cta: 'Get Started', outline: true },
  { name: 'Basic Plan', line: 'Get more visibility and connect easily.', price: '₹999', period: '/ 3 Months', month: '₹333 per month', cta: 'Choose Basic', outline: true },
  { name: 'Premium Plan', line: 'Unlock advanced features and more matches.', price: '₹1,999', period: '/ 6 Months', month: '₹333 per month', cta: 'Choose Premium', popular: true },
  { name: 'Elite Plan', line: 'Premium experience with personal assistance.', price: '₹2,999', period: '/ 12 Months', month: '₹250 per month', cta: 'Choose Elite', outline: true },
]

// Desktop matrix (PRD 7.1). The mobile table differs in two cells — open point 10.1 #8.
const FEATURES: [string, ...(string | boolean)[]][] = [
  ['Create Profile', true, true, true, true],
  ['Browse Profiles', 'Limited', 'Unlimited', 'Unlimited', 'Unlimited'],
  ['Send Interests', '5 per month', '50 per month', 'Unlimited', 'Unlimited'],
  ['Chat with Matches', false, true, true, true],
  ['Advanced Search Filters', false, false, true, true],
  ['See Who Viewed Your Profile', false, false, true, true],
  ['Priority Support', false, false, true, true],
]

const Cell = ({ v }: { v: string | boolean }) =>
  typeof v === 'boolean' ? (
    v ? <Icon name="check" size={20} className="mx-auto text-success" aria-label="Included" /> : <Icon name="close" size={18} className="mx-auto text-text-faint" aria-label="Not included" />
  ) : (
    <span className="text-sm text-text">{v}</span>
  )

export default function Membership() {
  const navigate = useNavigate()
  const { state } = useApp()
  // Guests go to Login. Checkout for members is not designed (PRD 10.2).
  const choose = () => navigate('/login')

  return (
    <>
      <PageHero eyebrow="Membership plans" title="Find Your Perfect Match with the Right Plan" text="Choose a plan that fits your journey. Unlock more possibilities, connect with genuine profiles and take a step closer to your happily ever after." />

      <section className="container-page py-12 lg:py-16">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PLANS.map((p) => (
            <div key={p.name} className={`relative flex flex-col rounded-md border bg-white p-6 text-center ${p.popular ? 'border-primary shadow-[0_12px_30px_rgba(155,18,56,0.15)]' : 'border-border-light shadow-sm'}`}>
              {p.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">Most Popular</span>}
              <h2 className="font-sans text-lg font-semibold">{p.name}</h2>
              <p className="mt-1 min-h-10 text-sm text-text-muted">{p.line}</p>
              <p className="mt-4 font-heading text-4xl font-semibold text-primary">{p.price}</p>
              <p className="text-sm text-text-muted">{p.period}</p>
              <p className="mb-5 min-h-5 text-xs text-text-subtle">{p.month}</p>
              <div className="mt-auto">
                {state === 'member' ? (
                  <Button full variant={p.outline ? 'secondary' : 'primary'} disabled title="Checkout is coming soon">
                    {p.cta}
                  </Button>
                ) : (
                  <Button full variant={p.outline ? 'secondary' : 'primary'} onClick={choose}>
                    {p.cta}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 overflow-x-auto rounded-md border border-border-light bg-white">
          <table className="w-full min-w-[640px] text-center">
            <caption className="sr-only">Plan feature comparison</caption>
            <thead>
              <tr className="border-b border-border-light">
                <th className="p-4 text-left text-sm font-semibold text-text-strong" scope="col">Features</th>
                {PLANS.map((p) => (
                  <th key={p.name} scope="col" className={`p-4 text-sm font-semibold ${p.popular ? 'bg-tint-2 text-primary' : 'text-text-strong'}`}>
                    {p.name.replace(' Plan', '')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FEATURES.map(([feature, ...vals]) => (
                <tr key={feature} className="border-b border-border-light last:border-0">
                  <th scope="row" className="p-4 text-left text-sm font-medium text-text">{feature}</th>
                  {vals.map((v, i) => (
                    <td key={i} className={`p-4 ${i === 2 ? 'bg-tint-4' : ''}`}>
                      <Cell v={v} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-10 rounded-xl bg-gradient-to-r from-primary to-primary-dark p-8 text-center text-white md:hidden">
          <h2 className="text-2xl text-white">Upgrade Today</h2>
          <p className="mt-2 text-white/90">Get more visibility, better matches and a faster path to your perfect match.</p>
          <ButtonLink to="/login" variant="light" className="mt-5">
            Choose Plan <Icon name="arrowRight" size={18} />
          </ButtonLink>
        </div>
      </section>
    </>
  )
}
