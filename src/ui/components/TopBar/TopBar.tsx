import { useState } from 'react'
import { useApp } from '../../../state/context'
import whereLogo from '../../../assets/Where.svg'
import { useTranslation } from 'react-i18next'

const MONTH_KEYS = [
  'monthJanuary',
  'monthFebruary',
  'monthMarch',
  'monthApril',
  'monthMay',
  'monthJune',
  'monthJuly',
  'monthAugust',
  'monthSeptember',
  'monthOctober',
  'monthNovember',
  'monthDecember',
] as const

export function TopBar({
  year,
  month,
  onYearChange,
  onMonthChange,
  currentPage,
  onNavigate,
}: {
  year: number
  month: number
  onYearChange: (year: number) => void
  onMonthChange: (month: number) => void
  currentPage: 'dashboard' | 'categories' | 'settings'
  onNavigate: (page: 'dashboard' | 'categories' | 'settings') => void
}) {
  const { t } = useTranslation('common')
  const { state, dispatch } = useApp()
  const [years] = useState(() => {
    const currentYear = new Date().getFullYear()
    const list: number[] = []
    for (let y = currentYear - 5; y <= currentYear + 5; y++) list.push(y)
    return list
  })

  const unit = state.conversionUnit
  return (
    <header className="topbar">
      <img src={whereLogo} alt={t('appName')} className="logo" />
      <div className="topbar-controls">
        <label className="sr-only" htmlFor="month-select">{t('month')}</label>
        <select id="month-select" aria-label={t('month')} value={month} onChange={(e) => onMonthChange(Number(e.target.value))}>
          {MONTH_KEYS.map((key, i) => (
            <option key={key} value={i + 1}>{t(key)}</option>
          ))}
        </select>
        <label className="sr-only" htmlFor="year-select">{t('year')}</label>
        <select id="year-select" aria-label={t('year')} value={year} onChange={(e) => onYearChange(Number(e.target.value))}>
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
        <button
          type="button"
          className="btn toggle-unit"
          aria-pressed={unit === 'workdays'}
          onClick={() =>
            dispatch({ type: 'SET_CONVERSION_UNIT', payload: unit === 'hours' ? 'workdays' : 'hours' })
          }
        >
          {unit === 'hours' ? t('hours') : t('workdays')}
        </button>
        <nav className="nav">
          <button type="button" className={currentPage === 'dashboard' ? 'active' : ''} onClick={() => onNavigate('dashboard')}>
            {t('dashboard')}
          </button>
          <button type="button" className={currentPage === 'categories' ? 'active' : ''} onClick={() => onNavigate('categories')}>
            {t('categories')}
          </button>
          <button type="button" className={currentPage === 'settings' ? 'active' : ''} onClick={() => onNavigate('settings')}>
            {t('settings')}
          </button>
        </nav>
      </div>
    </header>
  )
}
