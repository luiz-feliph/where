import { validateSettings, validateEntry, validateCategoryName } from '../validation'

test('validateSettings validates rules', () => {
  expect(validateSettings({ monthlyIncome: 0, weeklyHours: 20, hoursPerWorkday: 17 })).toContain('validation:monthlyIncomeGreaterThanZero')
  expect(validateSettings({ monthlyIncome: 1500, weeklyHours: 0, hoursPerWorkday: 17 })).toContain('validation:weeklyHoursRange')
  expect(validateSettings({ monthlyIncome: 1500, weeklyHours: 200, hoursPerWorkday: 17 })).toContain('validation:weeklyHoursRange')
  expect(validateSettings({ monthlyIncome: 1500, weeklyHours: 20, hoursPerWorkday: 0 })).toContain('validation:hoursPerWorkdayRange')
  expect(validateSettings({ monthlyIncome: 1500, weeklyHours: 20, hoursPerWorkday: 25 })).toContain('validation:hoursPerWorkdayRange')
  expect(validateSettings({ monthlyIncome: 1500, weeklyHours: 20, hoursPerWorkday: 17.5 })).toContain('validation:hoursPerWorkdayRange')
  expect(validateSettings({ monthlyIncome: 1500, weeklyHours: 20, hoursPerWorkday: 17 })).toEqual([])
})

test('validateEntry validates fields', () => {
  expect(validateEntry({ description: '', amount: 1, date: '2026-01-01', categoryId: '1' })).toContain('validation:descriptionRequired')
  expect(validateEntry({ description: 'test', amount: 0, date: '2026-01-01', categoryId: '1' })).toContain('validation:priceGreaterThanZero')
  expect(validateEntry({ description: 'test', amount: 1, date: 'not-a-date', categoryId: '1' })).toContain('validation:validDateRequired')
  expect(validateEntry({ description: 'test', amount: 1, date: '2026-01-01', categoryId: '' })).toContain('validation:categoryRequired')
  expect(validateEntry({ description: 'test', amount: 1, date: '2026-01-01', categoryId: '1' })).toEqual([])
})

test('validateCategoryName handles uniqueness case-insensitive', () => {
  expect(validateCategoryName('', ['Other'])).toContain('validation:categoryNameEmpty')
  expect(validateCategoryName('Other', ['Other'])).toContain('validation:categoryNameExists')
  expect(validateCategoryName('other', ['Other'])).toContain('validation:categoryNameExists')
  expect(validateCategoryName('New', ['Other'])).toEqual([])
})
