# BMM — Best Marriage

Matrimonial web app for Tamil individuals and families. Spec: `PRD.md`; rules: `CLAUDE.md`.

Stack: React 19 + Vite + TypeScript + Tailwind v4, Supabase (auth, Postgres, private photo storage).

```
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build
npm run lint
```

Supabase: create a project, run `supabase/schema.sql`, enable Phone (SMS) and Google auth, copy `.env.example` to `.env.local`.
Without env vars the app uses a local mock (OTP `123456`) — dev only.
