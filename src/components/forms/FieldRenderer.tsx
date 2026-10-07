import { OPTIONS } from '../../data/options'
import type { FieldDef, ProfileData } from '../../types'
import { FieldShell, SelectInput, Textarea, TextInput } from '../ui/Form'
import { Chip } from '../ui/Misc'

type Props = {
  field: FieldDef
  values: ProfileData
  errors: Record<string, string>
  onChange: (name: string, value: string | string[]) => void
}

const str = (v: string | string[] | undefined) => (Array.isArray(v) ? v.join(', ') : (v ?? ''))

function maxDobForAdult(): string {
  const d = new Date()
  d.setFullYear(d.getFullYear() - 18)
  return d.toISOString().slice(0, 10)
}

/** Renders one onboarding field from its schema definition (data/onboarding.ts). */
export function FieldRenderer({ field, values, errors, onChange }: Props) {
  const { name, label, type, required, placeholder, info, highlight } = field
  const options = field.options ? (OPTIONS[field.options] ?? []) : []
  const error = errors[name]
  const id = `f-${name}`
  const value = values[name]

  switch (type) {
    case 'text':
    case 'email':
      return (
        <TextInput id={id} label={label} required={required} type={type} placeholder={placeholder} value={str(value)} onChange={(e) => onChange(name, e.target.value)} error={error} autoComplete={type === 'email' ? 'email' : 'off'} />
      )

    case 'date':
      return (
        <TextInput
          id={id}
          label={label}
          required={required}
          type="date"
          max={maxDobForAdult()}
          min="1940-01-01"
          value={str(value)}
          onChange={(e) => onChange(name, e.target.value)}
          error={error}
          hint="Format: DD/MM/YYYY"
        />
      )

    case 'phone':
      // The verified sign-up number; changing it is a separate account action (not designed).
      return <TextInput id={id} label={label} required={required} type="tel" value={str(value)} readOnly hint="This is the mobile number you verified" error={error} />

    case 'select':
      return <SelectInput id={id} label={label} required={required} options={options} placeholder={placeholder} info={info} highlight={highlight} value={str(value)} onChange={(e) => onChange(name, e.target.value)} error={error} />

    case 'textarea':
      return <Textarea id={id} label={label} required={required} placeholder={placeholder} value={str(value)} onChange={(e) => onChange(name, e.target.value)} error={error} />

    case 'chips': {
      const selected = Array.isArray(value) ? value : []
      const remaining = options.filter((o) => !selected.includes(o.value))
      return (
        <FieldShell label={label} required={required} info={info} highlight={highlight} htmlFor={id} error={error}>
          {selected.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {selected.map((s) => (
                <Chip key={s} onRemove={() => onChange(name, selected.filter((x) => x !== s))}>
                  {s}
                </Chip>
              ))}
            </div>
          )}
          <SelectInput id={id} options={remaining} placeholder={remaining.length ? 'Add another option' : 'All options selected'} disabled={!remaining.length} value="" onChange={(e) => e.target.value && onChange(name, [...selected, e.target.value])} />
        </FieldShell>
      )
    }

    case 'radio':
      return (
        <FieldShell label={label} required={required} htmlFor={id} error={error}>
          <div id={id} role="radiogroup" aria-label={label} className="flex h-control items-center gap-6">
            {options.map((o) => (
              <label key={o.value} className="flex cursor-pointer items-center gap-2 text-text">
                <input type="radio" name={name} checked={value === o.value} onChange={() => onChange(name, o.value)} className="h-4 w-4 accent-primary" />
                {o.label}
              </label>
            ))}
          </div>
        </FieldShell>
      )

    case 'heightRange':
      return (
        <FieldShell label={label} htmlFor={`${id}Min`} error={error}>
          <div className="grid grid-cols-2 gap-3">
            <SelectInput id={`${id}Min`} aria-label="Minimum height" options={OPTIONS.height} placeholder="Min. height" value={str(values[`${name}Min`])} onChange={(e) => onChange(`${name}Min`, e.target.value)} />
            <SelectInput id={`${id}Max`} aria-label="Maximum height" options={OPTIONS.height} placeholder="Max. height" value={str(values[`${name}Max`])} onChange={(e) => onChange(`${name}Max`, e.target.value)} />
          </div>
        </FieldShell>
      )
  }
}
