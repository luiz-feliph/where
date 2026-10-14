import { useState } from 'react'
import { useApp } from '../../state/context'
import { parseBRLStringToCents } from '../../domain/formatting'
import { validateSettings } from '../../domain/validation'

export function Onboarding() {
  const { dispatch } = useApp()
  const [income, setIncome] = useState('')
  const [weeklyHours, setWeeklyHours] = useState('')
  const [hoursPerWorkday, setHoursPerWorkday] = useState('17')
  const [errors, setErrors] = useState<string[]>([])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const settings = {
      monthlyIncomeCents: parseBRLStringToCents(income),
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
      <h1>Welcome to Where</h1>
      <p>See what your money really costs in hours of life.</p>
      <form onSubmit={handleSubmit} noValidate>
        <label>
          Monthly income (R$)
          <input
            aria-label="Monthly income (R$)"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
            inputMode="decimal"
            placeholder="1500.00"
          />
        </label>
        <label>
          Hours worked per week
          <input
            aria-label="Hours worked per week"
            value={weeklyHours}
            onChange={(e) => setWeeklyHours(e.target.value)}
            inputMode="numeric"
            placeholder="20"
          />
        </label>
        <label>
          Hours that count as 1 workday
          <input
            aria-label="Hours that count as 1 workday"
            value={hoursPerWorkday}
            onChange={(e) => setHoursPerWorkday(e.target.value)}
            inputMode="numeric"
            placeholder="17"
          />
        </label>
        {errors.length > 0 && (
          <ul role="alert" className="errors">
            {errors.map((err) => (
              <li key={err}>{err}</li>
            ))}
          </ul>
        )}
        <button type="submit" className="btn primary">
          Get started
        </button>
      </form>
    </div>
  )
}
