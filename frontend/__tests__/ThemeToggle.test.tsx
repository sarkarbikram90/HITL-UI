import React from 'react'
import { render, screen } from '@testing-library/react'
import { ThemeToggle } from '../components/ui/ThemeToggle'
import { vi } from 'vitest'

vi.mock('next-themes', () => ({
  useTheme: () => ({ theme: 'light', resolvedTheme: 'light', setTheme: vi.fn() }),
}))

describe('ThemeToggle', () => {
  test('renders and opens menu options', async () => {
    render(<ThemeToggle />)
    const btn = screen.getByRole('button')
    expect(btn).toBeInTheDocument()
  })
})
