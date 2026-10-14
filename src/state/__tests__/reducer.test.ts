import { describe, it, expect } from 'vitest'
import { appReducer } from '../reducer'
import { createInitialState } from '../../storage/LocalStorage'
import type { Entry, Category, Settings } from '../../domain/types'

describe('reducer', () => {
  it('sets settings when valid', () => {
    const state = createInitialState()
    const settings: Settings = { monthlyIncomeCents: 150000, weeklyHours: 20, hoursPerWorkday: 17 }
    const next = appReducer(state, { type: 'SET_SETTINGS', payload: settings })
    expect(next.settings).toEqual(settings)
  })

  it('does not set settings when invalid', () => {
    const state = createInitialState()
    const settings: Settings = { monthlyIncomeCents: 0, weeklyHours: 20, hoursPerWorkday: 17 }
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
      amountCents: 1000,
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
      payload: { id: '1', date: '2026-01-02', description: 'Test', categoryId: cat.id, amountCents: 1000, type: 'expense' },
    })
    next = appReducer(next, {
      type: 'UPDATE_ENTRY',
      payload: { id: '1', date: '2026-01-03', description: 'Test2', categoryId: cat.id, amountCents: 2000, type: 'expense' },
    })
    expect(next.entries[0].amountCents).toBe(2000)
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
      payload: { id: '1', date: '2026-01-02', description: 'T', categoryId: other.id, amountCents: 1000, type: 'expense' },
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
