import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { CompletionRing } from '../../components/ui/Misc'
import { Logo } from '../../components/ui/Logo'
import { useApp } from '../../context/AppContext'

/** Landing spot after Submit Profile. The member screens (M1–M9) are the next milestone. */
export default function DashboardPlaceholder() {
  const { profile, completion, signOut } = useApp()
  const navigate = useNavigate()
  const first = String(profile.data.firstName ?? '')
  return (
    <div className="grid min-h-screen place-items-center bg-tint-4 p-6">
      <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-lg">
        <div className="mb-6 flex justify-center">
          <Logo />
        </div>
        <h1 className="text-2xl">Vanakkam{first ? `, ${first}` : ''}!</h1>
        <p className="mt-2 text-text-muted">Your profile has been submitted.</p>
        <div className="my-6 flex justify-center">
          <CompletionRing value={completion} />
        </div>
        <p className="mb-6 text-sm text-text-subtle">The member dashboard, search, recommendations and the rest of the member area are built in the next milestone.</p>
        <Button
          variant="secondary"
          full
          onClick={async () => {
            await signOut()
            navigate('/')
          }}
        >
          Log out
        </Button>
      </div>
    </div>
  )
}
