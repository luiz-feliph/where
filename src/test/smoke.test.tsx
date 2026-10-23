import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from '../App'

describe('App', () => {
  it('shows onboarding on first launch', () => {
    localStorage.clear()
    render(<App />)
    expect(screen.getByRole('heading', { name: /where/i })).toBeInTheDocument()
  })
})
