import type { Entry, Category, Settings } from '../../../domain/types'
import { aggregateByCategoryForMonth } from '../../../domain/aggregation'
import { getMonthKey } from '../../../domain/month'
import { formatBRL, formatHours, formatWorkdays, roundMoney } from '../../../domain/formatting'
import { PieChart } from './PieChart'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation('common')
  const { aggregates, totalExpenses, totalExpensesConverted } = aggregateByCategoryForMonth(
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
  const totalIncome = monthEntries
    .filter((e) => e.type === 'income')
    .reduce((sum, e) => sum + e.amount, 0)
  const balance = roundMoney(totalIncome - totalExpenses)

  return (
    <section className="dashboard">
      <h2>{t('dashboard')}</h2>
      <div className="summary">
        <div className="summary-item">
          <span>{t('totalIncome')}</span>
          <strong>{formatBRL(totalIncome)}</strong>
        </div>
        <div className="summary-item">
          <span>{t('totalExpenses')}</span>
          <strong>{formatBRL(totalExpenses)}</strong>
        </div>
        <div className="summary-item">
          <span>{t('balance')}</span>
          <strong className={balance < 0 ? 'negative' : ''}>{formatBRL(balance)}</strong>
        </div>
        <div className="summary-item">
          <span>{t('expensesIn', { unit: unit === 'hours' ? t('hours').toLowerCase() : t('workdays').toLowerCase() })}</span>
          <strong>{formatConverted(totalExpensesConverted, unit)}</strong>
        </div>
      </div>

      {aggregates.length === 0 ? (
        <p className="empty">{t('noExpensesThisMonth')}</p>
      ) : (
        <div className="dashboard-body">
          <div className="table-scroll">
            <table className="category-table">
              <thead>
                <tr>
                <th scope="col">{t('category')}</th>
                <th scope="col">{t('amount')}</th>
                <th scope="col">{unit === 'hours' ? t('hours') : t('workdays')}</th>
                <th scope="col">{t('percentage')}</th>
                </tr>
              </thead>
              <tbody>
                {aggregates.map((a) => (
                  <tr key={a.categoryId}>
                    <td>
                      <span className="swatch" style={{ background: a.categoryColor }} aria-hidden="true" />
                      {a.categoryName}
                    </td>
                    <td className="num">{formatBRL(a.amount)}</td>
                    <td className="num">{formatConverted(a.amountConverted, unit)}</td>
                    <td className="num">{a.percentage.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <PieChart data={aggregates} />
        </div>
      )}
    </section>
  )
}
