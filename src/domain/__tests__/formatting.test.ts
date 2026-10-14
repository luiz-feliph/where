import { formatBRL, parseBRLStringToCents, formatHours, formatWorkdays, formatShortDate } from '../formatting'

test('formatBRL formats correctly', () => {
  expect(formatBRL(123456)).toBe('R$ 1,234.56')
  expect(formatBRL(100)).toBe('R$ 1.00')
  expect(formatBRL(0)).toBe('R$ 0.00')
})

test('parseBRLStringToCents parses price strings', () => {
  expect(parseBRLStringToCents('375.00')).toBe(37500)
  expect(parseBRLStringToCents('1,234.56')).toBe(123456)
  expect(parseBRLStringToCents('10')).toBe(1000)
})

test('formatHours and formatWorkdays', () => {
  expect(formatHours(21.6666667)).toBe('21.7 h')
  expect(formatHours(21.6666667, 2)).toBe('21.67 h')
  expect(formatWorkdays(1.2745098)).toBe('1.27 d')
})

test('formatShortDate derives correctly', () => {
  expect(formatShortDate('2026-01-02')).toBe('02, Fri')
  expect(formatShortDate('2026-01-01')).toBe('01, Thu')
})
