import { render, screen } from '@testing-library/react'
import App from '../App'

test('smoke renders', () => {
  render(<App />)
  expect(screen.getByText(/where app/i)).toBeInTheDocument()
})
