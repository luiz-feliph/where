import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { EntryTable } from '../components/EntryTable/EntryTable'
import type { Category, Entry, Settings } from '../../domain/types'

const categories: Category[] = [
  { id: 'c1', name: 'Food & Drinks', color: '#FF6B6B' },
  { id: 'c2', name: 'Investment', color: '#FFD700' },
]
const settings: Settings = { monthlyIncomeCents: 150000, weeklyHours: 20, hoursPerWorkday: 17 }
const entries: Entry[] = [
  { id: 'e1', date: '2026-01-02', description: 'Lunch', categoryId: 'c1', amountCents: 37500, type: 'expense' },
  { id: 'e2', date: '2026-01-03', description: 'Salary', categoryId: 'c2', amountCents: 500000, type: 'income' },
]

describe('EntryTable', () => {
  it('shows hours by default and — for incomes', () => {
    render(<EntryTable entries={entries} categories={categories} settings={settings} unit="hours" onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('02, Fri')).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Hours' })).toBeInTheDocument()
    expect(screen.getByText('21.7 h')).toBeInTheDocument()
    expect(screen.getByText('—')).toBeInTheDocument()
  })

  it('shows workdays when unit is workdays', () => {
    render(<EntryTable entries={entries} categories={categories} settings={settings} unit="workdays" onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByRole('columnheader', { name: 'Workdays' })).toBeInTheDocument()
    expect(screen.getByText('1.27 d')).toBeInTheDocument()
  })

  it('shows empty state', () => {
    render(<EntryTable entries={[]} categories={categories} settings={settings} unit="hours" onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText(/no entries for this month/i)).toBeInTheDocument()
  })
})
