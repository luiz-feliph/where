import type { AppState, Entry } from '../domain/types'
import { DEFAULT_SCHEMA_VERSION } from '../domain/types'
import { roundMoney } from '../domain/formatting'
import type { Storage } from './Storage'
import { STORAGE_KEY, LEGACY_STORAGE_KEY } from './Storage'

const SEED_CATEGORIES = [
  { id: crypto.randomUUID(), name: 'Other', color: '#808080' },
  { id: crypto.randomUUID(), name: 'Investment', color: '#FFD700' },
  { id: crypto.randomUUID(), name: 'Personal', color: '#87CEEB' },
  { id: crypto.randomUUID(), name: 'Food & Drinks', color: '#FF6B6B' },
]

export function createInitialState(): AppState {
  return {
    schemaVersion: DEFAULT_SCHEMA_VERSION,
    settings: null,
    categories: SEED_CATEGORIES.map((c) => ({ ...c })),
    entries: [],
    conversionUnit: 'hours',
  }
}

interface LegacyV1Entry {
  id: string
  date: string
  description: string
  categoryId: string
  type: Entry['type']
  amountCents: number
}

interface LegacyV1State {
  schemaVersion?: number
  settings: { monthlyIncomeCents: number; weeklyHours: number; hoursPerWorkday: number } | null
  categories: AppState['categories']
  entries: LegacyV1Entry[]
  conversionUnit: 'hours' | 'workdays'
}

/** Migrates a v1 state (money in integer cents) to v2 (money in reais). */
export function migrateV1ToV2(legacy: LegacyV1State): AppState {
  return {
    schemaVersion: DEFAULT_SCHEMA_VERSION,
    settings: legacy.settings
      ? {
          monthlyIncome: roundMoney(legacy.settings.monthlyIncomeCents / 100),
          weeklyHours: legacy.settings.weeklyHours,
          hoursPerWorkday: legacy.settings.hoursPerWorkday,
        }
      : null,
    categories: legacy.categories ?? [],
    entries: (legacy.entries ?? []).map((entry): Entry => {
      const { amountCents, ...rest } = entry
      return { ...rest, amount: roundMoney(amountCents / 100) }
    }),
    conversionUnit: legacy.conversionUnit ?? 'hours',
  }
}

export class LocalStorageImpl implements Storage {
  lastLoadHadError = false

  load(): AppState | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as AppState
        if (!parsed.schemaVersion) {
          this.lastLoadHadError = true
          return createInitialState()
        }
        return parsed
      }

      const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY)
      if (legacyRaw) {
        const legacyParsed = JSON.parse(legacyRaw) as LegacyV1State
        const migrated = migrateV1ToV2(legacyParsed)
        this.save(migrated)
        return migrated
      }

      return null
    } catch {
      this.lastLoadHadError = true
      return createInitialState()
    }
  }

  save(state: AppState): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      // ignore write errors (e.g. quota exceeded)
    }
  }
}
