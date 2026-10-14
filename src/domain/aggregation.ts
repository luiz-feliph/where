import type { Entry } from './types'
import { expenseHours, expenseWorkdays } from './conversions'
import { getMonthKey } from './month'
import { roundMoney } from './formatting'

export interface CategoryAggregate {
  categoryId: string
  categoryName: string
  categoryColor: string
  amount: number
  amountConverted: number
  percentage: number
}

export function aggregateByCategoryForMonth(
  entries: Entry[],
  year: number,
  month: number,
  categories: Array<{ id: string; name: string; color: string }>,
  settings: { monthlyIncome: number; weeklyHours: number; hoursPerWorkday: number } | null,
  unit: 'hours' | 'workdays',
): { aggregates: CategoryAggregate[]; totalExpenses: number; totalExpensesConverted: number } {
  const monthStr = String(month).padStart(2, '0')
  const key = `${year}-${monthStr}`
  const expenseEntries = entries.filter((e) => getMonthKey(e.date) === key && e.type === 'expense')

  const totalExpenses = roundMoney(expenseEntries.reduce((sum, e) => sum + e.amount, 0))
  const categoryMap = new Map<string, { amount: number }>()

  for (const e of expenseEntries) {
    const existing = categoryMap.get(e.categoryId) || { amount: 0 }
    existing.amount += e.amount
    categoryMap.set(e.categoryId, existing)
  }

  const aggregates: CategoryAggregate[] = []
  for (const [categoryId, data] of categoryMap.entries()) {
    const cat = categories.find((c) => c.id === categoryId)
    if (!cat) continue
    const amount = roundMoney(data.amount)
    let amountConverted = 0
    if (settings) {
      amountConverted = unit === 'hours'
        ? expenseHours(amount, settings.weeklyHours, settings.monthlyIncome)
        : expenseWorkdays(amount, settings.weeklyHours, settings.monthlyIncome, settings.hoursPerWorkday)
    }
    const percentage = totalExpenses === 0 ? 0 : (amount / totalExpenses) * 100
    aggregates.push({
      categoryId: cat.id,
      categoryName: cat.name,
      categoryColor: cat.color,
      amount,
      amountConverted,
      percentage,
    })
  }

  aggregates.sort((a, b) => {
    if (b.amount !== a.amount) return b.amount - a.amount
    return a.categoryName.localeCompare(b.categoryName)
  })

  let totalExpensesConverted = 0
  if (settings) {
    totalExpensesConverted = unit === 'hours'
      ? expenseHours(totalExpenses, settings.weeklyHours, settings.monthlyIncome)
      : expenseWorkdays(totalExpenses, settings.weeklyHours, settings.monthlyIncome, settings.hoursPerWorkday)
  }

  return { aggregates, totalExpenses, totalExpensesConverted }
}
