import { workedHoursPerMonth, hourlyRate, expenseHours, expenseWorkdays } from '../conversions'

test('workedHoursPerMonth computes correctly', () => {
  expect(workedHoursPerMonth(20)).toBeCloseTo(80, 7)
})

test('hourlyRate computes for example', () => {
  expect(hourlyRate(1500, 20)).toBeCloseTo(18.75, 7)
})

test('expenseHours computes', () => {
  expect(expenseHours(3750, 20, 1500)).toBeCloseTo(200, 7)
})

test('expenseWorkdays computes', () => {
  expect(expenseWorkdays(3750, 20, 1500, 17)).toBeCloseTo(11.7647059, 7)
})

test('handles edge cases', () => {
  expect(hourlyRate(0, 20)).toBe(0)
  expect(hourlyRate(1500, 0)).toBe(0)
  expect(expenseHours(0, 20, 1500)).toBe(0)
  expect(expenseWorkdays(3750, 20, 1500, 0)).toBe(0)
})

test('workday boundaries', () => {
  const expHours = expenseHours(170, 20, 1500)
  expect(expenseWorkdays(170, 20, 1500, 1)).toBeCloseTo(expHours, 7)
  expect(expenseWorkdays(170, 20, 1500, 24)).toBeCloseTo(expHours / 24, 7)
})

