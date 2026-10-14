import type { AppState } from '../domain/types'

export interface Storage {
  load(): AppState | null
  save(state: AppState): void
  /** Set to true when the last load had to recover from corrupted data. */
  lastLoadHadError?: boolean
}

export const STORAGE_KEY = 'where:v1'
