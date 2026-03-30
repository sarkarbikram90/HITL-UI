import React from 'react'
import { render, screen } from '@testing-library/react'
import { SeverityBadge } from '../components/remediation/SeverityBadge'

describe('SeverityBadge', () => {
  test('renders Low/Midium/High/Critical labels', () => {
    render(<SeverityBadge severity={'Low' as any} />)
    expect(screen.getByText(/Low/i)).toBeInTheDocument()
    render(<SeverityBadge severity={'Medium' as any} />)
    expect(screen.getByText(/Medium/i)).toBeInTheDocument()
    render(<SeverityBadge severity={'High' as any} />)
    expect(screen.getByText(/High/i)).toBeInTheDocument()
    render(<SeverityBadge severity={'Critical' as any} />)
    expect(screen.getByText(/Critical/i)).toBeInTheDocument()
  })
})
