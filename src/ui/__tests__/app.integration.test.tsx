import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../../App'

async function completeOnboarding() {
  await userEvent.type(screen.getByLabelText(/monthly income/i), '1500.00')
  await userEvent.type(screen.getByLabelText(/hours worked per week/i), '20')
  await userEvent.clear(screen.getByLabelText(/hours that count/i))
  await userEvent.type(screen.getByLabelText(/hours that count/i), '17')
  await userEvent.click(screen.getByRole('button', { name: /get started/i }))
}

describe('App integration', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('onboards then creates an entry and toggles units', async () => {
    render(<App />)
    await completeOnboarding()

    expect(screen.getByRole('heading', { name: 'Entries' })).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: '+ New entry' }))
    const dialog = screen.getByRole('dialog')
    await userEvent.type(within(dialog).getByLabelText('Description'), 'Lunch')
    await userEvent.type(within(dialog).getByLabelText('Price (R$)'), '375.00')
    await userEvent.click(within(dialog).getByRole('button', { name: /save/i }))

    expect(screen.getByText('Lunch')).toBeInTheDocument()
    expect(screen.getAllByRole('columnheader', { name: 'Hours' }).length).toBeGreaterThan(0)
    expect(screen.getAllByText('20.0 h').length).toBeGreaterThan(0)

    await userEvent.click(screen.getByRole('button', { name: 'Hours' }))
    expect(screen.getAllByRole('columnheader', { name: 'Workdays' }).length).toBeGreaterThan(0)
    expect(screen.getAllByText('1.18 d').length).toBeGreaterThan(0)
  })

  it('navigates to categories and settings', async () => {
    render(<App />)
    await completeOnboarding()

    await userEvent.click(screen.getByRole('button', { name: 'Categories' }))
    expect(screen.getByRole('heading', { name: 'Categories' })).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'Settings' }))
    expect(screen.getByRole('heading', { name: 'Settings' })).toBeInTheDocument()
  })

  it('shows a warning and resets when saved data is corrupted', async () => {
    localStorage.setItem('where:v1', '{ not valid json')
    render(<App />)
    expect(screen.getByRole('alert')).toHaveTextContent(/could not be read/i)
    expect(screen.getByRole('heading', { name: /welcome to where/i })).toBeInTheDocument()
  })
})
