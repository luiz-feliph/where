import { useState } from 'react'
import { useApp } from '../../state/context'
import { parseBRLToReais } from '../../domain/formatting'
import { validateSettings } from '../../domain/validation'
import { useTranslation } from 'react-i18next'

export function Onboarding() {
  const { t } = useTranslation(['common', 'validation'])
  const { dispatch } = useApp()
  const [income, setIncome] = useState('')
  const [weeklyHours, setWeeklyHours] = useState('')
  const [hoursPerWorkday, setHoursPerWorkday] = useState('17')
  const [errors, setErrors] = useState<string[]>([])

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
      return
    }
    dispatch({ type: 'SET_SETTINGS', payload: settings })
  }

  return (
    <div className="onboarding">
      <h1>{t('common:appName')}</h1>
      <p>{t('common:appSubtitle')}</p>
      <form onSubmit={handleSubmit} noValidate>
        <label>
          {t('common:monthlyIncome')}
          <input
            aria-label={t('common:monthlyIncome')}
            value={income}
            onChange={(e) => setIncome(e.target.value)}
            inputMode="decimal"
            placeholder="1500,00"
          />
        </label>
        <label>
          {t('common:hoursWorkedPerWeek')}
          <input
            aria-label={t('common:hoursWorkedPerWeek')}
            value={weeklyHours}
            onChange={(e) => setWeeklyHours(e.target.value)}
            inputMode="numeric"
            placeholder="20"
          />
        </label>
        <label>
          {t('common:hoursPerWorkday')}
          <input
            aria-label={t('common:hoursPerWorkday')}
            value={hoursPerWorkday}
            onChange={(e) => setHoursPerWorkday(e.target.value)}
            inputMode="numeric"
            placeholder="17"
          />
        </label>
        {errors.length > 0 && (
          <ul role="alert" className="errors">
            {errors.map((err) => (
              <li key={err}>{t(err)}</li>
            ))}
          </ul>
        )}
        <button type="submit" className="btn primary">
          {t('common:getStarted')}
        </button>
      </form>
    </div>
  )
}
