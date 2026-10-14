const BRL_FORMATTER = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export function formatBRL(cents: number): string {
  const formatted = BRL_FORMATTER.format(cents / 100)
  // Ensure space after R$ as in example "R$ 1,234.56"
  return formatted.replace('R$', 'R$ ')
}

export function parseBRLStringToCents(value: string): number {
  if (!value) return 0
  const cleaned = value.replace(/[^0-9.,]/g, '').trim()
  if (cleaned === '') return 0
  const noThousands = cleaned.replace(/,/g, '')
  const cents = Math.round(parseFloat(noThousands) * 100)
  if (Number.isNaN(cents)) return 0
  return cents
}

export function formatHours(hours: number, decimals = 1): string {
  return `${hours.toFixed(decimals)} h`
}

export function formatWorkdays(workdays: number, decimals = 2): string {
  return `${workdays.toFixed(decimals)} d`
}

export function formatShortDate(dateISO: string): string {
  const [year, month, day] = dateISO.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  const dayOfMonth = String(date.getUTCDate()).padStart(2, '0')
  const weekday = date.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' })
  return `${dayOfMonth}, ${weekday}`
}
