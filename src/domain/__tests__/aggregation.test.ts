import type { Entry, Category } from '../types'
import { aggregateByCategoryForMonth } from '../aggregation'

test('aggregateByCategoryForMonth aggregates expenses by category', () => {
  const categories: Category[] = [
    { id: '1', name: 'Food', color: '#ff0000' },
    { id: '2', name: 'Other', color: '#00ff00' },
  ]
  const entries: Entry[] = [
    { id: '1', date: '2026-01-05', description: 'A', categoryId: '1', amountCents: 10000, type: 'expense' },
    { id: '2', date: '2026-01-10', description: 'B', categoryId: '1', amountCents: 20000, type: 'expense' },
    { id: '3', date: '2026-01-15', description: 'C', categoryId: '2', amountCents: 30000, type: 'expense' },
    { id: '4', date: '2026-01-20', description: 'Inc', categoryId: '1', amountCents: 50000, type: 'income' },
  ]
  const settings = { monthlyIncomeCents: 150000, weeklyHours: 20, hoursPerWorkday: 17 }
  const result = aggregateByCategoryForMonth(entries, 2026, 1, categories, settings, 'hours')
  expect(result.totalExpensesCents).toBe(60000)
  expect(result.aggregates.length).toBe(2)
  const food = result.aggregates.find((a) => a.categoryId === '1')
  const other = result.aggregates.find((a) => a.categoryId === '2')
  expect(food).toBeDefined()
  expect(other).toBeDefined()
  expect(food!.amountCents).toBe(30000)
  expect(other!.amountCents).toBe(30000)
  expect(food!.percentage).toBe(50)
  expect(other!.percentage).toBe(50)
})

test('omits zero expenses and empty month', () => {
  const categories: Category[] = [{ id: '1', name: 'Food', color: '#ff0000' }]
  const entries: Entry[] = []
  const settings = { monthlyIncomeCents: 150000, weeklyHours: 20, hoursPerWorkday: 17 }
  const result = aggregateByCategoryForMonth(entries, 2026, 1, categories, settings, 'hours')
  expect(result.totalExpensesCents).toBe(0)
  expect(result.aggregates.length).toBe(0)
})

test('converts to selected unit', () => {
  const categories: Category[] = [{ id: '1', name: 'Food', color: '#ff0000' }]
  const entries: Entry[] = [
    { id: '1', date: '2026-01-05', description: 'A', categoryId: '1', amountCents: 37500, type: 'expense' },
  ]
  const settings = { monthlyIncomeCents: 150000, weeklyHours: 20, hoursPerWorkday: 17 }
  const hoursResult = aggregateByCategoryForMonth(entries, 2026, 1, categories, settings, 'hours')
  const daysResult = aggregateByCategoryForMonth(entries, 2026, 1, categories, settings, 'workdays')
  expect(hoursResult.aggregates[0].amountConverted).toBeCloseTo(21.6666667, 7)
  expect(daysResult.aggregates[0].amountConverted).toBeCloseTo(1.2745098, 7)
})
