# Where

Where turns money into **life time**. You tell the app how much you earn and how much
you work, and it converts every expense into the hours (and workdays) of your life it
actually costs.

> Example: income R$ 1,500.00/month, 20 h/week, 1 workday = 17h → hourly rate ≈ R$ 18.75.
> A R$ 375.00 expense ≈ 20.0 h ≈ 1.18 workdays.

## Features

- Mandatory onboarding (income, weekly hours, hours per workday).
- Monthly entries table with date (`02, Fri`), description, category, price and
  transaction type, plus a live conversion column that toggles between **hours** and
  **workdays** (the toggle also drives the dashboard).
- Monthly dashboard: per-category totals (R$, current unit and %), an accessible SVG
  pie chart and a summary (income, expenses, balance, expenses in the current unit).
- Entry CRUD (create, edit, delete with confirmation).
- Category CRUD: create, rename, recolor and delete (with reassignment when in use).
- Settings always editable; conversions are recomputed live.
- Export to `.xlsx` with one sheet per month (no charts, no per-category totals).
- PWA: installable, offline-capable, dark theme with the `#F1C40F` accent.

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Type-check and build for production (generates the PWA) |
| `npm run preview` | Serve the production build (use to test the PWA) |
| `npm test` | Run the test suite once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage (domain/state thresholds) |
| `npm run lint` | Lint with oxlint |

## Architecture

- `src/domain` — pure functions: conversions, formatting, validation, month filtering
  and per-category aggregation.
- `src/storage` — `Storage` interface + localStorage implementation (versioned key
  `where:v2`, `schemaVersion`, corrupted-JSON fallback, automatic migration from
  `where:v1`).
- `src/state` | `useReducer` + Context. No state library.
- `src/ui` | components and pages.
- `src/export` | builds the `.xlsx` workbook with `exceljs` (lazy-loaded).

Money is stored and computed as **reais** (plain numbers, rounded to 2 decimals); formatting
happens only for display. Dates are plain calendar days (`YYYY-MM-DD`) and never parsed in a
timezone-shifting way.

## Installing the PWA

Run `npm run build` and `npm run preview`, open the site in a Chromium-based browser and
use the install icon in the address bar. The service worker precaches the app shell so it
works offline.

## Exporting

Open **Settings → Export spreadsheet (.xlsx)**. You get an `.xlsx` with one sheet per
month that has data (e.g. `2026-01 January`), columns `Date, Description, Category,
Price, Transaction Type, Hours, Workdays`, and prices as numeric BRL cells.

## Testing

Tests use Vitest + React Testing Library and follow TDD. Run `npm test` for the suite and
`npm run test:coverage` for coverage (domain and state are enforced at ≥90% statements).
