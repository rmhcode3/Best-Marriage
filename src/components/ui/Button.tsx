import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router-dom'

type Variant = 'primary' | 'secondary' | 'ghost' | 'light'

const base =
  'inline-flex items-center justify-center gap-2 rounded-sm px-5 text-base font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60'

const variants: Record<Variant, string> = {
  primary: 'bg-primary text-white hover:bg-primary-dark',
  secondary: 'border border-border bg-white text-text-strong hover:bg-tint-4',
  ghost: 'text-primary hover:bg-tint-2',
  light: 'bg-white text-primary hover:bg-tint-3',
}

const sizes = { md: 'h-12', sm: 'h-10 text-sm px-4' }

type Common = { variant?: Variant; size?: keyof typeof sizes; full?: boolean; className?: string; children: ReactNode }

const cls = ({ variant = 'primary', size = 'md', full, className = '' }: Omit<Common, 'children'>) =>
  `${base} ${variants[variant]} ${sizes[size]} ${full ? 'w-full' : ''} ${className}`

export function Button({ variant, size, full, className, children, type = 'button', ...rest }: Common & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button type={type} className={cls({ variant, size, full, className })} {...rest}>
      {children}
    </button>
  )
}

export function ButtonLink({ variant, size, full, className, children, ...rest }: Common & LinkProps) {
  return (
    <Link className={cls({ variant, size, full, className })} {...rest}>
      {children}
    </Link>
  )
}
