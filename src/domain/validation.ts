export function validateSettings(settings: {
  monthlyIncomeCents: number
  weeklyHours: number
  hoursPerWorkday: number
}): string[] {
  const errors: string[] = []
  if (!settings.monthlyIncomeCents || settings.monthlyIncomeCents <= 0) {
    errors.push('Monthly income must be greater than 0')
  }
  if (!settings.weeklyHours || settings.weeklyHours <= 0 || settings.weeklyHours > 168) {
    errors.push('Weekly hours must be between 1 and 168')
  }
  if (!Number.isInteger(settings.hoursPerWorkday) || settings.hoursPerWorkday < 1 || settings.hoursPerWorkday > 24) {
    errors.push('Hours per workday must be between 1 and 24')
  }
  return errors
}

export function validateEntry(entry: {
  description: string
  amountCents: number
  date: string
  categoryId: string
}): string[] {
  const errors: string[] = []
  if (!entry.description || entry.description.trim().length === 0) {
    errors.push('Description is required')
  }
  if (!entry.amountCents || entry.amountCents <= 0) {
    errors.push('Price must be greater than 0')
  }
  if (!entry.date || !/^\d{4}-\d{2}-\d{2}$/.test(entry.date)) {
    errors.push('Valid date is required')
  }
  if (!entry.categoryId) {
    errors.push('Category is required')
  }
  return errors
}

export function validateCategoryName(name: string, existingNames: string[], currentId?: string): string[] {
  const errors: string[] = []
  if (!name || name.trim().length === 0) {
    errors.push('Category name cannot be empty')
  } else {
    const normalized = name.trim().toLowerCase()
    for (const existing of existingNames) {
      if (existing.toLowerCase() === normalized) {
        if (!currentId) {
          errors.push('Category name already exists')
          break
        }
      }
    }
  }
  return errors
}
