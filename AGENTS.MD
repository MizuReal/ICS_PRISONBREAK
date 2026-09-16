# AGENTS.md — ICS Prison Break

## Project overview

A prison-break themed escape-room web game. The player solves 4 puzzles
(games 1–4) to earn keys; collecting all 4 keys unlocks the escape gate
(`/escape`). The whole app is one mobile-responsive React SPA — every screen
must work from small phones up to wide desktop.

## Stack & commands

- React 19 + Vite 8 + react-router-dom v7, plain JSX (no TypeScript).
- Tailwind CSS v4 (via `@tailwindcss/vite`). **No `tailwind.config.js`** — the
  config lives in CSS via `@theme` inside `src/index.css`.
- Linting: oxlint (`_oxlintrc.json`). No test framework, no formatter config.

```bash
npm install      # install deps
npm run dev      # dev server with HMR
npm run lint     # oxlint
npm run build    # production build to dist/
npm run preview  # preview the production build
```

There are no automated tests. Verify changes with `npm run lint` + a
`npm run build`, then manually exercise the affected screens.

## Architecture & routing

- `src/App.jsx` — `<BrowserRouter>` + `<ProgressProvider>`, routes nested in
  `Shell`: `/` (Home), `/game/1` … `/game/4`, `/decypher`, `/invite`,
  `/invite/:slug` (personal speaker summons), `/escape`, `*` → redirect `/`.
- `src/layout/Shell.jsx` — global chrome: header, footer, hazard-tape strips,
  and the fixed `.prison-bars` overlay. New screens render inside `<Outlet />`.
- `src/data/games.js` — **single source of truth**: the `games` array (4 cells)
  and `escapeGame`. `Home.jsx` and `Escape.jsx` render entirely from this data
  plus progress state; never hardcode a game list elsewhere.
- `src/data/invite.js` — **single source of truth for the speaker invitation**:
  the `event` details and the 3 `speakers` (name/role/topic/personalNote/photo).
  `Invite.jsx` (`/invite`, public lineup) and `SpeakerInvite.jsx`
  (`/invite/:slug`, personalized, direct-link only) render from it via
  `getSpeaker(slug)`, as does the Home "Wanted notice" card. Replace the `TBA`
  placeholders there, never in the pages.
- `src/state/progress-context.js` / `ProgressProvider.jsx` — in-memory progress:
  `useProgress()` returns `{ completed, isDone(id), markDone(id) }`.
  `useProgress` throws if called outside the provider. Data resets on reload
  (no persistence) — that is expected.
- `src/pages/Locked.jsx` — reusable "under construction" placeholder
  (props: `num`, `title`, `note`). Game2/3/4 currently wrap it.
- `src/components/icons.jsx` — shared stroke SVG icon components
  (`LockIcon`, `KeyIcon`, `CheckIcon`, `ArrowLeftIcon`, `BarsIcon`).
  Add new icons here instead of inlining SVG per page.

File conventions: PascalCase filenames, one default-exported function
component per page file; small presentational helpers (e.g. `StatusBadge` in
Home) may live in the same file.

## Adding a new game puzzle

Games 2–4 are locked placeholders. To implement one:

1. Update its entry in `src/data/games.js` (unique `id` like `'game2'`,
   `num: '02'`, `route: '/game/2'`, `title`, `blurb`, `status`).
2. Build the screen in `src/pages/GameX.jsx`; register its `<Route>` in
   `src/App.jsx`. While building, keep a `Locked`-style placeholder so the
   route never 404s.
3. Call `markDone('gameX')` the moment the puzzle is solved. `Home` and
   `Escape` key counts then update automatically — do not edit them for this.
4. Re-check the escape gating: Escape unlocks only when all four games are
   `isDone`, so a new game requires no Escape changes.

Keep status/flow copy in character (see theme rules below).

## Tailwind CSS v4 rules

- Token-driven styling only. Never use raw hex/vars in JSX — always the theme
  tokens: `concrete-100…950` (grays/backgrounds), `jumpsuit-300…700` (orange,
  primary action), `hazard` (yellow, unlocked/success), `alarm-400/500/600`
  (red, denied/error).
- Fonts: `font-display` (Bebas Neue — big all-caps titles), `font-body`
  (Inter — body copy), `font-mono-ui` (mono — tiny uppercase microcopy).
- Add new tokens, keyframes, or shared utility classes to `src/index.css`
  (`@theme` block / `@layer base` / plain classes); keep JSX to utilities only.
- Reuse existing decorative classes instead of recreating effects:
  `.wall` (page backdrop), `.prison-bars` (full-screen grille overlay —
  `pointer-events-none`, in `Shell`), `.hazard-stripes` / `.alarm-stripes`
  (diagonal tape strips), `.paper-note` + `.tape` (riddle note props).
- Animations live in `index.css`: `.animate-shake`, `.animate-denied`,
  `.animate-unlock`, `.animate-stamp`. If a keyframe is added, extend the
  `prefers-reduced-motion: reduce` block so it is disabled there too.

## Prison-break theme guidelines

- Copy voice: inmate/penitentiary flavor — "cell block", "inmate", "warden",
  "breach", "access denied", "keys", "the yard". Microcopy may be sardonic,
  always uppercase + mono + wide tracking.
- Page anatomy (follow existing pages): back-link breadcrumb → header with
  `font-display` title + numbered `01`…`04`/`EXIT` plate → content panels →
  state-aware actions ("Back to cell block", "Try the door").
- Visual language: sharp corners (`rounded-sm`), bordered panels
  (`border-concrete-700` on `bg-concrete-900/60–80` with
  `backdrop-blur-sm`), `concrete` panels on the darker `.wall` backdrop,
  hazard-tape dividers, dashed `hazard` borders for the final gate.
- Status semantics: `hazard` = unlocked/success (keys, check, gate), red
  `alarm` = wrong/denied, `concrete-*` = locked/pending, `jumpsuit` = the
  active call-to-action.
- Feedback language: "CELL UNLOCKED", "DOOR 01 SLIDES OPEN", "THE GATE IS
  OPEN", "UNDER CONSTRUCTION" — keep this register.
- Keep flavor copy flavor, not theme: styling must stay Tailwind utilities.

## Web & mobile requirements

- **Mobile-first**: compose for narrow screens first, then widen with `sm:`
  variants. No desktop-first layouts, no `max-sm:`-only shortcuts.
- Use `min-h-svh` for full-height columns and `inset-0` for overlays.
  Center content with `mx-auto w-full max-w-5xl` (Shell) /
  `max-w-2xl|max-w-3xl` (pages) and padding `px-4 sm:px-6`.
- Never use fixed widths for text/content; a text column needs
  `min-w-0 flex-1`. Flex rows that crowd on phones must wrap
  (`flex-wrap`) or become columns (`flex-col sm:flex-row`).
- Grids scale down, not up: `grid-cols-2 sm:grid-cols-4` (as in Escape).
- Type should be fluid where it matters: headline via
  `text-[clamp(…)]` (Home hero), otherwise step sizes with `sm:` bumps.
- Interactive elements need comfortable tap targets (buttons already use
  `px-5 py-2.5+`), `focus-visible` rings, and keyboard accessibility.
- Respect `prefers-reduced-motion` (handled centrally in `index.css`).
- The `<meta name="viewport">` already exists in `index.html` — do not
  duplicate or remove it.
- Verify: `npm run lint`, `npm run build`, then manually check at phone
  width (~360px), tablet, and desktop — no horizontal scroll, no clipped
  controls, shake/flash animations disabled under reduced motion.
