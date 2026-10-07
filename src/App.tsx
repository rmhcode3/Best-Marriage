import { Route, Routes } from 'react-router-dom'
import { GuestOnly, MemberOnly, PublicOnly, RegisteringOnly } from './components/layout/Guards'
import { PublicLayout } from './components/layout/PublicLayout'
import { ButtonLink } from './components/ui/Button'
import { STEPS } from './data/onboarding'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import VerifyOtp from './pages/auth/VerifyOtp'
import DashboardPlaceholder from './pages/member/DashboardPlaceholder'
import PhotosPage from './pages/onboarding/PhotosPage'
import ReviewPage from './pages/onboarding/ReviewPage'
import StepPage from './pages/onboarding/StepPage'
import About from './pages/public/About'
import Help from './pages/public/Help'
import Landing from './pages/public/Landing'
import Membership from './pages/public/Membership'
import PublicSearch from './pages/public/PublicSearch'
import SuccessStories from './pages/public/SuccessStories'

function NotFound() {
  return (
    <div className="container-page grid place-items-center py-24 text-center">
      <h1 className="text-4xl">Page not found</h1>
      <p className="mt-3 text-text-muted">The page you are looking for does not exist.</p>
      <ButtonLink to="/" className="mt-6">
        Back to Home
      </ButtonLink>
    </div>
  )
}

const stepElement = (id: string, i: number) => (id === 'photos' ? <PhotosPage /> : id === 'review' ? <ReviewPage /> : <StepPage index={i} />)

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route element={<PublicOnly />}>
          <Route index element={<Landing />} />
          <Route path="about" element={<About />} />
          <Route path="search" element={<PublicSearch />} />
          <Route path="success-stories" element={<SuccessStories />} />
          <Route path="membership" element={<Membership />} />
          <Route path="help" element={<Help />} />
          <Route element={<GuestOnly />}>
            <Route path="login" element={<Login />} />
          </Route>
        </Route>
        {/* Sign-up and OTP stay reachable while the mobile number is still unverified. */}
        <Route element={<GuestOnly allow={['unverified']} />}>
          <Route path="register" element={<Register />} />
          <Route path="verify-otp" element={<VerifyOtp />} />
        </Route>
      </Route>

      <Route element={<RegisteringOnly />}>
        {STEPS.map((s, i) => (
          <Route key={s.id} path={s.path} element={stepElement(s.id, i)} />
        ))}
      </Route>

      <Route element={<MemberOnly />}>
        <Route path="/app/dashboard" element={<DashboardPlaceholder />} />
        <Route path="/app/*" element={<DashboardPlaceholder />} />
      </Route>

      <Route element={<PublicLayout />}>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

