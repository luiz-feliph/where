import { useState } from 'react'
import { useApp } from '../../state/context'
import { parseBRLToReais } from '../../domain/formatting'
import { validateSettings } from '../../domain/validation'

export function SettingsPage() {
  const { state, dispatch } = useApp()
  const [income, setIncome] = useState(state.settings ? state.settings.monthlyIncome.toFixed(2) : '')
  const [weeklyHours, setWeeklyHours] = useState(state.settings ? String(state.settings.weeklyHours) : '')
  const [hoursPerWorkday, setHoursPerWorkday] = useState(state.settings ? String(state.settings.hoursPerWorkday) : '17')
  const [errors, setErrors] = useState<string[]>([])
  const [saved, setSaved] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const settings = {
      monthlyIncome: parseBRLToReais(income),
      weeklyHours: Number(weeklyHours),
      hoursPerWorkday: Number(hoursPerWorkday),
    }
    const errs = validateSettings(settings)
    if (errs.length > 0) {
      setErrors(errs)
      setSaved(false)
      return
    }
    setErrors([])
    dispatch({ type: 'SET_SETTINGS', payload: settings })
    setSaved(true)
  }

  return (
    <section className="settings-page">
      <h2>Settings</h2>
      <form onSubmit={handleSubmit} noValidate>
        <label>
          Monthly income (R$)
          <input aria-label="Monthly income (R$)" value={income} onChange={(e) => setIncome(e.target.value)} inputMode="decimal" />
        </label>
        <label>
          Hours worked per week
          <input aria-label="Hours worked per week" value={weeklyHours} onChange={(e) => setWeeklyHours(e.target.value)} inputMode="numeric" />
        </label>
        <label>
          Hours that count as 1 workday
          <input aria-label="Hours that count as 1 workday" value={hoursPerWorkday} onChange={(e) => setHoursPerWorkday(e.target.value)} inputMode="numeric" />
        </label>
        {errors.length > 0 && (
          <ul role="alert" className="errors">
            {errors.map((err) => <li key={err}>{err}</li>)}
          </ul>
        )}
        {saved && <p role="status" className="saved">Saved</p>}
        <button type="submit" className="btn primary">Save</button>
      </form>
      <button
        type="button"
        className="btn export"
        onClick={async () => {
          const { downloadExport } = await import('../../export/exportXlsx')
          await downloadExport(state)
        }}
      >
        Export spreadsheet (.xlsx)
      </button>
    </section>
  )
}
