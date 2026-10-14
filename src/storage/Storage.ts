import type { AppState } from '../domain/types'

export interface Storage {
  load(): AppState | null
  save(state: AppState): void
}

export const STORAGE_KEY = 'where:v1'
