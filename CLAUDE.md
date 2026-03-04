# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Church web app ("Congregados") with a public-facing landing site and private music tools (chord viewer, transposition, song editor). Spanish-language UI.

## Tech Stack

- **Monorepo:** npm workspaces (`frontend/`, `backend/`, `shared/`)
- **Frontend:** React 19 + Vite 7 + Tailwind CSS v4 + React Router v7
- **Backend:** NestJS v11 + Prisma v6 (CommonJS) + MySQL 8 (Docker)
- **Auth:** JWT (Passport.js) with 7-day expiry, bcrypt password hashing
- **Shared:** TypeScript types/DTOs and music constants consumed by both workspaces

## Commands

### Development
```bash
npm run db:up          # Start MySQL via Docker (port 3307)
npm run db:migrate     # Run Prisma migrations
npm run db:seed        # Seed default user + sample data
npm run dev            # Run both frontend (:5173) and backend (:3000) concurrently
npm run dev:frontend   # Frontend only
npm run dev:backend    # Backend only
npm run db:studio      # Open Prisma Studio GUI
```

### Build
```bash
npm run build          # Build shared → frontend → backend (in order)
```

### Lint
```bash
cd frontend && npm run lint        # ESLint (flat config)
cd backend && npm run lint         # ESLint + Prettier (auto-fix)
cd backend && npm run format       # Prettier only
```

### Test
```bash
cd backend && npm test             # Jest unit tests
cd backend && npm run test:watch   # Jest watch mode
cd backend && npm run test:cov     # Jest with coverage
cd backend && npm run test:e2e     # E2E tests (jest-e2e.json config)
```

### Prisma
```bash
cd backend && npx prisma migrate dev    # Create/apply migration
cd backend && npx prisma generate       # Regenerate client after schema changes
cd backend && npx prisma studio         # Database GUI
```

## Architecture

### Frontend (`frontend/src/`)
- **Entry:** `main.tsx` → `App.tsx` (wraps AuthProvider + RouterProvider + Toaster)
- **Routing:** `routes/index.tsx` — public routes under `/`, private routes under `/app` wrapped in `ProtectedRoute`
- **Pages:** `pages/public/` (landing, announcements, prayers), `pages/auth/` (login), `pages/songs/` (list, viewer, editor, presentation)
- **Auth:** `contexts/AuthContext.tsx` — React Context with localStorage persistence; `lib/api.ts` Axios interceptor auto-redirects to `/login` on 401
- **Music engine:** `lib/music/transpose.ts` (chromatic transposition), `lib/music/chordParser.ts` (parses `[Chord]Lyrics` format into structured SongLine objects)
- **Chord rendering:** `components/viewer/ChordLine.tsx` — positions chords above lyrics using monospace font (`font-mono` + `whitespace-pre`); alignment depends on this
- **UI primitives:** `components/ui/` (Button, Card, Input, Modal, Badge, LoadingSpinner)

### Backend (`backend/src/`)
- **Bootstrap:** `main.ts` — global `/api` prefix, ValidationPipe (whitelist + transform + forbidNonWhitelisted), CORS for localhost
- **Modules:** `app.module.ts` imports: ConfigModule (global), ThrottlerModule (10 req/min), PrismaModule, AuthModule, UsersModule, SongsModule, TagsModule, AnnouncementsModule, PrayersModule
- **Each feature module** follows the pattern: `module.ts` + `controller.ts` + `service.ts` + `dto/` with class-validator decorators
- **Data layer:** `prisma/PrismaService` extends PrismaClient with lifecycle hooks
- **Auth flow:** POST `/api/auth/login` → JWT token → Bearer header on subsequent requests; `JwtAuthGuard` protects private endpoints

### Shared (`shared/src/`)
- `types/index.ts` — All DTO interfaces (SongDto, UserDto, AuthResponse, PaginatedResponse<T>, etc.)
- `constants/music.ts` — NOTES_SHARP array, flat/sharp mappings, FLAT_KEYS set, ALL_KEYS, CHORD_QUALITIES

### Database
- Schema at `backend/prisma/schema.prisma`: User, Song (LongText content), Tag (many-to-many with Song), Announcement, Prayer
- MySQL 8 runs in Docker on **port 3307** (mapped from container's 3306)
- Default seed credentials: `admin@congregados.com` / `congregados2024`

## Skills (`.claude/skills/`)

### `vercel-react-best-practices`
React performance optimization rules from Vercel Engineering (58 rules, 8 categories). **Apply when writing, reviewing, or refactoring any React/frontend code.** Key categories by priority:
1. **CRITICAL:** Eliminate waterfalls (`async-*` rules — Promise.all for independent ops, defer await, Suspense boundaries)
2. **CRITICAL:** Bundle size (`bundle-*` rules — avoid barrel imports, dynamic imports for heavy components, defer third-party libs)
3. **HIGH:** Server-side performance (`server-*` rules)
4. **MEDIUM:** Re-render optimization (`rerender-*` rules — derived state without effects, functional setState, lazy state init, memo correctly)
5. **MEDIUM:** Rendering performance (`rendering-*` rules — conditional render with ternary not &&, content-visibility, hoist static JSX)
6. **LOW-MEDIUM:** JS performance (`js-*` rules — hoist RegExp, Set/Map for lookups, combine iterations, early exit)

Full rule details: `.claude/skills/vercel-react-best-practices/rules/*.md`
Compiled reference: `.claude/skills/vercel-react-best-practices/AGENTS.md`

### `frontend-design`
Creative, production-grade UI design guidelines. **Apply when building new pages, components, or styling UI.** Core principles:
- Choose a **bold, intentional aesthetic direction** — never default to generic AI patterns
- **Typography:** Distinctive font choices (this project uses Playfair Display + Lora + Fira Code)
- **Color:** Dominant colors with sharp accents (Navy/Cream/Amber palette)
- **Motion:** CSS animations, staggered reveals, scroll-triggered effects, hover states
- **Spatial composition:** Asymmetry, overlap, generous negative space or controlled density
- **Backgrounds:** Atmosphere and depth — gradient meshes, noise textures, layered transparencies
- **Avoid:** Inter/Roboto/Arial, purple gradients on white, cookie-cutter layouts

## Key Conventions

- **NestJS package versions:** `@nestjs/config` must be v4.x (v3.x is incompatible with NestJS v11)
- **Song content format:** Chords in brackets before lyrics: `[G]Amazing [D]grace`. Section headers like `[INTRO]`, `[VERSO]`, `[CORO]` are recognized by the parser and rendered differently
- **Transposition is client-side only** — no backend endpoint for it
- **Tailwind v4:** Custom theme defined via `@theme {}` block in `frontend/src/index.css`, not `tailwind.config.js`
- **Design tokens:** Navy `#1e293b`, Cream `#faf7f2`, Amber `#d4a853`; fonts: Playfair Display (headings), Lora (body), Fira Code (chords)
- **Vite proxy:** `/api` requests proxy to `localhost:3000` in dev
- **Backend validation:** Global ValidationPipe with whitelist strips unknown properties; all DTOs use class-validator decorators
- **Pagination:** Song list endpoint accepts `page`, `limit`, `search`, and tag query params; returns `PaginatedResponse<T>`
