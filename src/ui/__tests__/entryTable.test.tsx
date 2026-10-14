import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { EntryTable } from '../components/EntryTable/EntryTable'
import type { Category, Entry, Settings } from '../../domain/types'

const categories: Category[] = [
  { id: 'c1', name: 'Food & Drinks', color: '#FF6B6B' },
  { id: 'c2', name: 'Investment', color: '#FFD700' },
]
const settings: Settings = { monthlyIncome: 1500, weeklyHours: 20, hoursPerWorkday: 17 }
const entries: Entry[] = [
  { id: 'e1', date: '2026-01-02', description: 'Lunch', categoryId: 'c1', amount: 375, type: 'expense' },
  { id: 'e2', date: '2026-01-03', description: 'Salary', categoryId: 'c2', amount: 5000, type: 'income' },
]

describe('EntryTable', () => {
  it('shows hours by default and — for incomes', () => {
    render(<EntryTable entries={entries} categories={categories} settings={settings} unit="hours" onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('02, Fri')).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Hours' })).toBeInTheDocument()
    expect(screen.getByText('20.0 h')).toBeInTheDocument()
    expect(screen.getByText('—')).toBeInTheDocument()
  })

  it('shows workdays when unit is workdays', () => {
    render(<EntryTable entries={entries} categories={categories} settings={settings} unit="workdays" onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByRole('columnheader', { name: 'Workdays' })).toBeInTheDocument()
    expect(screen.getByText('1.18 d')).toBeInTheDocument()
  })

  it('shows empty state', () => {
    render(<EntryTable entries={[]} categories={categories} settings={settings} unit="hours" onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText(/no entries for this month/i)).toBeInTheDocument()
  })
})
