export function workedHoursPerMonth(weeklyHours: number): number {
  if (weeklyHours <= 0) return 0
  return (weeklyHours * 52) / 12
}

export function hourlyRate(monthlyIncomeCents: number, weeklyHours: number): number {
  if (monthlyIncomeCents <= 0 || weeklyHours <= 0) return 0
  const monthlyIncome = monthlyIncomeCents / 100
  const hoursPerMonth = workedHoursPerMonth(weeklyHours)
  if (hoursPerMonth <= 0) return 0
  return monthlyIncome / hoursPerMonth
}

export function expenseHours(amountCents: number, weeklyHours: number, monthlyIncomeCents: number): number {
  const rate = hourlyRate(monthlyIncomeCents, weeklyHours)
  if (rate <= 0 || amountCents <= 0) return 0
  const price = amountCents / 100
  return price / rate
}

export function expenseWorkdays(amountCents: number, weeklyHours: number, monthlyIncomeCents: number, hoursPerWorkday: number): number {
  if (hoursPerWorkday <= 0) return 0
  const hours = expenseHours(amountCents, weeklyHours, monthlyIncomeCents)
  return hours / hoursPerWorkday
}
