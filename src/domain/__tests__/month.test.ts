import { getMonthKey, filterEntriesByMonth, sortEntriesByDate } from '../month'

test('getMonthKey extracts YYYY-MM', () => {
  expect(getMonthKey('2026-01-02')).toBe('2026-01')
  expect(getMonthKey('2026-12-31')).toBe('2026-12')
})

test('filterEntriesByMonth filters correctly', () => {
  const entries = [
    { date: '2026-01-15' },
    { date: '2026-02-01' },
    { date: '2026-01-02' },
  ]
  const result = filterEntriesByMonth(entries as any, 2026, 1)
  expect(result.length).toBe(2)
  expect(result.map((r) => r.date)).toEqual(['2026-01-15', '2026-01-02'])
})

test('sortEntriesByDate sorts ascending', () => {
  const entries = [
    { date: '2026-01-15', id: '3' },
    { date: '2026-01-02', id: '2' },
    { date: '2026-01-01', id: '1' },
  ]
  const result = sortEntriesByDate(entries as any)
  expect(result[0].id).toBe('1')
  expect(result[2].id).toBe('3')
})
