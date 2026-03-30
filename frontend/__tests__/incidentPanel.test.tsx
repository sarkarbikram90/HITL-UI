import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import IncidentPanel from '../components/remediation/IncidentPanel'

const mockIncident = {
  incidentId: 'INC-001',
  anomalyName: 'High CPU',
  resource: 'server-01',
  category: 'cpu',
  severity: 'high',
  confidence: 98,
  createdAt: new Date().toISOString(),
  status: 'open',
  description: 'Test incident',
  proposedCommand: 'echo hello',
}

describe('IncidentPanel', () => {
  test('renders panel and copies command', async () => {
    const onOpenChange = vi.fn()
    const onConfirm = vi.fn()

    render(
      <IncidentPanel open={true} onOpenChange={onOpenChange} incident={mockIncident as any} actionType="view" onConfirm={onConfirm} />
    )

    // wait for proposed command section to appear (panel shows a brief loading skeleton)
    const proposed = await screen.findByText(/Proposed Command/i)
    expect(proposed).toBeInTheDocument()

    const copyBtn = screen.getByTitle(/Copy command/i)
    expect(copyBtn).toBeInTheDocument()

    // mock clipboard
    const writeText = vi.fn()
    // @ts-ignore
    navigator.clipboard = { writeText }

    fireEvent.click(copyBtn)
    expect(writeText).toHaveBeenCalledWith('echo hello')
  })
})
