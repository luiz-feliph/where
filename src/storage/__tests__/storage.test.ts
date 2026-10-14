import { describe, it, expect, beforeEach } from 'vitest'
import { LocalStorageImpl, createInitialState } from '../LocalStorage'
import { STORAGE_KEY } from '../Storage'

describe('LocalStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns null if nothing stored', () => {
    const storage = new LocalStorageImpl()
    expect(storage.load()).toBeNull()
  })

  it('saves and loads state', () => {
    const storage = new LocalStorageImpl()
    const state = createInitialState()
    state.settings = { monthlyIncomeCents: 150000, weeklyHours: 20, hoursPerWorkday: 17 }
    storage.save(state)
    const loaded = storage.load()
    expect(loaded).toEqual(state)
  })

  it('handles corrupted JSON by returning initial state', () => {
    localStorage.setItem(STORAGE_KEY, '{ invalid json')
    const storage = new LocalStorageImpl()
    const loaded = storage.load()
    expect(loaded).not.toBeNull()
    expect(loaded?.schemaVersion).toBe(1)
  })
})
