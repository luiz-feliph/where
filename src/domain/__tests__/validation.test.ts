import { validateSettings, validateEntry, validateCategoryName } from '../validation'

test('validateSettings validates rules', () => {
  expect(validateSettings({ monthlyIncomeCents: 0, weeklyHours: 20, hoursPerWorkday: 17 })).toContain('Monthly income must be greater than 0')
  expect(validateSettings({ monthlyIncomeCents: 150000, weeklyHours: 0, hoursPerWorkday: 17 })).toContain('Weekly hours must be between 1 and 168')
  expect(validateSettings({ monthlyIncomeCents: 150000, weeklyHours: 200, hoursPerWorkday: 17 })).toContain('Weekly hours must be between 1 and 168')
  expect(validateSettings({ monthlyIncomeCents: 150000, weeklyHours: 20, hoursPerWorkday: 0 })).toContain('Hours per workday must be between 1 and 24')
  expect(validateSettings({ monthlyIncomeCents: 150000, weeklyHours: 20, hoursPerWorkday: 25 })).toContain('Hours per workday must be between 1 and 24')
  expect(validateSettings({ monthlyIncomeCents: 150000, weeklyHours: 20, hoursPerWorkday: 17.5 })).toContain('Hours per workday must be between 1 and 24')
  expect(validateSettings({ monthlyIncomeCents: 150000, weeklyHours: 20, hoursPerWorkday: 17 })).toEqual([])
})

test('validateEntry validates fields', () => {
  expect(validateEntry({ description: '', amountCents: 100, date: '2026-01-01', categoryId: '1' })).toContain('Description is required')
  expect(validateEntry({ description: 'test', amountCents: 0, date: '2026-01-01', categoryId: '1' })).toContain('Price must be greater than 0')
  expect(validateEntry({ description: 'test', amountCents: 100, date: 'not-a-date', categoryId: '1' })).toContain('Valid date is required')
  expect(validateEntry({ description: 'test', amountCents: 100, date: '2026-01-01', categoryId: '' })).toContain('Category is required')
  expect(validateEntry({ description: 'test', amountCents: 100, date: '2026-01-01', categoryId: '1' })).toEqual([])
})

test('validateCategoryName handles uniqueness case-insensitive', () => {
  expect(validateCategoryName('', ['Other'])).toContain('Category name cannot be empty')
  expect(validateCategoryName('Other', ['Other'])).toContain('Category name already exists')
  expect(validateCategoryName('other', ['Other'])).toContain('Category name already exists')
  expect(validateCategoryName('New', ['Other'])).toEqual([])
})
