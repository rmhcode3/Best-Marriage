/** Build an E.164-style number from a country code and the digits typed by the user. */
export function toE164(countryCode: string, number: string): string {
  const digits = number.replace(/\D/g, '').replace(/^0+/, '')
  return `${countryCode}${digits}`
}

export function isValidPhone(number: string): boolean {
  const digits = number.replace(/\D/g, '')
  return digits.length >= 7 && digits.length <= 12
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

/** Mask a phone number for display, e.g. +44 79•• •••456 */
export function maskPhone(phone: string): string {
  if (phone.length < 6) return phone
  return `${phone.slice(0, 5)}••• •••${phone.slice(-3)}`
}

export function formatDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

export const currentYear = new Date().getFullYear()
