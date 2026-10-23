import { useState } from 'react'
import { useApp } from '../../state/context'
import { parseBRLToReais } from '../../domain/formatting'
import { validateSettings } from '../../domain/validation'
import { useTranslation } from 'react-i18next'

export function SettingsPage() {
  const { t } = useTranslation(['common', 'validation'])
  const { state, dispatch } = useApp()
  const [income, setIncome] = useState(state.settings ? state.settings.monthlyIncome.toFixed(2).replace('.', ',') : '')
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
      <h2>{t('common:settings')}</h2>
      <form onSubmit={handleSubmit} noValidate>
        <label>
          {t('common:monthlyIncome')}
          <input aria-label={t('common:monthlyIncome')} value={income} onChange={(e) => setIncome(e.target.value)} inputMode="decimal" />
        </label>
        <label>
          {t('common:hoursWorkedPerWeek')}
          <input aria-label={t('common:hoursWorkedPerWeek')} value={weeklyHours} onChange={(e) => setWeeklyHours(e.target.value)} inputMode="numeric" />
        </label>
        <label>
          {t('common:hoursPerWorkday')}
          <input aria-label={t('common:hoursPerWorkday')} value={hoursPerWorkday} onChange={(e) => setHoursPerWorkday(e.target.value)} inputMode="numeric" />
        </label>
        {errors.length > 0 && (
          <ul role="alert" className="errors">
            {errors.map((err) => <li key={err}>{t(err)}</li>)}
          </ul>
        )}
        {saved && <p role="status" className="saved">{t('common:saved')}</p>}
        <button type="submit" className="btn primary">{t('common:save')}</button>
      </form>
      <button
        type="button"
        className="btn export"
        onClick={async () => {
          const { downloadExport } = await import('../../export/exportXlsx')
          await downloadExport(state)
        }}
      >
        {t('common:exportSpreadsheet')}
      </button>
    </section>
  )
}
