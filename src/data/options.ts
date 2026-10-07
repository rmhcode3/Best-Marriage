import type { Option } from '../types'

/**
 * Dropdown option lists. PRD 10.4: the design gives no final lists, so every list
 * here is PROVISIONAL and lives in this one file so it can be replaced wholesale
 * (e.g. by values served from the database).
 */
const opts = (...labels: string[]): Option[] => labels.map((l) => ({ value: l, label: l }))

const yesNoMaybe = opts('Yes', 'No', 'Not Sure')

const heights: Option[] = []
for (let inches = 54; inches <= 84; inches++) {
  const label = `${Math.floor(inches / 12)} ft ${inches % 12} in (${Math.round(inches * 2.54)} cm)`
  heights.push({ value: label, label })
}

const thisYear = new Date().getFullYear()
const passingYears: Option[] = Array.from({ length: 50 }, (_, i) => {
  const y = String(thisYear + 4 - i)
  return { value: y, label: y }
})

const zodiac = ['Mesham (Aries)', 'Rishabam (Taurus)', 'Mithunam (Gemini)', 'Kadagam (Cancer)', 'Simmam (Leo)', 'Kanni (Virgo)', 'Thulaam (Libra)', 'Viruchigam (Scorpio)', 'Dhanusu (Sagittarius)', 'Magaram (Capricorn)', 'Kumbam (Aquarius)', 'Meenam (Pisces)']

export const OPTIONS: Record<string, Option[]> = {
  gender: opts('Male', 'Female'),
  maritalStatus: opts('Never Married', 'Divorced', 'Widowed', 'Awaiting Divorce', 'Annulled'),
  height: heights,
  country: opts('United Kingdom', 'Sri Lanka', 'India', 'Canada', 'Australia', 'United States', 'Germany', 'France', 'Switzerland', 'Singapore', 'Malaysia', 'Other'),
  state: opts('England', 'Scotland', 'Wales', 'Northern Ireland', 'Tamil Nadu', 'Northern Province (Sri Lanka)', 'Eastern Province (Sri Lanka)', 'Western Province (Sri Lanka)', 'Ontario', 'Other'),
  location: opts('London', 'Birmingham', 'Manchester', 'Leicester', 'Leeds', 'Glasgow', 'Chennai', 'Colombo', 'Jaffna', 'Toronto', 'Other'),
  residentialStatus: opts('Citizen', 'Permanent Resident', 'Work Visa', 'Student Visa', 'Temporary Visa'),
  livingWith: opts('Parents', 'Family', 'Alone', 'Friends / Flatmates'),
  relocate: yesNoMaybe,
  education: opts('High School', 'Diploma', "Bachelor's Degree", "Master's Degree", 'MBA', 'Doctorate', 'Professional Qualification', 'Other'),
  fieldOfStudy: opts('Engineering', 'Computer Science / IT', 'Medicine & Healthcare', 'Business & Management', 'Finance & Accounting', 'Law', 'Arts & Humanities', 'Science', 'Education', 'Other'),
  passingYear: passingYears,
  occupation: opts('Software Professional', 'Doctor', 'Engineer', 'Accountant / Finance', 'Teacher / Lecturer', 'Business Owner', 'Government Service', 'Healthcare Professional', 'Legal Professional', 'Student', 'Not Working', 'Other'),
  income: opts('Under £20,000', '£20,000 - £40,000', '£40,000 - £60,000', '£60,000 - £80,000', '£80,000 - £100,000', 'Above £100,000', 'Prefer not to say'),
  parentStatus: opts('Employed', 'Business', 'Retired', 'Homemaker', 'Not Living'),
  siblings: opts('0', '1', '2', '3', '4+'),
  siblingsMarital: opts('All Unmarried', 'Some Married', 'All Married', 'Not Applicable'),
  familyType: opts('Nuclear Family', 'Joint Family', 'Extended Family'),
  familyValues: opts('Traditional', 'Moderate', 'Liberal'),
  background: opts('Indian Tamil', 'Sri Lankan Tamil', 'Malaysian Tamil', 'Singaporean Tamil', 'Other'),
  caste: opts('Vellalar', 'Mudaliar', 'Pillai', 'Chettiar', 'Naidu', 'Brahmin', 'Yadav', 'Nadar', 'Thevar', 'Other', 'Prefer not to say'),
  subCaste: opts('Not Applicable', 'Other'),
  gotram: opts('Not Known', 'Other'),
  star: opts('Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashira', 'Ardra', 'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni', 'Hasta', 'Chitra', 'Swati', 'Vishakha', 'Anuradha', 'Jyeshtha', 'Mula', 'Purva Ashadha', 'Uttara Ashadha', 'Shravana', 'Dhanishta', 'Shatabhisha', 'Purva Bhadrapada', 'Uttara Bhadrapada', 'Revati'),
  rasi: opts(...zodiac),
  lagnam: opts(...zodiac),
  dosham: opts('No Dosham', 'Chevvai Dosham', 'Rahu / Ketu Dosham', 'Sarpa Dosham', 'Not Sure'),
  tamilYear: opts('Prabhava', 'Vibhava', 'Shukla', 'Pramodoota', 'Prajotpatti', 'Angirasa', 'Srimukha', 'Bhava', 'Yuva', 'Dhatu', 'Not Sure'),
  ethnicity: opts('Tamil', 'Other', 'Prefer not to say'),
  lookingFor: opts('Marriage', 'Long-term relationship', 'Companionship'),
  timeline: opts('Within 6 months', 'Within 1 year', '1 - 2 years', 'Not sure yet'),
  yesNoMaybe,
  yesNoOpen: opts('Yes', 'No', 'Open to discuss'),
  religion: opts('Hindu', 'Christian', 'Muslim', 'Buddhist', 'Other'),
  ageRange: opts('18 - 21', '22 - 25', '25 - 32', '26 - 30', '31 - 35', '36 - 40', '41 - 50', '51+'),
  locationPref: opts('United Kingdom', 'Sri Lanka', 'India', 'Anywhere'),
  sort: opts('Newest First', 'Recently Active', 'Age: Low to High', 'Age: High to Low'),
  lookingForGender: opts('Bride', 'Groom'),
  communityAny: opts('Any', 'Vellalar', 'Mudaliar', 'Pillai', 'Chettiar', 'Naidu', 'Brahmin', 'Other'),
  countryAny: opts('Any', 'United Kingdom', 'Sri Lanka', 'India', 'Canada', 'Australia', 'Other'),
  cityAny: opts('Any City', 'London', 'Birmingham', 'Manchester', 'Leicester', 'Leeds', 'Glasgow'),
  educationAny: opts('Any', "Bachelor's Degree", "Master's Degree", 'MBA', 'Doctorate'),
  professionAny: opts('Any', 'Software Professional', 'Doctor', 'Engineer', 'Business Owner'),
  incomeAny: opts('Any', '£20,000 - £40,000', '£40,000 - £60,000', 'Above £60,000'),
  maritalAny: opts('Never Married', 'Divorced', 'Widowed', 'Any'),
}

export const COUNTRY_CODES: Option[] = [
  { value: '+44', label: '+44' },
  { value: '+94', label: '+94' },
  { value: '+91', label: '+91' },
  { value: '+1', label: '+1' },
  { value: '+61', label: '+61' },
  { value: '+65', label: '+65' },
  { value: '+60', label: '+60' },
]
