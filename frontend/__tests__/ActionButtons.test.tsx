import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import { ActionButtons } from '../components/remediation/ActionButtons'

const pendingRow = {
  incidentId: 'INC-PEND',
  status: 'Pending',
  proposedCommand: 'echo pending',
  severity: 'Low',
  anomalyName: 'CPU spike',
  resource: 'server-01',
  createdAt: new Date().toISOString(),
}

const approvedRow = { ...pendingRow, incidentId: 'INC-APR', status: 'Approved' }
const failedRow = { ...pendingRow, incidentId: 'INC-FAIL', status: 'Failed' }

describe('ActionButtons', () => {
  test('shows Accept/Modify/Reject for pending and calls handlers', () => {
    const onAccept = vi.fn()
    const onModify = vi.fn()
    const onReject = vi.fn()

    render(
      <ActionButtons row={pendingRow as any} onAccept={onAccept} onModify={onModify} onReject={onReject} />
    )

    const accept = screen.getByRole('button', { name: /Accept/i })
    const modify = screen.getByRole('button', { name: /Modify/i })
    const reject = screen.getByRole('button', { name: /Reject/i })

    fireEvent.click(accept)
    expect(onAccept).toHaveBeenCalledWith('INC-PEND')

    fireEvent.click(modify)
    expect(onModify).toHaveBeenCalled()

    fireEvent.click(reject)
    expect(onReject).toHaveBeenCalledWith('INC-PEND')
  })

  test('shows Execute for approved when onExecute provided', () => {
    const onAccept = vi.fn()
    const onModify = vi.fn()
    const onReject = vi.fn()
    const onExecute = vi.fn()

    render(
      <ActionButtons row={approvedRow as any} onAccept={onAccept} onModify={onModify} onReject={onReject} onExecute={onExecute} />
    )

    const exec = screen.getByRole('button', { name: /Execute/i })
    fireEvent.click(exec)
    expect(onExecute).toHaveBeenCalledWith('INC-APR')
  })

  test('shows Retry for failed', () => {
    const onAccept = vi.fn()
    const onModify = vi.fn()
    const onReject = vi.fn()

    render(
      <ActionButtons row={failedRow as any} onAccept={onAccept} onModify={onModify} onReject={onReject} />
    )

    const retry = screen.getByRole('button', { name: /Retry/i })
    expect(retry).toBeInTheDocument()
    fireEvent.click(retry)
    expect(onModify).toHaveBeenCalled()
  })
})
