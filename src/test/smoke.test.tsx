import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from '../App'
import type { Storage } from '../storage/Storage'
import type { AppState } from '../domain/types'
import { createInitialState } from '../storage/LocalStorage'

function memoryStorage(initial: AppState | null): Storage {
  let current = initial
  return {
    load: () => current,
    save: (s) => {
      current = s
    },
  }
}

describe('App', () => {
  it('shows onboarding on first launch', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: /welcome to where/i })).toBeInTheDocument()
  })
})

export { memoryStorage, createInitialState }
