import type { AppState, Entry } from '../domain/types'
import { expenseHours, expenseWorkdays } from '../domain/conversions'
import { getMonthKey } from '../domain/month'

export interface SheetRow {
  date: string
  description: string
  category: string
  price: number
  transactionType: string
  hours: number
  workdays: number
}

export interface MonthSheet {
  sheetName: string
  rows: SheetRow[]
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export function buildMonthSheets(state: AppState): MonthSheet[] {
  const byMonth = new Map<string, Entry[]>()
  for (const entry of state.entries) {
    const key = getMonthKey(entry.date)
    const list = byMonth.get(key) ?? []
    list.push(entry)
    byMonth.set(key, list)
  }

  const sheets: MonthSheet[] = []
  const sortedKeys = [...byMonth.keys()].sort()
  for (const key of sortedKeys) {
    const [, monthStr] = key.split('-')
    const monthIndex = Number(monthStr) - 1
    const sheetName = `${key} ${MONTH_NAMES[monthIndex]}`
    const entries = [...(byMonth.get(key) ?? [])].sort((a, b) => a.date.localeCompare(b.date))
    const rows: SheetRow[] = entries.map((entry) => {
      const category = state.categories.find((c) => c.id === entry.categoryId)?.name ?? ''
      let hours = 0
      let workdays = 0
      if (entry.type === 'expense' && state.settings) {
        hours = expenseHours(entry.amount, state.settings.weeklyHours, state.settings.monthlyIncome)
        workdays = expenseWorkdays(
          entry.amount,
          state.settings.weeklyHours,
          state.settings.monthlyIncome,
          state.settings.hoursPerWorkday,
        )
      }
      return {
        date: entry.date,
        description: entry.description,
        category,
        price: entry.amount,
        transactionType: entry.type === 'income' ? 'Income' : 'Expense',
        hours,
        workdays,
      }
    })
    sheets.push({ sheetName, rows })
  }
  return sheets
}
