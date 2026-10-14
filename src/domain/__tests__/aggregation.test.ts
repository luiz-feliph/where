import type { Entry, Category } from '../types'
import { aggregateByCategoryForMonth } from '../aggregation'

test('aggregateByCategoryForMonth aggregates expenses by category', () => {
  const categories: Category[] = [
    { id: '1', name: 'Food', color: '#ff0000' },
    { id: '2', name: 'Other', color: '#00ff00' },
  ]
  const entries: Entry[] = [
    { id: '1', date: '2026-01-05', description: 'A', categoryId: '1', amount: 100, type: 'expense' },
    { id: '2', date: '2026-01-10', description: 'B', categoryId: '1', amount: 200, type: 'expense' },
    { id: '3', date: '2026-01-15', description: 'C', categoryId: '2', amount: 300, type: 'expense' },
    { id: '4', date: '2026-01-20', description: 'Inc', categoryId: '1', amount: 500, type: 'income' },
  ]
  const settings = { monthlyIncome: 1500, weeklyHours: 20, hoursPerWorkday: 17 }
  const result = aggregateByCategoryForMonth(entries, 2026, 1, categories, settings, 'hours')
  expect(result.totalExpenses).toBe(600)
  expect(result.aggregates.length).toBe(2)
  const food = result.aggregates.find((a) => a.categoryId === '1')
  const other = result.aggregates.find((a) => a.categoryId === '2')
  expect(food!.amount).toBe(300)
  expect(other!.amount).toBe(300)
  expect(food!.percentage).toBe(50)
  expect(other!.percentage).toBe(50)
})

test('omits zero expenses and empty month', () => {
  const categories: Category[] = [{ id: '1', name: 'Food', color: '#ff0000' }]
  const entries: Entry[] = []
  const settings = { monthlyIncome: 1500, weeklyHours: 20, hoursPerWorkday: 17 }
  const result = aggregateByCategoryForMonth(entries, 2026, 1, categories, settings, 'hours')
  expect(result.totalExpenses).toBe(0)
  expect(result.aggregates.length).toBe(0)
})

test('converts to selected unit', () => {
  const categories: Category[] = [{ id: '1', name: 'Food', color: '#ff0000' }]
  const entries: Entry[] = [
    { id: '1', date: '2026-01-05', description: 'A', categoryId: '1', amount: 375, type: 'expense' },
  ]
  const settings = { monthlyIncome: 1500, weeklyHours: 20, hoursPerWorkday: 17 }
  const hoursResult = aggregateByCategoryForMonth(entries, 2026, 1, categories, settings, 'hours')
  const daysResult = aggregateByCategoryForMonth(entries, 2026, 1, categories, settings, 'workdays')
  expect(hoursResult.aggregates[0].amountConverted).toBeCloseTo(20, 7)
  expect(daysResult.aggregates[0].amountConverted).toBeCloseTo(1.1764706, 7)
})
