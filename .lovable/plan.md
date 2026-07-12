# Glassmorphism Refresh + Responsive Polish

Apply a cohesive, modern glass aesthetic across the Crime Intelligence Assistant while keeping the serious, authoritative tone appropriate for Karnataka SCRB. Make the whole shell responsive down to mobile and fix navbar overflow.

## Visual direction

- Deep navy → midnight gradient app background with a subtle grid/noise overlay and two soft radial "aurora" glows (navy + teal) for depth. No purple, no playful colors.
- Cards, sidebar, topbar, chat bubbles, dialogs → frosted glass surfaces: semi-transparent card color, `backdrop-blur-xl`, 1px hairline border using `border-white/10` in dark and `border-white/40` in light, soft layered shadow.
- Accent glow: teal `--sidebar-primary` used sparingly for active nav item, focus rings, and key CTAs (thin inner ring + outer glow shadow).
- Typography stays Inter; tighten tracking on H1/H2, add a small uppercase eyebrow style already used in login.
- Micro-interactions: 150–200ms ease transitions on hover for cards/nav items, subtle lift (`-translate-y-0.5` + shadow bump), animated shimmer on the active sidebar item's left indicator, `animate-fade-in` on route mount.

## Design tokens (src/styles.css)

Add, without breaking existing semantic tokens:

- `--glass-bg`, `--glass-bg-strong`, `--glass-border`, `--glass-highlight` for light and dark.
- `--shadow-elegant`, `--shadow-glow` (teal-tinted), `--shadow-inset-hairline`.
- `--gradient-app` (navy → midnight), `--gradient-primary` (navy → teal), `--gradient-header`.
- New `@utility glass` and `@utility glass-strong` that compose bg + backdrop-blur + border + shadow so components stay clean.
- Keep all existing color tokens intact so no page breaks.

## Component updates (presentation only)

- `src/routes/_app.tsx` — wrap shell in gradient background + fixed aurora blobs (pointer-events-none), make layout responsive: sidebar becomes an off-canvas drawer under `md`, topbar shows a hamburger that opens it.
- `src/components/app/sidebar.tsx` — apply `glass` utility, add active-item left accent bar with teal glow, smooth width transition already there; add mobile drawer mode driven by a new `mobileOpen` flag in `usePrefs` (or local state via context). Auto-collapse behavior preserved on desktop.
- `src/components/app/topbar.tsx` — apply `glass` utility with sticky top, add hamburger button visible under `md:hidden`, hide search on `sm` (icon-only expand), collapse language/theme/bell into a compact cluster, hide name/badge text under `lg`, keep avatar + role badge. Fix current overflow by using `grid-cols-[auto_minmax(0,1fr)_auto]` with `min-w-0` on the search cell and `shrink-0` on right cluster.
- `src/components/app/primitives.tsx` — `PageHeader` gets responsive stacking (`flex-col sm:flex-row`), `StatCard` gets glass surface + hover lift.
- Login page — upgrade to glass card over the existing navy gradient with a soft aurora, keeps the same form.
- Chat page (`_app.index.tsx`) — message bubbles get glass treatment (assistant = light glass, user = navy gradient); suggestion chips get glass hover state; composer becomes a floating glass bar.
- Dashboard, Sociological, Financial, Network, Map, Alerts, Cases, Offenders, Audit, Settings — swap plain `bg-card border` panels for the `glass` utility via a small find/replace of the shared container classes; grids get responsive breakpoints (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`), tables get horizontal scroll wrappers on mobile.

## Responsiveness rules applied everywhere

- Every header row with text + widgets uses the `grid-cols-[minmax(0,1fr)_auto]` + `min-w-0` + `shrink-0` pattern.
- Tables wrapped in `overflow-x-auto` containers.
- Charts use `ResponsiveContainer` (already do) but parents get min-height and `w-full`.
- Sidebar hidden under `md`, revealed via drawer; main content full-width on mobile with safe padding (`px-4 md:px-6`).
- Topbar controls collapse progressively: search icon-only < md, language pill hidden < sm (moves into settings).

## Out of scope

- No changes to auth store, routing guards, mock data shapes, i18n dictionary, or business logic.
- No new dependencies.

## Technical notes

- Glass utilities use standard `backdrop-filter` only — Lightning CSS handles vendor prefixes; do not hand-write `-webkit-backdrop-filter`.
- All colors stay as semantic tokens; no hardcoded hex in components.
- Mobile drawer uses shadcn `Sheet` (already available in `components/ui`).
- Aurora blobs are absolutely positioned divs with `blur-3xl opacity-30`, `pointer-events-none`, behind content via `-z-10`.
