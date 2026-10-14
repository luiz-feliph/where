export function getMonthKey(dateISO: string): string {
  return dateISO.slice(0, 7) // YYYY-MM
}

export function filterEntriesByMonth(entries: Array<{ date: string }>, year: number, month: number): Array<{ date: string }> {
  const monthStr = String(month).padStart(2, '0')
  const key = `${year}-${monthStr}`
  return entries.filter((e) => getMonthKey(e.date) === key)
}

export function sortEntriesByDate<T extends { date: string }>(entries: T[]): T[] {
  return [...entries].sort((a, b) => a.date.localeCompare(b.date))
}
