import React from 'react'
import { render, screen } from '@testing-library/react'
import { StatusBadge } from '../components/remediation/StatusBadge'

describe('StatusBadge', () => {
  test('renders various statuses', () => {
    const statuses = ['Pending','Approved','Rejected','Modified','Executing','Completed','Failed']
    for (const s of statuses) {
      render(<StatusBadge status={s as any} />)
      expect(screen.getByText(new RegExp(s, 'i'))).toBeInTheDocument()
    }
  })
})
