export function validateSettings(settings: {
  monthlyIncome: number
  weeklyHours: number
  hoursPerWorkday: number
}): string[] {
  const errors: string[] = []
  if (!settings.monthlyIncome || settings.monthlyIncome <= 0) {
    errors.push('validation:monthlyIncomeGreaterThanZero')
  }
  if (!settings.weeklyHours || settings.weeklyHours <= 0 || settings.weeklyHours > 168) {
    errors.push('validation:weeklyHoursRange')
  }
  if (!Number.isInteger(settings.hoursPerWorkday) || settings.hoursPerWorkday < 1 || settings.hoursPerWorkday > 24) {
    errors.push('validation:hoursPerWorkdayRange')
  }
  return errors
}

export function validateEntry(entry: {
  description: string
  amount: number
  date: string
  categoryId: string
}): string[] {
  const errors: string[] = []
  if (!entry.description || entry.description.trim().length === 0) {
    errors.push('validation:descriptionRequired')
  }
  if (!entry.amount || entry.amount <= 0) {
    errors.push('validation:priceGreaterThanZero')
  }
  if (!entry.date || !/^\d{4}-\d{2}-\d{2}$/.test(entry.date)) {
    errors.push('validation:validDateRequired')
  }
  if (!entry.categoryId) {
    errors.push('validation:categoryRequired')
  }
  return errors
}

export function validateCategoryName(name: string, existingNames: string[], currentId?: string): string[] {
  const errors: string[] = []
  if (!name || name.trim().length === 0) {
    errors.push('validation:categoryNameEmpty')
  } else {
    const normalized = name.trim().toLowerCase()
    for (const existing of existingNames) {
      if (existing.toLowerCase() === normalized) {
        if (!currentId) {
          errors.push('validation:categoryNameExists')
          break
        }
      }
    }
  }
  return errors
}
