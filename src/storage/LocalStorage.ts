import type { AppState } from '../domain/types'
import { DEFAULT_SCHEMA_VERSION } from '../domain/types'
import type { Storage } from './Storage'
import { STORAGE_KEY } from './Storage'

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
    categories: SEED_CATEGORIES,
    entries: [],
    conversionUnit: 'hours',
  }
}

export class LocalStorageImpl implements Storage {
  lastLoadHadError = false

  load(): AppState | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return null
      const parsed = JSON.parse(raw) as AppState
      if (!parsed.schemaVersion) {
        this.lastLoadHadError = true
        return createInitialState()
      }
      return parsed
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
