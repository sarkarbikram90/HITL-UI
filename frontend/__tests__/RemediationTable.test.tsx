import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import { RemediationTable } from '../components/remediation/RemediationTable'

const row = {
  incidentId: 'INC-001',
  anomalyName: 'High CPU load causing slowdown',
  resource: 'server-01',
  severity: 'High',
  status: 'Pending',
  confidence: 90,
  createdAt: '2024-01-22T14:30:00.000Z',
  proposedCommand: 'reboot -f',
}

describe('RemediationTable', () => {
  test('renders headers and row content, and clicks row', () => {
    const onAccept = vi.fn()
    const onModify = vi.fn()
    const onReject = vi.fn()
    const onRowClick = vi.fn()

    render(
      <RemediationTable
        data={[row as any]}
        total={1}
        page={1}
        pageSize={10}
        sortBy={'createdAt' as any}
        sortDir={'asc'}
        isLoading={false}
        onPageChange={() => {}}
        onSortChange={() => {}}
        onAccept={onAccept}
        onModify={onModify}
        onReject={onReject}
        onExecute={() => {}}
        mutationPending={false}
        onRowClick={onRowClick}
      />
    )

    // headers
    expect(screen.getByText(/Severity/i)).toBeInTheDocument()
    expect(screen.getByText(/ID/i)).toBeInTheDocument()
    expect(screen.getByText(/Anomaly/i)).toBeInTheDocument()
    expect(screen.getByText(/Resource/i)).toBeInTheDocument()
    expect(screen.getByText(/Date/i)).toBeInTheDocument()
    expect(screen.getByText(/Proposed Command/i)).toBeInTheDocument()
    expect(screen.getByText(/Status/i)).toBeInTheDocument()
    expect(screen.getByText(/Actions/i)).toBeInTheDocument()

    // row content checks
    expect(screen.getByText(/INC-001/)).toBeInTheDocument()
    expect(screen.getByText(/High CPU load causing slowdown/)).toBeInTheDocument()
    expect(screen.getByText(/server-01/)).toBeInTheDocument()
    // date formatted as YYYY-MM-DD HH:mm in table cell
    expect(screen.getByText(/2024-01-22 14:30/)).toBeInTheDocument()

    // clicking row should call onRowClick
    const rowElement = screen.getByText(/INC-001/).closest('tr')
    expect(rowElement).toBeTruthy()
    if (rowElement) fireEvent.click(rowElement)
    expect(onRowClick).toHaveBeenCalled()
  })
})
