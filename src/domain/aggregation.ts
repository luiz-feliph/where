import type { Entry } from './types'
import { expenseHours, expenseWorkdays } from './conversions'
import { getMonthKey } from './month'

export interface CategoryAggregate {
  categoryId: string
  categoryName: string
  categoryColor: string
  amountCents: number
  amountConverted: number
  percentage: number
}

export function aggregateByCategoryForMonth(
  entries: Entry[],
  year: number,
  month: number,
  categories: Array<{ id: string; name: string; color: string }>,
  settings: { monthlyIncomeCents: number; weeklyHours: number; hoursPerWorkday: number } | null,
  unit: 'hours' | 'workdays',
): { aggregates: CategoryAggregate[]; totalExpensesCents: number; totalExpensesConverted: number } {
  const monthStr = String(month).padStart(2, '0')
  const key = `${year}-${monthStr}`
  const expenseEntries = entries.filter((e) => getMonthKey(e.date) === key && e.type === 'expense')

  const totalExpensesCents = expenseEntries.reduce((sum, e) => sum + e.amountCents, 0)
  const categoryMap = new Map<string, { amountCents: number }>()

  for (const e of expenseEntries) {
    const existing = categoryMap.get(e.categoryId) || { amountCents: 0 }
    existing.amountCents += e.amountCents
    categoryMap.set(e.categoryId, existing)
  }

  const aggregates: CategoryAggregate[] = []
  for (const [categoryId, data] of categoryMap.entries()) {
    const cat = categories.find((c) => c.id === categoryId)
    if (!cat) continue
    const amountCents = data.amountCents
    let amountConverted = 0
    if (settings) {
      amountConverted = unit === 'hours'
        ? expenseHours(amountCents, settings.weeklyHours, settings.monthlyIncomeCents)
        : expenseWorkdays(amountCents, settings.weeklyHours, settings.monthlyIncomeCents, settings.hoursPerWorkday)
    }
    const percentage = totalExpensesCents === 0 ? 0 : (amountCents / totalExpensesCents) * 100
    aggregates.push({
      categoryId: cat.id,
      categoryName: cat.name,
      categoryColor: cat.color,
      amountCents,
      amountConverted,
      percentage,
    })
  }

  aggregates.sort((a, b) => {
    if (b.amountCents !== a.amountCents) return b.amountCents - a.amountCents
    return a.categoryName.localeCompare(b.categoryName)
  })

  let totalExpensesConverted = 0
  if (settings) {
    totalExpensesConverted = unit === 'hours'
      ? expenseHours(totalExpensesCents, settings.weeklyHours, settings.monthlyIncomeCents)
      : expenseWorkdays(totalExpensesCents, settings.weeklyHours, settings.monthlyIncomeCents, settings.hoursPerWorkday)
  }

  return { aggregates, totalExpensesCents, totalExpensesConverted }
}
