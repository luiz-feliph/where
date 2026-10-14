import { formatBRL, parseBRLToReais, formatHours, formatWorkdays, formatShortDate } from '../formatting'

test('formatBRL formats reais', () => {
  expect(formatBRL(1234.56)).toBe('R$ 1,234.56')
  expect(formatBRL(1)).toBe('R$ 1.00')
  expect(formatBRL(0)).toBe('R$ 0.00')
})

test('parseBRLToReais parses price strings', () => {
  expect(parseBRLToReais('375.00')).toBe(375)
  expect(parseBRLToReais('1,234.56')).toBe(1234.56)
  expect(parseBRLToReais('10')).toBe(10)
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
