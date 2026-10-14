import { describe, it, expect, beforeEach } from 'vitest'
import { LocalStorageImpl, createInitialState } from '../LocalStorage'
import { STORAGE_KEY, LEGACY_STORAGE_KEY } from '../Storage'

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
    state.settings = { monthlyIncome: 1500, weeklyHours: 20, hoursPerWorkday: 17 }
    storage.save(state)
    const loaded = storage.load()
    expect(loaded).toEqual(state)
  })

  it('handles corrupted JSON by returning initial state', () => {
    localStorage.setItem(STORAGE_KEY, '{ invalid json')
    const storage = new LocalStorageImpl()
    const loaded = storage.load()
    expect(storage.lastLoadHadError).toBe(true)
    expect(loaded!.schemaVersion).toBe(2)
    expect(loaded!.entries).toEqual([])
  })

  it('migrates legacy v1 (cents) data to v2 (reais)', () => {
    const legacy = {
      schemaVersion: 1,
      settings: { monthlyIncomeCents: 150000, weeklyHours: 20, hoursPerWorkday: 17 },
      categories: [{ id: 'c1', name: 'Food', color: '#FF6B6B' }],
      entries: [
        { id: 'e1', date: '2026-01-02', description: 'Lunch', categoryId: 'c1', amountCents: 37500, type: 'expense' },
      ],
      conversionUnit: 'hours',
    }
    localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(legacy))
    const storage = new LocalStorageImpl()
    const loaded = storage.load()
    expect(loaded!.schemaVersion).toBe(2)
    expect(loaded!.settings).toEqual({ monthlyIncome: 1500, weeklyHours: 20, hoursPerWorkday: 17 })
    expect(loaded!.entries[0].amount).toBe(375)
    expect((loaded!.entries[0] as unknown as { amountCents?: number }).amountCents).toBeUndefined()
    expect(localStorage.getItem(STORAGE_KEY)).not.toBeNull()
  })
})
