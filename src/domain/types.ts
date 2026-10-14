export type TransactionType = 'income' | 'expense'

export interface Settings {
  monthlyIncomeCents: number
  weeklyHours: number
  hoursPerWorkday: number
}

export interface Category {
  id: string
  name: string
  color: string
}

export interface Entry {
  id: string
  date: string // ISO YYYY-MM-DD
  description: string
  categoryId: string
  amountCents: number
  type: TransactionType
}

export interface AppState {
  schemaVersion: number
  settings: Settings | null
  categories: Category[]
  entries: Entry[]
  conversionUnit: 'hours' | 'workdays'
}

export const DEFAULT_SCHEMA_VERSION = 1
