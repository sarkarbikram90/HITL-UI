import assert from 'assert'
import { test } from 'node:test'

function buildPayload(actionType, incident, opts = {}) {
  if (actionType === 'approve') return { incidentId: incident.incidentId, status: 'Approved' }
  if (actionType === 'reject') return { incidentId: incident.incidentId, status: 'Rejected', reason: opts.reason || '', comments: opts.comments || '' }
  if (actionType === 'modify') return { incidentId: incident.incidentId, status: 'Modified', proposedCommand: opts.proposedCommand || '' }
  return null
}

const mockIncident = { incidentId: 'INC-123' }

test('build approve payload', () => {
  const p = buildPayload('approve', mockIncident)
  assert.equal(p.incidentId, 'INC-123')
  assert.equal(p.status, 'Approved')
})

test('build reject payload with reason and comments', () => {
  const p = buildPayload('reject', mockIncident, { reason: 'false-positive', comments: 'not an issue' })
  assert.equal(p.status, 'Rejected')
  assert.equal(p.reason, 'false-positive')
  assert.equal(p.comments, 'not an issue')
})

test('build modify payload with command', () => {
  const p = buildPayload('modify', mockIncident, { proposedCommand: 'echo hi' })
  assert.equal(p.status, 'Modified')
  assert.equal(p.proposedCommand, 'echo hi')
})
