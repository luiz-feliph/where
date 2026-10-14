import { describe, it, expect } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Categories } from '../pages/Categories'
import { AppProvider } from '../../state/context'
import type { Storage } from '../../storage/Storage'
import type { AppState } from '../../domain/types'
import { createInitialState } from '../../storage/LocalStorage'

function memory(): { storage: Storage; get: () => AppState } {
  let current: AppState = createInitialState()
  return {
    storage: {
      load: () => current,
      save: (s) => {
        current = s
      },
    },
    get: () => current,
  }
}

describe('Categories page', () => {
  it('creates a category and rejects duplicates', async () => {
    const { storage, get } = memory()
    render(
      <AppProvider storage={storage}>
        <Categories />
      </AppProvider>,
    )
    await userEvent.type(screen.getByLabelText(/new category name/i), 'Transport')
    await userEvent.click(screen.getByRole('button', { name: /^add$/i }))
    expect(get().categories.some((c) => c.name === 'Transport')).toBe(true)

    await userEvent.type(screen.getByLabelText(/new category name/i), 'transport')
    await userEvent.click(screen.getByRole('button', { name: /^add$/i }))
    expect(screen.getByRole('alert')).toHaveTextContent(/already exists/i)
  })

  it('renames a category and rejects duplicate rename', async () => {
    const { storage, get } = memory()
    render(
      <AppProvider storage={storage}>
        <Categories />
      </AppProvider>,
    )
    const otherRow = screen.getByText('Other').closest('li')!
    await userEvent.click(within(otherRow).getByRole('button', { name: /rename/i }))
    const input = screen.getByLabelText(/rename Other/i)
    await userEvent.clear(input)
    await userEvent.type(input, 'Personal')
    await userEvent.click(screen.getByRole('button', { name: /^save$/i }))
    expect(screen.getByRole('alert')).toHaveTextContent(/already exists/i)

    await userEvent.clear(input)
    await userEvent.type(input, 'Misc')
    await userEvent.click(screen.getByRole('button', { name: /^save$/i }))
    expect(get().categories.some((c) => c.name === 'Misc')).toBe(true)
  })

  it('deletes a category by reassigning its entries', async () => {
    const state = createInitialState()
    const other = state.categories.find((c) => c.name === 'Other')!
    const personal = state.categories.find((c) => c.name === 'Personal')!
    state.entries = [
      { id: 'e1', date: '2026-01-02', description: 'X', categoryId: other.id, amount: 1, type: 'expense' },
    ]
    const mem: Storage = {
      load: () => state,
      save: () => {},
    }
    render(
      <AppProvider storage={mem}>
        <Categories />
      </AppProvider>,
    )
    const row = screen.getByText('Other').closest('li')!
    await userEvent.click(within(row).getByRole('button', { name: /^delete$/i }))
    const dialog = screen.getByRole('dialog')
    await userEvent.selectOptions(within(dialog).getByLabelText(/reassign/i), personal.id)
    await userEvent.click(within(dialog).getByRole('button', { name: /^delete$/i }))
    expect(screen.queryByText('Other')).not.toBeInTheDocument()
  })
})
