import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeToggle } from '../components/ui/ThemeToggle'
import { vi } from 'vitest'

const setThemeMock = vi.fn()

vi.mock('next-themes', () => ({
  useTheme: () => ({ theme: 'light', resolvedTheme: 'light', setTheme: setThemeMock }),
}))

describe('ThemeToggle', () => {
  test('theme toggle is disabled', async () => {
    const { container } = render(<ThemeToggle />)
    // ThemeToggle returns null - theme feature is disabled
    expect(container.firstChild).toBeNull()
  })
})
