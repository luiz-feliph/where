import type { Entry, Category, Settings } from '../../../domain/types'
import { aggregateByCategoryForMonth } from '../../../domain/aggregation'
import { getMonthKey } from '../../../domain/month'
import { formatBRL, formatHours, formatWorkdays } from '../../../domain/formatting'
import { PieChart } from './PieChart'

function formatConverted(value: number, unit: 'hours' | 'workdays'): string {
  return unit === 'hours' ? formatHours(value) : formatWorkdays(value)
}

export function Dashboard({
  entries,
  categories,
  settings,
  year,
  month,
  unit,
}: {
  entries: Entry[]
  categories: Category[]
  settings: Settings | null
  year: number
  month: number
  unit: 'hours' | 'workdays'
}) {
  const { aggregates, totalExpensesCents, totalExpensesConverted } = aggregateByCategoryForMonth(
    entries,
    year,
    month,
    categories,
    settings,
    unit,
  )

  const monthStr = String(month).padStart(2, '0')
  const key = `${year}-${monthStr}`
  const monthEntries = entries.filter((e) => getMonthKey(e.date) === key)
  const totalIncomeCents = monthEntries
    .filter((e) => e.type === 'income')
    .reduce((sum, e) => sum + e.amountCents, 0)
  const balanceCents = totalIncomeCents - totalExpensesCents

  return (
    <section className="dashboard">
      <h2>Dashboard</h2>
      <div className="summary">
        <div className="summary-item">
          <span>Total income</span>
          <strong>{formatBRL(totalIncomeCents)}</strong>
        </div>
        <div className="summary-item">
          <span>Total expenses</span>
          <strong>{formatBRL(totalExpensesCents)}</strong>
        </div>
        <div className="summary-item">
          <span>Balance</span>
          <strong className={balanceCents < 0 ? 'negative' : ''}>{formatBRL(balanceCents)}</strong>
        </div>
        <div className="summary-item">
          <span>Expenses in {unit}</span>
          <strong>{formatConverted(totalExpensesConverted, unit)}</strong>
        </div>
      </div>

      {aggregates.length === 0 ? (
        <p className="empty">No expenses this month.</p>
      ) : (
        <div className="dashboard-body">
          <table className="category-table">
            <thead>
              <tr>
                <th scope="col">Category</th>
                <th scope="col">Amount</th>
                <th scope="col">{unit === 'hours' ? 'Hours' : 'Workdays'}</th>
                <th scope="col">%</th>
              </tr>
            </thead>
            <tbody>
              {aggregates.map((a) => (
                <tr key={a.categoryId}>
                  <td>
                    <span className="swatch" style={{ background: a.categoryColor }} aria-hidden="true" />
                    {a.categoryName}
                  </td>
                  <td className="num">{formatBRL(a.amountCents)}</td>
                  <td className="num">{formatConverted(a.amountConverted, unit)}</td>
                  <td className="num">{a.percentage.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
          <PieChart data={aggregates} />
        </div>
      )}
    </section>
  )
}
