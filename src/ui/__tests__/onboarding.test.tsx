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
    expect(screen.getByRole('heading', { name: /where/i })).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: /começar/i }))
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
    await userEvent.type(screen.getByLabelText(/renda mensal/i), '1500,00')
    await userEvent.type(screen.getByLabelText(/horas trabalhadas por semana/i), '20')
    await userEvent.clear(screen.getByLabelText(/equivalem a 1 dia/i))
    await userEvent.type(screen.getByLabelText(/equivalem a 1 dia/i), '17')
    await userEvent.click(screen.getByRole('button', { name: /começar/i }))
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
