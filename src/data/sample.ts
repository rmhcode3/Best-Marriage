/**
 * DEMO PLACEHOLDER CONTENT ONLY. Replace with data from the API before launch.
 * (CLAUDE.md: the Figma sample names must never ship; these are neutral fictional
 * stand-ins so guest pages can be built before the profile API exists.)
 */
export type SampleProfile = {
  id: string
  name: string
  age: number
  profession: string
  location: string
  religion: string
  tongue: string
  online?: boolean
  matchPercent?: number
}

export const SAMPLE_PROFILES: SampleProfile[] = [
  { id: 's1', name: 'Kavya', age: 27, profession: 'Software Engineer', location: 'London, UK', religion: 'Hindu', tongue: 'Tamil', online: true },
  { id: 's2', name: 'Vikram', age: 30, profession: 'Chartered Accountant', location: 'Leicester, UK', religion: 'Hindu', tongue: 'Tamil', online: true },
  { id: 's3', name: 'Thara', age: 26, profession: 'Doctor', location: 'Birmingham, UK', religion: 'Hindu', tongue: 'Tamil' },
  { id: 's4', name: 'Surya', age: 31, profession: 'Product Manager', location: 'Manchester, UK', religion: 'Hindu', tongue: 'Tamil', online: true },
  { id: 's5', name: 'Nila', age: 28, profession: 'Teacher', location: 'Leeds, UK', religion: 'Christian', tongue: 'Tamil' },
  { id: 's6', name: 'Karthik', age: 29, profession: 'Civil Engineer', location: 'Glasgow, UK', religion: 'Hindu', tongue: 'Tamil' },
  { id: 's7', name: 'Anitha', age: 25, profession: 'Pharmacist', location: 'London, UK', religion: 'Hindu', tongue: 'Tamil', online: true },
  { id: 's8', name: 'Rajan', age: 33, profession: 'Business Owner', location: 'Croydon, UK', religion: 'Hindu', tongue: 'Tamil' },
  { id: 's9', name: 'Meera', age: 24, profession: 'Marketing Executive', location: 'Harrow, UK', religion: 'Hindu', tongue: 'Tamil', online: true },
  { id: 's10', name: 'Dinesh', age: 32, profession: 'Data Analyst', location: 'Reading, UK', religion: 'Hindu', tongue: 'Tamil' },
]

const FEMALE_IDS = new Set(['s1', 's3', 's5', 's7', 's9'])
export const sampleGender = (p: SampleProfile) => (FEMALE_IDS.has(p.id) ? 'Bride' : 'Groom')

export type SampleStory = { id: string; couple: string; place: string; quote: string; title: string; tags: string[] }

export const SAMPLE_STORIES: SampleStory[] = [
  { id: 'st1', couple: 'Hari & Sandhya', place: 'London, UK', title: 'From Profiles to Partners', quote: 'We were introduced through BMM and instantly connected over our shared culture and values.', tags: ['Arranged Marriage', 'Same Community', 'Recent'] },
  { id: 'st2', couple: 'Ilan & Mathi', place: 'Toronto, Canada', title: 'Across the Miles', quote: 'Distance never mattered once we found each other. BMM made the first step easy and safe.', tags: ['Love Marriage', 'International'] },
  { id: 'st3', couple: 'Praveen & Janani', place: 'Birmingham, UK', title: 'A Family Affair', quote: 'Our families felt at ease from the very beginning. It felt right from the first conversation.', tags: ['Arranged Marriage', 'Same Community'] },
  { id: 'st4', couple: 'Naveen & Shruthi', place: 'Colombo, Sri Lanka', title: 'Two Cultures, One Story', quote: 'We come from different communities, but BMM helped us see how much we had in common.', tags: ['Love Marriage', 'Different Community', 'International'] },
  { id: 'st5', couple: 'Sanjay & Roshni', place: 'Manchester, UK', title: 'Worth the Wait', quote: 'After months of searching, the right person was just one profile away.', tags: ['Arranged Marriage', 'Recent'] },
  { id: 'st6', couple: 'Bala & Devi', place: 'Chennai, India', title: 'Same Values, Same Dreams', quote: 'Shared values made every conversation feel natural. We are grateful to BMM.', tags: ['Same Community', 'Love Marriage'] },
]
