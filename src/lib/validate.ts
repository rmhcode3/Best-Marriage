import type { FieldDef, ProfileData } from '../types'
import { isValidEmail } from './format'

const isEmpty = (v: string | string[] | undefined) => (Array.isArray(v) ? v.length === 0 : !v || !v.trim())

/** Validate the fields of one step. Returns a map of field name → message. */
export function validateFields(fields: FieldDef[], values: ProfileData): Record<string, string> {
  const errors: Record<string, string> = {}
  for (const f of fields) {
    const v = values[f.name]
    if (f.required && isEmpty(v)) {
      errors[f.name] = f.type === 'select' || f.type === 'chips' || f.type === 'radio' ? `Please select ${f.label.replace(/\?$/, '').toLowerCase()}.` : `${f.label.replace(/\?$/, '')} is required.`
      continue
    }
    if (f.type === 'email' && !isEmpty(v) && !isValidEmail(String(v))) errors[f.name] = 'Enter a valid email address.'
    if (f.type === 'date' && !isEmpty(v)) {
      const d = new Date(String(v))
      const age = (Date.now() - d.getTime()) / (365.25 * 24 * 3600 * 1000)
      if (Number.isNaN(d.getTime())) errors[f.name] = 'Enter a valid date.'
      else if (age < 18) errors[f.name] = 'You must be at least 18 years old.'
    }
  }
  return errors
}
