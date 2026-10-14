import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Onboarding } from '../pages/Onboarding'
import { AppProvider } from '../../state/context'
import type { Storage } from '../../storage/Storage'
import type { AppState } from '../../domain/types'

function makeStorage(): { storage: Storage; saved: AppState[] } {
  const saved: AppState[] = []
  let current: AppState | null = null
  const storage: Storage = {
    load: () => current,
    save: (s) => {
      current = s
      saved.push(s)
    },
  }
  return { storage, saved }
}

describe('Onboarding', () => {
  it('is shown and blocks until settings are valid', async () => {
    const { storage, saved } = makeStorage()
    render(
      <AppProvider storage={storage}>
        <Onboarding />
      </AppProvider>,
    )
    expect(screen.getByRole('heading', { name: /welcome to where/i })).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: /get started/i }))
    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(saved.every((s) => s.settings === null)).toBe(true)
  })

  it('saves settings on valid submit', async () => {
    const { storage } = makeStorage()
    render(
      <AppProvider storage={storage}>
        <Onboarding />
      </AppProvider>,
    )
    await userEvent.type(screen.getByLabelText(/monthly income/i), '1500.00')
    await userEvent.type(screen.getByLabelText(/hours worked per week/i), '20')
    await userEvent.clear(screen.getByLabelText(/hours that count/i))
    await userEvent.type(screen.getByLabelText(/hours that count/i), '17')
    await userEvent.click(screen.getByRole('button', { name: /get started/i }))
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
