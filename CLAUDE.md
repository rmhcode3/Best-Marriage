# CLAUDE.md — BMM

Guidance for Claude Code when working in this repository.

## What this project is

BMM is a matrimonial web app for Tamil individuals and families in the UK and beyond. Members create a detailed profile, get verified, then search, shortlist and send interest to other members. Tagline: "Same Culture Stronger Together".

## Sources of truth (in this order)

1. **`PRD.md`** — screen-by-screen spec, the full user flow, field lists, open questions and copy corrections. Read the relevant section before building or changing any screen.
2. **Figma** — file key `KMca4wAhAG39dWD7iUJTTY`, Page 1. Open a frame with
   `https://www.figma.com/design/KMca4wAhAG39dWD7iUJTTY/Untitled?node-id=<id with ":" as "-">`.
   Frame IDs for every screen are in the PRD's screen inventory (section 2). If the Figma MCP server is connected, fetch the specific frame before implementing it; never the whole page (it is very large).
3. This file — conventions and rules.

If the PRD and Figma disagree, follow the PRD and tell the user. The Figma prototype links are unreliable (PRD 10.3); do not derive navigation from them.

## Tech stack

**Not decided yet.** Fill this section in before scaffolding:

- Framework:
- Language:
- Styling:
- Backend / API:
- Database:
- Auth (mobile OTP + password, Google sign-in):
- File storage for photos:
- Payments:

Until this is filled in, ask before creating a project, adding dependencies or choosing a library.

### Commands

Add once the project exists: install, dev server, build, lint, type-check, test.

## Rules for building screens

- **Build only what is designed.** If something is marked **[Open]** in PRD section 10, or the screen is listed in 10.2 as not designed, stop and ask. Do not invent screens, fields, dropdown options, plan limits or business rules.
- **Use the corrected copy** from PRD section 11, not the typos in Figma.
- **Responsive, mobile first.** Two designed widths: 390 px (mobile) and 1440 px (desktop). Mobile uses a bottom navigation and drawers; desktop uses a header or a left sidebar. Layout differences per screen are in the PRD.
- **One component, many screens.** The profile card, form fields, buttons, results bar, chips, toggles, step list and completion ring repeat across the app (PRD section 8). Build them once and reuse them; the profile card takes a `variant` (guest teaser, dashboard, result, shortlist, public search).
- **Dropdown options come from data, not hard-coded in components.** Option lists are not final (PRD 10.4); keep them in one place so they can be replaced.
- **Names and sample data** in Figma (Priya, Arun Kumar, Rahul, Arjun) are placeholders. Never ship them.
- **Access control:** guest, registering (profile not submitted), member. Guests cannot open member routes or full profiles; a registering user is kept inside onboarding until the profile is submitted.

## App map

Suggested routes (the design does not define URLs):

```
Public        /  /about  /search  /success-stories  /membership  /help
Auth          /login  /register  /verify-otp
Onboarding    /onboarding/personal → location → education → family → culture
              → marriage → partner → photos → about → review
Member        /app/dashboard  /app/search  /app/recommended  /app/interests
              /app/shortlisted  /app/profile/:id  /app/my-profile  /app/settings
```

Onboarding order is fixed: Personal Information → Location & Residency → Education & Career → Family Details → Cultural Information → Marriage Intention → Partner Preferences → Photos → About You → Review & Submit. Every step has Back and Save & Continue (the first has only Save & Continue). Each step saves on continue so the user can leave and resume. Editing from Review returns to Review.

Navigation:

- Public desktop header: Home, About, Search, Success Stories, Membership, Help, region selector, Login, Register.
- Public mobile: hamburger → right-side drawer with the same items.
- Member desktop: top bar (search, Advanced Search, notifications bell, avatar menu) + left sidebar (Dashboard, Search Profiles, Recommended, Interests, Shortlisted, My Profile, Settings).
- Member mobile: bottom nav (home, search, Matches, Interests, More) + "More" drawer with the full sidebar list.

## Design tokens

The Figma file has no shared styles or variables; these values were measured from the frames. Define them once as theme tokens and use only the tokens.

```
Colour
  primary            #9B1238   buttons, links, active states
  primary-dark       #65152D   footer
  primary-tint-1     #F3DFE3
  primary-tint-2     #FCECEF
  primary-tint-3     #FFF0F3
  primary-tint-4     #FFF7F8
  success            #16A765   Verified, Online
  text-strong        #222222
  text               #333333
  text-muted         #555555
  text-subtle        #777777
  text-faint         #888888
  border             #DADADA   inputs
  border-light       #EEEEEE   cards
  surface            #FFFFFF
  surface-alt        #FAFAFA

Type
  body / UI          Inter — 400, 500, 600
  headings           Playfair Display — 600
  sizes              12 caption · 13–14 body, labels · 16 buttons, card names
                     24–30 page titles · 38–42 hero

Shape
  radius-sm          6     inputs, buttons
  radius-md          12    cards
  radius-lg          16–20 large panels
  control height     48    (primary buttons 48–50, textarea 96)

Layout
  mobile frame       390, 16–18 side padding, header 72
  desktop frame      1440, 80 side padding, header 80
```

## Domain terms

- **Interest / Send Interest** — a member signalling they would like to connect with another member. Monthly limits depend on the plan. (The Interests screen itself is an open question — PRD 10.1 #2.)
- **Shortlist** — a member's private saved list of profiles (heart icon).
- **Verified** — a profile that has passed identity verification; shown as a green badge.
- **Profile Completion** — percentage of the profile filled in.
- **Background** — Indian Tamil, Sri Lankan Tamil, etc.
- **Gotram, Nakshatram (star), Rasi, Lagnam, Dosham** — Tamil horoscope and lineage fields used in matching. Keep these exact labels.
- **Plans** — Free, Basic, Premium, Elite.

## Data and privacy

This app stores sensitive personal data: religion, caste, ethnicity, family details, photos, phone numbers and identity documents.

- Never log profile fields, OTPs, passwords or tokens. Never put real personal data in fixtures, tests or commits.
- Phone numbers and contact details are hidden from other members unless the member's "Show Phone Number" setting and plan allow it; enforce this on the server, not only in the UI.
- Photos are visible to logged-in members only; guests see a locked placeholder. Serve photos through access-controlled URLs.
- Respect the Profile Visibility setting in every query that returns profiles.
- Validate and authorise on the server; never trust client-side checks for plan limits or access.

## Working agreements

- Before a screen: read its PRD section, list the components it reuses, then build.
- After a screen: check it at 390 px and 1440 px against the Figma frame, and check every action goes where the PRD says.
- Keep changes scoped to the task. Do not refactor unrelated code or add libraries without asking.
- When you hit a gap in the design, add it to "Open points" in `PRD.md` and ask, instead of guessing.
- Update `PRD.md` and this file when a decision is made, so they stay the source of truth.
