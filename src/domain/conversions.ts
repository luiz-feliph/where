export function workedHoursPerMonth(weeklyHours: number): number {
  if (weeklyHours <= 0) return 0
  return weeklyHours * 4
}

export function hourlyRate(monthlyIncome: number, weeklyHours: number): number {
  if (monthlyIncome <= 0 || weeklyHours <= 0) return 0
  const hoursPerMonth = workedHoursPerMonth(weeklyHours)
  if (hoursPerMonth <= 0) return 0
  return monthlyIncome / hoursPerMonth
}

export function expenseHours(amount: number, weeklyHours: number, monthlyIncome: number): number {
  const rate = hourlyRate(monthlyIncome, weeklyHours)
  if (rate <= 0 || amount <= 0) return 0
  return amount / rate
}

export function expenseWorkdays(amount: number, weeklyHours: number, monthlyIncome: number, hoursPerWorkday: number): number {
  if (hoursPerWorkday <= 0) return 0
  const hours = expenseHours(amount, weeklyHours, monthlyIncome)
  return hours / hoursPerWorkday
}
