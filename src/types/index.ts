export type Option = { value: string; label: string }

export type FieldType =
  | 'text'
  | 'email'
  | 'date'
  | 'select'
  | 'textarea'
  | 'phone'
  | 'chips'
  | 'radio'
  | 'heightRange'

export type FieldDef = {
  name: string
  label: string
  type: FieldType
  required?: boolean
  placeholder?: string
  /** key into OPTIONS (src/data/options.ts) */
  options?: string
  info?: boolean
  highlight?: boolean
  /** render full width in the two-column desktop grid */
  wide?: boolean
  /** only render from the md breakpoint up (PRD O1 phone field is desktop-only) */
  desktopOnly?: boolean
}

export type StepDef = {
  id: string
  path: string
  title: string
  stepLabel: string
  helper: string
  fields: FieldDef[]
}

export type ProfileData = Record<string, string | string[]>

export type ProfileRecord = {
  data: ProfileData
  /** index of the furthest step the member has reached */
  step: number
  photos: string[]
  submitted: boolean
}

export type Account = {
  id: string
  phone?: string
  email?: string
  phoneVerified: boolean
}
