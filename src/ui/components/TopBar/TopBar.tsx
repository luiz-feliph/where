import { useState } from 'react'
import { useApp } from '../../../state/context'
import whereLogo from '../../../assets/Where.svg'

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

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
      <img src={whereLogo} alt="Where" className="logo" />
      <div className="topbar-controls">
        <label className="sr-only" htmlFor="month-select">Month</label>
        <select id="month-select" aria-label="Month" value={month} onChange={(e) => onMonthChange(Number(e.target.value))}>
          {MONTHS.map((m, i) => (
            <option key={m} value={i + 1}>{m}</option>
          ))}
        </select>
        <label className="sr-only" htmlFor="year-select">Year</label>
        <select id="year-select" aria-label="Year" value={year} onChange={(e) => onYearChange(Number(e.target.value))}>
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
          {unit === 'hours' ? 'Hours' : 'Workdays'}
        </button>
        <nav className="nav">
          <button type="button" className={currentPage === 'dashboard' ? 'active' : ''} onClick={() => onNavigate('dashboard')}>
            Dashboard
          </button>
          <button type="button" className={currentPage === 'categories' ? 'active' : ''} onClick={() => onNavigate('categories')}>
            Categories
          </button>
          <button type="button" className={currentPage === 'settings' ? 'active' : ''} onClick={() => onNavigate('settings')}>
            Settings
          </button>
        </nav>
      </div>
    </header>
  )
}
