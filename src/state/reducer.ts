import type { AppState, Category, Entry, Settings } from '../domain/types'
import { DEFAULT_SCHEMA_VERSION } from '../domain/types'
import { validateCategoryName, validateEntry, validateSettings } from '../domain/validation'

export type Action =
  | { type: 'SET_SETTINGS'; payload: Settings }
  | { type: 'ADD_ENTRY'; payload: Entry }
  | { type: 'UPDATE_ENTRY'; payload: Entry }
  | { type: 'DELETE_ENTRY'; payload: { id: string } }
  | { type: 'ADD_CATEGORY'; payload: Category }
  | { type: 'UPDATE_CATEGORY'; payload: Category }
  | { type: 'DELETE_CATEGORY'; payload: { id: string; reassignToId?: string } }
  | { type: 'SET_CONVERSION_UNIT'; payload: 'hours' | 'workdays' }
  | { type: 'HYDRATE'; payload: AppState }

const CATEGORY_PALETTE = [
  '#FF6B6B',
  '#4ECDC4',
  '#45B7D1',
  '#FFA07A',
  '#98D8C8',
  '#F06292',
  '#64B5F6',
  '#FFD700',
  '#FFB6C1',
  '#D2691E',
]

function getNextColor(categories: Category[]): string {
  const used = new Set(categories.map((c) => c.color))
  for (const color of CATEGORY_PALETTE) {
    if (!used.has(color)) return color
  }
  return CATEGORY_PALETTE[categories.length % CATEGORY_PALETTE.length] || '#808080'
}

export function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_SETTINGS': {
      const errors = validateSettings(action.payload)
      if (errors.length > 0) {
        return state
      }
      return { ...state, settings: action.payload }
    }
    case 'ADD_ENTRY': {
      const errors = validateEntry({
        description: action.payload.description,
        amountCents: action.payload.amountCents,
        date: action.payload.date,
        categoryId: action.payload.categoryId,
      })
      if (errors.length > 0) {
        return state
      }
      return { ...state, entries: [...state.entries, action.payload] }
    }
    case 'UPDATE_ENTRY': {
      const errors = validateEntry({
        description: action.payload.description,
        amountCents: action.payload.amountCents,
        date: action.payload.date,
        categoryId: action.payload.categoryId,
      })
      if (errors.length > 0) {
        return state
      }
      return {
        ...state,
        entries: state.entries.map((e) => (e.id === action.payload.id ? action.payload : e)),
      }
    }
    case 'DELETE_ENTRY': {
      return {
        ...state,
        entries: state.entries.filter((e) => e.id !== action.payload.id),
      }
    }
    case 'ADD_CATEGORY': {
      const existingNames = state.categories.map((c) => c.name)
      const errors = validateCategoryName(action.payload.name, existingNames)
      if (errors.length > 0) {
        return state
      }
      const category: Category = {
        ...action.payload,
        color: action.payload.color || getNextColor(state.categories),
      }
      return { ...state, categories: [...state.categories, category] }
    }
    case 'UPDATE_CATEGORY': {
      const existingNames = state.categories.filter((c) => c.id !== action.payload.id).map((c) => c.name)
      const errors = validateCategoryName(action.payload.name, existingNames)
      if (errors.length > 0) {
        return state
      }
      return {
        ...state,
        categories: state.categories.map((c) => (c.id === action.payload.id ? action.payload : c)),
      }
    }
    case 'DELETE_CATEGORY': {
      if (state.categories.length <= 1) {
        return state
      }
      const { id, reassignToId } = action.payload
      const targetExists = reassignToId && state.categories.some((c) => c.id === reassignToId)
      if (!targetExists) {
        return state
      }
      return {
        ...state,
        categories: state.categories.filter((c) => c.id !== id),
        entries: state.entries.map((e) => (e.categoryId === id ? { ...e, categoryId: reassignToId } : e)),
      }
    }
    case 'SET_CONVERSION_UNIT': {
      return { ...state, conversionUnit: action.payload }
    }
    case 'HYDRATE': {
      return action.payload
    }
    default:
      return state
  }
}
