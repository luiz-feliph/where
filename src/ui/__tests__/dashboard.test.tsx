import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Dashboard } from '../components/Dashboard/Dashboard'
import type { Category, Entry } from '../../domain/types'

const categories: Category[] = [
  { id: 'c1', name: 'Alimentos e Bebidas', color: '#FF6B6B' },
  { id: 'c2', name: 'Investimentos', color: '#FFD700' },
]
const entries: Entry[] = [
  { id: 'e1', date: '2026-01-02', description: 'Lunch', categoryId: 'c1', amount: 375, type: 'expense' },
  { id: 'e2', date: '2026-01-03', description: 'Salary', categoryId: 'c1', amount: 5000, type: 'income' },
  { id: 'e3', date: '2026-02-01', description: 'Other month', categoryId: 'c1', amount: 999, type: 'expense' },
]

describe('Dashboard', () => {
  it('summarizes income, expenses and balance for the month', () => {
    render(<Dashboard entries={entries} categories={categories} settings={{ monthlyIncome: 1500, weeklyHours: 20, hoursPerWorkday: 17 }} year={2026} month={1} unit="hours" />)
    expect(screen.getByText('R$ 5.000,00')).toBeInTheDocument()
    expect(screen.getAllByText('R$ 375,00').length).toBeGreaterThan(0)
    expect(screen.getByText('R$ 4.625,00')).toBeInTheDocument()
  })

  it('lists per-category amounts with conversion and percentage', () => {
    render(<Dashboard entries={entries} categories={categories} settings={null} year={2026} month={1} unit="hours" />)
    expect(screen.getByText('Alimentos e Bebidas')).toBeInTheDocument()
    expect(screen.getAllByText('R$ 375,00').length).toBeGreaterThan(0)
    expect(screen.getAllByText('100,0%').length).toBeGreaterThan(0)
  })

  it('shows empty state when no expenses', () => {
    render(<Dashboard entries={[]} categories={categories} settings={null} year={2026} month={1} unit="hours" />)
    expect(screen.getByText(/nenhuma despesa/i)).toBeInTheDocument()
  })

  it('axes conversion unit', () => {
    render(<Dashboard entries={entries} categories={categories} settings={null} year={2026} month={1} unit="workdays" />)
    expect(screen.getByRole('columnheader', { name: /dias de trabalho/i })).toBeInTheDocument()
  })
})
