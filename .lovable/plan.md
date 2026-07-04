
# Crime Intelligence Assistant — Build Plan

A frontend-only, multi-screen internal police platform for Karnataka SCRB. All data is mocked behind a clean service layer so real APIs can drop in later. Starts on the Chat Assistant screen after a mock login.

## Design system

- Palette (added as tokens in `src/styles.css`):
  - `--primary` deep navy `#1F3864`
  - `--destructive` muted maroon `#C0504D` (reserved for alerts / destructive only)
  - `--background` `#F7F8FA`, `--card` white, dark slate foreground
  - Accent teal / amber for graph node categories
- Typography: Inter via `<link>` in `__root.tsx` head, mapped to `--font-sans`
- Light default + optional dark mode toggle (class-based `dark` variant)
- Dense, thin-bordered cards; subtle shadows; government/ops-console feel
- Update `__root.tsx` head metadata to real app title/description ("Crime Intelligence Assistant — Karnataka SCRB")

## Architecture

- **Routing**: TanStack Router file-based routes under `src/routes/`
- **Auth (mock)**: Zustand store `useAuthStore` persisting `{ user, role }` in localStorage. Pathless `_app` layout gates all app routes; unauthenticated users redirected to `/login`.
- **Role gating**: `useRole()` hook + `<RoleGate roles={[...]}>` wrapper + `<Masked>` component that blurs sensitive fields for non-Supervisor roles with a tooltip.
- **State**: Zustand for auth, language (EN/KN), theme, chat sessions. TanStack Query for "fetching" mock data (simulated latency → skeletons).
- **Services layer** (`src/services/`): each file exports typed async mock functions clearly marked `// MOCK`:
  - `auth.service.ts`, `chat.service.ts`, `cases.service.ts`, `offenders.service.ts`, `network.service.ts`, `map.service.ts`, `alerts.service.ts`, `dashboard.service.ts`, `audit.service.ts`
- **Mock data** (`src/mocks/`): seeded generators for FIRs, offenders, network graph, alerts, chat history using realistic Karnataka/Indian context (no sensitive personal data — neutral placeholder labels for caste/religion).
- **i18n**: light-weight `t(key)` helper with EN/KN dictionaries; toggle in top bar.

## Route map

```text
/login                          Login (role selector)
/_app                           Shell: sidebar + topbar + <Outlet/>
  /                             Chat Assistant (default)
  /dashboard                    Analytics dashboard
  /network                      Criminal network graph
  /map                          Crime hotspot map
  /cases                        Case search table
  /cases/$firId                 Case detail (tabs)
  /offenders                    Offender grid
  /offenders/$id                Offender profile
  /alerts                       Early warning center
  /audit                        Audit log
  /settings                     Settings
```

## Screens

1. **Login** — Shield SVG logo placeholder, "Crime Intelligence Assistant", username/password (non-functional), role dropdown (Investigator/Analyst/Supervisor/Policymaker), Sign In → stores mock user + redirects to `/`. Footer: "Confidential Government System — Authorized Personnel Only".
2. **Shell** — Collapsible left sidebar (Chat, Dashboard, Network, Map, Cases, Offenders, Alerts, Audit, Settings) filtered by role (Policymaker hides case-level items, sees aggregate only). Top bar: global search, EN/KN toggle, notification bell w/ badge, avatar + role badge, logout.
3. **Chat Assistant** (home) — Message list with user vs. official assistant styling (navy left border). Rich response cards render inline tables / stat cards / mini Recharts based on `response.kind`. Collapsible "Show reasoning" reveals mock SQL + row count in monospace block. Suggested query chips row. Bottom input with mic (toggle-only), send, language chip. History drawer grouped by date. "Export as PDF" button (uses `window.print` styled view). Seeded with 4–5 example exchanges.
4. **Dashboard** — 5 KPI cards with trend deltas; 12-month multi-line crime trend (Recharts); top-5 districts bar; case-status donut; Recent Alerts panel.
5. **Criminal Network** — `react-force-graph-2d` canvas, color legend, search box, click node → slide-in side panel with "Expand connections", zoom/reset controls. Seeded dataset with a visible cluster.
6. **Crime Map** — Static SVG map of Karnataka districts (no external map API) with colored heat overlays; left filter panel (crime type, date range, district, gravity); intensity legend; click cluster → popover with case count / dominant crime / trend arrow.
7. **Case Search / Detail** — Filterable paginated table (Crime No, Case No, Date, Station, Crime Head, Status, Gravity). Detail page tabs: Overview, Complainant, Accused, Victims, Acts & Sections, Arrests, Chargesheet, Timeline (vertical stepper). Sensitive demographic fields wrapped in `<Masked>`.
8. **Offender Profiles** — Card grid (avatar, name, linked cases, risk badge Low/Med/High). Profile: case history, MO tags, risk-score horizontal bar breakdown, Similar Offenders.
9. **Alerts** — Feed with severity tags (Info/Warning/Critical) + filters.
10. **Audit Log** — Dense read-only paginated table, monospace query column.
11. **Settings** — Profile, language, notifications — minimal.

## Cross-cutting UX

- Skeleton loaders on every "fetch" (TanStack Query + simulated 400–800ms delay)
- Consistent empty states ("No alerts at this time")
- Toast (sonner) for actions like Export, Logout
- Micro-interactions: row/card hover, panel slide-in transitions, chat message fade-in
- Fully responsive; sidebar auto-collapses < lg; tablet-friendly

## Dependencies to add

`zustand`, `recharts`, `react-force-graph-2d`, `d3-force` (peer), `date-fns`. shadcn/ui components already installed are reused; add sidebar/table/tabs usage.

## Technical details

- `src/routes/_app.tsx` — pathless auth-gated layout. `beforeLoad` checks `useAuthStore.getState().user` and `throw redirect({ to: '/login' })` if absent.
- `Masked` component: `<span className="blur-sm select-none" title="Restricted — Supervisor access required">` when `role !== 'Supervisor'`.
- Chat message type: `{ id, role: 'user'|'assistant', text, data?: { kind: 'table'|'stat'|'chart', ... }, sql?: string, rowCount?: number, ts }`.
- Network graph: dynamic import of `react-force-graph-2d` inside a `client-only` effect to avoid SSR window access.
- Karnataka map: inline SVG paths (simplified district shapes) with fill driven by heat value.
- All service functions return `Promise<T>` with `await sleep(rand(300,700))` to trigger skeletons.
- Update `__root.tsx` head with real title/description/OG tags; load Inter via `<link>` in head links.

## Out of scope

Real backend, real auth, real map tiles, real NLP→SQL, PDF library (uses print stylesheet), Kannada full translations (toggle swaps a handful of labels as a demo).
