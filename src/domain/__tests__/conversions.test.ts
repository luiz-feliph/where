import { workedHoursPerMonth, hourlyRate, expenseHours, expenseWorkdays } from '../conversions'

test('workedHoursPerMonth computes correctly', () => {
  expect(workedHoursPerMonth(20)).toBeCloseTo(86.6666667, 7)
})

test('hourlyRate computes for example', () => {
  // income 1500, 20h/week, workday 17h -> hourly rate ~17.31
  expect(hourlyRate(150000, 20)).toBeCloseTo(17.3076923, 7)
})

test('expenseHours computes', () => {
  // 375 expense -> ~21.67h
  expect(expenseHours(37500, 20, 150000)).toBeCloseTo(21.6666667, 7)
})

test('expenseWorkdays computes', () => {
  // ~21.67h / 17h = ~1.27 workdays
  expect(expenseWorkdays(37500, 20, 150000, 17)).toBeCloseTo(1.2745098, 7)
})

test('handles edge cases', () => {
  expect(hourlyRate(0, 20)).toBe(0)
  expect(hourlyRate(150000, 0)).toBe(0)
  expect(expenseHours(0, 20, 150000)).toBe(0)
  expect(expenseWorkdays(37500, 20, 150000, 0)).toBe(0)
})

test('workday boundaries', () => {
  const expHours = expenseHours(17000, 20, 150000) // 170 reais -> ~9.82h
  expect(expenseWorkdays(17000, 20, 150000, 1)).toBeCloseTo(expHours, 7)
  expect(expenseWorkdays(17000, 20, 150000, 24)).toBeCloseTo(expHours / 24, 7)
})
