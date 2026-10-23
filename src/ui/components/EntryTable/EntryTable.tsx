import type { Entry, Category, Settings } from '../../../domain/types'
import { expenseHours, expenseWorkdays } from '../../../domain/conversions'
import { formatBRL, formatHours, formatShortDate, formatWorkdays } from '../../../domain/formatting'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation('common')
  const conversionHeader = unit === 'hours' ? t('hours') : t('workdays')
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
    return <p className="empty">{t('noEntriesThisMonth')}</p>
  }

  return (
    <div className="table-scroll">
      <table className="entry-table">
        <thead>
          <tr>
            <th scope="col">{t('date')}</th>
            <th scope="col">{t('description')}</th>
            <th scope="col">{t('category')}</th>
            <th scope="col">{t('price')}</th>
            <th scope="col">{t('type')}</th>
            <th scope="col">{conversionHeader}</th>
            <th scope="col"><span className="sr-only">{t('actions')}</span></th>
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
                <td>{entry.type === 'income' ? t('income') : t('expense')}</td>
                <td className="num conversion">{conversionFor(entry)}</td>
                <td className="actions">
                  <button type="button" onClick={() => onEdit(entry)} aria-label={`${t('edit')} ${entry.description}`}>{t('edit')}</button>
                  <button type="button" onClick={() => onDelete(entry)} aria-label={`${t('delete')} ${entry.description}`}>{t('delete')}</button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
