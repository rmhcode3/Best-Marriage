import { useId, useState, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react'
import type { Option } from '../../types'
import { Icon, type IconName } from './Icon'

const control =
  'w-full rounded-sm border bg-white px-4 text-base text-text placeholder:text-text-faint focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'

type FieldShellProps = {
  label: ReactNode
  required?: boolean
  error?: string
  info?: boolean
  highlight?: boolean
  hint?: string
  htmlFor: string
  children: ReactNode
  className?: string
}

/** Label + control + error. Used by every form in the app. */
export function FieldShell({ label, required, error, info, highlight, hint, htmlFor, children, className = '' }: FieldShellProps) {
  return (
    <div className={`${highlight ? 'rounded-md bg-tint-3 p-4' : ''} ${className}`}>
      <label htmlFor={htmlFor} className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-text-strong">
        {label}
        {required && <span className="text-danger" aria-hidden="true">*</span>}
        {info && <Icon name="info" size={15} className="text-primary" />}
      </label>
      {children}
      {hint && !error && <p className="mt-1 text-xs text-text-subtle">{hint}</p>}
      {error && (
        <p id={`${htmlFor}-error`} role="alert" className="mt-1 text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  )
}

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  error?: string
  icon?: IconName
  hint?: string
  info?: boolean
  highlight?: boolean
  className?: string
}

export function TextInput({ label, error, icon, hint, info, highlight, className, id, required, ...rest }: InputProps) {
  const auto = useId()
  const fid = id ?? auto
  return (
    <FieldShell label={label} required={required} error={error} htmlFor={fid} hint={hint} info={info} highlight={highlight} className={className}>
      <div className="relative">
        {icon && <Icon name={icon} size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-faint" />}
        <input
          id={fid}
          required={false}
          aria-required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${fid}-error` : undefined}
          className={`${control} h-control ${icon ? 'pl-11' : ''} ${error ? 'border-danger' : 'border-border'}`}
          {...rest}
        />
      </div>
    </FieldShell>
  )
}

export function PasswordInput({ label, error, className, id, required, ...rest }: Omit<InputProps, 'icon' | 'type'>) {
  const auto = useId()
  const fid = id ?? auto
  const [show, setShow] = useState(false)
  return (
    <FieldShell label={label} required={required} error={error} htmlFor={fid} className={className}>
      <div className="relative">
        <Icon name="lock" size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-text-faint" />
        <input
          id={fid}
          type={show ? 'text' : 'password'}
          aria-required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${fid}-error` : undefined}
          className={`${control} h-control pl-11 pr-12 ${error ? 'border-danger' : 'border-border'}`}
          {...rest}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-2 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center text-text-faint hover:text-text"
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          <Icon name={show ? 'eyeOff' : 'eye'} size={18} />
        </button>
      </div>
    </FieldShell>
  )
}

type SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, 'children' | 'label'> & {
  label?: ReactNode
  options: Option[]
  placeholder?: string
  error?: string
  info?: boolean
  highlight?: boolean
  className?: string
  /** compact variant for filter bars */
  compact?: boolean
}

export function SelectInput({ label, options, placeholder, error, info, highlight, className, id, required, compact, ...rest }: SelectProps) {
  const auto = useId()
  const fid = id ?? auto
  const select = (
    <div className="relative">
      <select
        id={fid}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${fid}-error` : undefined}
        aria-label={label ? undefined : placeholder}
        className={`${control} ${compact ? 'h-11' : 'h-control'} appearance-none pr-10 ${error ? 'border-danger' : 'border-border'} ${!rest.value ? 'text-text-faint' : ''}`}
        {...rest}
      >
        {placeholder && (
          <option value="" disabled={!!required}>
            {placeholder}
          </option>
        )}
        {options.map((o) => (
          <option key={o.value} value={o.value} className="text-text">
            {o.label}
          </option>
        ))}
      </select>
      <Icon name="chevronDown" size={18} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-text-faint" />
    </div>
  )
  if (!label) return <div className={className}>{select}</div>
  return (
    <FieldShell label={label} required={required} error={error} htmlFor={fid} info={info} highlight={highlight} className={className}>
      {select}
    </FieldShell>
  )
}

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; error?: string; className?: string }

export function Textarea({ label, error, className, id, required, ...rest }: TextareaProps) {
  const auto = useId()
  const fid = id ?? auto
  return (
    <FieldShell label={label} required={required} error={error} htmlFor={fid} className={className}>
      <textarea
        id={fid}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${fid}-error` : undefined}
        className={`${control} h-24 resize-y py-3 ${error ? 'border-danger' : 'border-border'}`}
        {...rest}
      />
    </FieldShell>
  )
}

export function Checkbox({ checked, onChange, children, error }: { checked: boolean; onChange: (v: boolean) => void; children: ReactNode; error?: string }) {
  const id = useId()
  return (
    <div>
      <label htmlFor={id} className="flex cursor-pointer items-start gap-2.5 text-sm text-text-muted">
        <input id={id} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="mt-0.5 h-4 w-4 accent-primary" />
        <span>{children}</span>
      </label>
      {error && (
        <p role="alert" className="mt-1 text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  )
}
