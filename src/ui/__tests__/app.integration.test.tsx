import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../../App'

async function completeOnboarding() {
  await userEvent.type(screen.getByLabelText(/renda mensal/i), '1500,00')
  await userEvent.type(screen.getByLabelText(/horas trabalhadas por semana/i), '20')
  await userEvent.clear(screen.getByLabelText(/equivalem a 1 dia/i))
  await userEvent.type(screen.getByLabelText(/equivalem a 1 dia/i), '17')
  await userEvent.click(screen.getByRole('button', { name: /começar/i }))
}

describe('App integration', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('onboards then creates an entry and toggles units', async () => {
    render(<App />)
    await completeOnboarding()

    expect(screen.getByRole('heading', { name: /lançamentos/i })).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: /\+ novo lançamento/i }))
    const dialog = screen.getByRole('dialog')
    await userEvent.type(within(dialog).getByLabelText('Descrição'), 'Almoço')
    await userEvent.type(within(dialog).getByLabelText('Preço'), '375,00')
    await userEvent.click(within(dialog).getByRole('button', { name: /salvar/i }))

    expect(screen.getByText('Almoço')).toBeInTheDocument()
    expect(screen.getAllByRole('columnheader', { name: /horas/i }).length).toBeGreaterThan(0)
    expect(screen.getAllByText('20,0 h').length).toBeGreaterThan(0)

    await userEvent.click(screen.getByRole('button', { name: /horas/i }))
    expect(screen.getAllByRole('columnheader', { name: /dias de trabalho/i }).length).toBeGreaterThan(0)
    expect(screen.getAllByText('1,18 d').length).toBeGreaterThan(0)
  })

  it('navigates to categories and settings', async () => {
    render(<App />)
    await completeOnboarding()

    await userEvent.click(screen.getByRole('button', { name: /categorias/i }))
    expect(screen.getByRole('heading', { name: /categorias/i })).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: /configurações/i }))
    expect(screen.getByRole('heading', { name: /configurações/i })).toBeInTheDocument()
  })

  it('shows a warning and resets when saved data is corrupted', async () => {
    localStorage.setItem('where:v2', '{ not valid json')
    render(<App />)
    expect(screen.getByRole('alert')).toHaveTextContent(/não puderam ser lidos/i)
    expect(screen.getByRole('heading', { name: /where/i })).toBeInTheDocument()
  })
})
