const BRL_FORMATTER = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

/** Rounds a money amount (in reais) to 2 decimal places to avoid float artifacts. */
export function roundMoney(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100
}

export function formatBRL(value: number): string {
  return BRL_FORMATTER.format(value)
}

export function parseBRLToReais(value: string): number {
  if (!value) return 0
  const cleaned = value.replace(/\s/g, '')
  if (cleaned === '') return 0
  // Remove currency symbol if present
  const withoutSymbol = cleaned.replace(/R\$/i, '')
  // Brazilian format uses . as thousand separator and , as decimal separator
  const noThousands = withoutSymbol.replace(/\./g, '')
  const normalized = noThousands.replace(/,/g, '.')
  const parsed = parseFloat(normalized)
  if (Number.isNaN(parsed)) return 0
  return roundMoney(parsed)
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
  const weekday = date.toLocaleDateString('pt-BR', { weekday: 'short', timeZone: 'UTC' })
  return `${dayOfMonth}, ${weekday}`
}
