import { describe, it, expect } from 'vitest'
import { appReducer } from '../reducer'
import { createInitialState } from '../../storage/LocalStorage'
import type { Entry, Category, Settings } from '../../domain/types'

describe('reducer', () => {
  it('sets settings when valid', () => {
    const state = createInitialState()
    const settings: Settings = { monthlyIncome: 1500, weeklyHours: 20, hoursPerWorkday: 17 }
    const next = appReducer(state, { type: 'SET_SETTINGS', payload: settings })
    expect(next.settings).toEqual(settings)
  })

  it('does not set settings when invalid', () => {
    const state = createInitialState()
    const settings: Settings = { monthlyIncome: 0, weeklyHours: 20, hoursPerWorkday: 17 }
    const next = appReducer(state, { type: 'SET_SETTINGS', payload: settings })
    expect(next.settings).toBeNull()
  })

  it('adds entry when valid', () => {
    const state = createInitialState()
    const cat = state.categories[0]
    const entry: Entry = {
      id: '1',
      date: '2026-01-02',
      description: 'Test',
      categoryId: cat.id,
      amount: 10,
      type: 'expense',
    }
    const next = appReducer(state, { type: 'ADD_ENTRY', payload: entry })
    expect(next.entries.length).toBe(1)
  })

  it('updates and deletes entry', () => {
    const state = createInitialState()
    const cat = state.categories[0]
    let next = appReducer(state, {
      type: 'ADD_ENTRY',
      payload: { id: '1', date: '2026-01-02', description: 'Test', categoryId: cat.id, amount: 10, type: 'expense' },
    })
    next = appReducer(next, {
      type: 'UPDATE_ENTRY',
      payload: { id: '1', date: '2026-01-03', description: 'Test2', categoryId: cat.id, amount: 20, type: 'expense' },
    })
    expect(next.entries[0].amount).toBe(20)
    next = appReducer(next, { type: 'DELETE_ENTRY', payload: { id: '1' } })
    expect(next.entries.length).toBe(0)
  })

  it('adds category with auto color when color not provided', () => {
    const state = createInitialState()
    const cat: Category = { id: 'new', name: 'Transport', color: '' as any }
    const next = appReducer(state, { type: 'ADD_CATEGORY', payload: cat })
    expect(next.categories.some((c) => c.name === 'Transport')).toBe(true)
    const added = next.categories.find((c) => c.name === 'Transport')
    expect(added?.color).toBeTruthy()
  })

  it('prevents duplicate category names case-insensitively', () => {
    const state = createInitialState()
    const next = appReducer(state, { type: 'ADD_CATEGORY', payload: { id: 'x', name: 'other', color: '#123' } })
    expect(next.categories.length).toBe(state.categories.length)
  })

  it('deletes category in use by reassigning entries', () => {
    let state = createInitialState()
    const other = state.categories.find((c) => c.name === 'Other')!
    const personal = state.categories.find((c) => c.name === 'Personal')!
    state = appReducer(state, {
      type: 'ADD_ENTRY',
      payload: { id: '1', date: '2026-01-02', description: 'T', categoryId: other.id, amount: 10, type: 'expense' },
    })
    const next = appReducer(state, { type: 'DELETE_CATEGORY', payload: { id: other.id, reassignToId: personal.id } })
    expect(next.categories.some((c) => c.id === other.id)).toBe(false)
    expect(next.entries[0].categoryId).toBe(personal.id)
  })

  it('prevents deleting last category', () => {
    let state = createInitialState()
    const c1 = state.categories[0]
    const c2 = state.categories[1]
    state = appReducer(state, { type: 'DELETE_CATEGORY', payload: { id: c1.id, reassignToId: c2.id } })
    state = appReducer(state, { type: 'DELETE_CATEGORY', payload: { id: c2.id, reassignToId: state.categories[0]?.id } })
    expect(state.categories.length).toBeGreaterThanOrEqual(1)
  })
})

describe('reducer extra branches', () => {
  it('ignores invalid entry updates and category creates', () => {
    const state = createInitialState()
    const cat = state.categories[0]
    const next = appReducer(state, {
      type: 'UPDATE_ENTRY',
      payload: { id: 'x', date: '2026-01-02', description: '', categoryId: cat.id, amount: 1, type: 'expense' },
    })
    expect(next).toBe(state)
    const next2 = appReducer(state, { type: 'ADD_CATEGORY', payload: { id: 'x', name: '  ', color: '#fff' } })
    expect(next2).toBe(state)
  })

  it('ignores duplicate category rename', () => {
    const state = createInitialState()
    const other = state.categories.find((c) => c.name === 'Other')!
    const next = appReducer(state, { type: 'UPDATE_CATEGORY', payload: { ...other, name: 'Personal' } })
    expect(next).toBe(state)
  })

  it('ignores delete when category count would drop below one', () => {
    const state = { ...createInitialState(), categories: [createInitialState().categories[0]] }
    const next = appReducer(state, { type: 'DELETE_CATEGORY', payload: { id: state.categories[0].id, reassignToId: 'nope' } })
    expect(next).toBe(state)
  })

  it('ignores delete when reassign target does not exist', () => {
    const state = createInitialState()
    const next = appReducer(state, { type: 'DELETE_CATEGORY', payload: { id: state.categories[0].id, reassignToId: 'nope' } })
    expect(next).toBe(state)
  })

  it('keeps provided color when adding category', () => {
    const state = createInitialState()
    const next = appReducer(state, { type: 'ADD_CATEGORY', payload: { id: 'x', name: 'Gym', color: '#000000' } })
    expect(next.categories.find((c) => c.name === 'Gym')?.color).toBe('#000000')
  })

  it('updates conversion unit and hydrates', () => {
    const state = createInitialState()
    const next = appReducer(state, { type: 'SET_CONVERSION_UNIT', payload: 'workdays' })
    expect(next.conversionUnit).toBe('workdays')
    const hydrated = appReducer(state, { type: 'HYDRATE', payload: { ...state, conversionUnit: 'workdays' } })
    expect(hydrated.conversionUnit).toBe('workdays')
  })
})

describe('reducer remaining branches', () => {
  it('ignores invalid new entries', () => {
    const state = createInitialState()
    const next = appReducer(state, {
      type: 'ADD_ENTRY',
      payload: { id: 'x', date: '2026-01-02', description: '', categoryId: state.categories[0].id, amount: 0, type: 'expense' },
    })
    expect(next).toBe(state)
  })

  it('renames a category when valid', () => {
    const state = createInitialState()
    const cat = state.categories[0]
    const next = appReducer(state, { type: 'UPDATE_CATEGORY', payload: { ...cat, name: 'Renamed' } })
    expect(next.categories.some((c) => c.name === 'Renamed')).toBe(true)
  })

  it('falls back to a palette color when all are used', () => {
    const palette = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F06292', '#64B5F6', '#FFD700', '#FFB6C1', '#D2691E']
    const state = createInitialState()
    state.categories = palette.map((color, i) => ({ id: `c${i}`, name: `C${i}`, color }))
    const next = appReducer(state, { type: 'ADD_CATEGORY', payload: { id: 'new', name: 'Extra', color: '' as unknown as string } })
    expect(next.categories.find((c) => c.name === 'Extra')?.color).toBeTruthy()
  })

  it('returns state for unknown action', () => {
    const state = createInitialState()
    const next = appReducer(state, { type: 'UNKNOWN' } as never)
    expect(next).toBe(state)
  })
})
