import { Link } from 'react-router-dom'

/** BMM logo from the Figma file (maroon on light backgrounds, white on the footer). */
export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link to="/" className="inline-flex items-center" aria-label="BMM home">
      <img src={light ? '/images/logo-footer.png' : '/images/logo.png'} alt="BMM" className="h-10 w-auto lg:h-[52px]" width={170} height={59} />
    </Link>
  )
}
