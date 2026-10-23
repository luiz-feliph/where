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
    await userEvent.type(screen.getByLabelText(/nova categoria/i), 'Transport')
    await userEvent.click(screen.getByRole('button', { name: /^adicionar$/i }))
    expect(get().categories.some((c) => c.name === 'Transport')).toBe(true)

    await userEvent.type(screen.getByLabelText(/nova categoria/i), 'transport')
    await userEvent.click(screen.getByRole('button', { name: /^adicionar$/i }))
    expect(screen.getByRole('alert')).toHaveTextContent(/já existe/i)
  })

  it('renames a category and rejects duplicate rename', async () => {
    const { storage, get } = memory()
    render(
      <AppProvider storage={storage}>
        <Categories />
      </AppProvider>,
    )
    const otherRow = screen.getByText('Outro').closest('li')!
    await userEvent.click(within(otherRow).getByRole('button', { name: /renomear/i }))
    const input = screen.getByLabelText(/renomear/i)
    await userEvent.clear(input)
    await userEvent.type(input, 'Pessoal')
    await userEvent.click(screen.getByRole('button', { name: /^salvar$/i }))
    expect(screen.getByRole('alert')).toHaveTextContent(/já existe/i)

    await userEvent.clear(input)
    await userEvent.type(input, 'Diversos')
    await userEvent.click(screen.getByRole('button', { name: /^salvar$/i }))
    expect(get().categories.some((c) => c.name === 'Diversos')).toBe(true)
  })

  it('deletes a category by reassigning its entries', async () => {
    const state = createInitialState()
    const other = state.categories.find((c) => c.name === 'Outro')!
    const personal = state.categories.find((c) => c.name === 'Pessoal')!
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
    const row = screen.getByText('Outro').closest('li')!
    await userEvent.click(within(row).getByRole('button', { name: /^excluir$/i }))
    const dialog = screen.getByRole('dialog')
    await userEvent.selectOptions(within(dialog).getByLabelText(/reatribuir/i), personal.id)
    await userEvent.click(within(dialog).getByRole('button', { name: /^excluir$/i }))
    expect(screen.queryByText('Outro')).not.toBeInTheDocument()
  })
})
