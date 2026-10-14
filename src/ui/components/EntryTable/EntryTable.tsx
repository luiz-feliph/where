import type { Entry, Category, Settings } from '../../../domain/types'
import { expenseHours, expenseWorkdays } from '../../../domain/conversions'
import { formatBRL, formatHours, formatShortDate, formatWorkdays } from '../../../domain/formatting'

export function EntryTable({
  entries,
  categories,
  settings,
  unit,
  onEdit,
  onDelete,
}: {
  entries: Entry[]
  categories: Category[]
  settings: Settings | null
  unit: 'hours' | 'workdays'
  onEdit: (entry: Entry) => void
  onDelete: (entry: Entry) => void
}) {
  const conversionHeader = unit === 'hours' ? 'Hours' : 'Workdays'
  const categoryById = new Map(categories.map((c) => [c.id, c]))

  function conversionFor(entry: Entry): string {
    if (entry.type !== 'expense' || !settings) return '—'
    if (unit === 'hours') {
      return formatHours(expenseHours(entry.amount, settings.weeklyHours, settings.monthlyIncome))
    }
    return formatWorkdays(
      expenseWorkdays(entry.amount, settings.weeklyHours, settings.monthlyIncome, settings.hoursPerWorkday),
    )
  }

  if (entries.length === 0) {
    return <p className="empty">No entries for this month.</p>
  }

  return (
    <div className="table-scroll">
      <table className="entry-table">
        <thead>
          <tr>
            <th scope="col">Date</th>
            <th scope="col">Description</th>
            <th scope="col">Category</th>
            <th scope="col">Price</th>
            <th scope="col">Type</th>
            <th scope="col">{conversionHeader}</th>
            <th scope="col"><span className="sr-only">Actions</span></th>
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => {
            const cat = categoryById.get(entry.categoryId)
            return (
              <tr key={entry.id}>
                <td className="tabular">{formatShortDate(entry.date)}</td>
                <td>{entry.description}</td>
                <td>
                  {cat && (
                    <span className="category-tag">
                      <span className="dot" style={{ backgroundColor: cat.color }} aria-hidden="true" />
                      {cat.name}
                    </span>
                  )}
                </td>
                <td className={entry.type === 'expense' ? 'num expense' : 'num income'}>{formatBRL(entry.amount)}</td>
                <td>{entry.type === 'income' ? 'Income' : 'Expense'}</td>
                <td className="num conversion">{conversionFor(entry)}</td>
                <td className="actions">
                  <button type="button" onClick={() => onEdit(entry)} aria-label={`Edit ${entry.description}`}>Edit</button>
                  <button type="button" onClick={() => onDelete(entry)} aria-label={`Delete ${entry.description}`}>Delete</button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
