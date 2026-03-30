import assert from 'assert'
import { test } from 'node:test'

test('builds URLSearchParams from filters', () => {
  const query = {
    severity: 'high',
    status: 'open',
    resource: 'server-01',
    limit: 10,
    offset: 0,
  }

  const params = new URLSearchParams(query)
  assert(params.toString().includes('severity=high'))
  assert(params.toString().includes('status=open'))
})

test('formats ISO timestamp to date parts', () => {
  const ts = '2024-01-22T14:30:45.123Z'
  const d = new Date(ts)
  assert.equal(d.getFullYear(), 2024)
  assert.equal(d.getMonth(), 0)
  assert.equal(d.getDate(), 22)
})

test('severity ordering logic', () => {
  const severityOrder = { high: 1, medium: 2, low: 3 }
  const arr = [ {id:1, severity:'low'}, {id:2, severity:'high'} ]
  const sorted = arr.sort((a,b) => severityOrder[a.severity] - severityOrder[b.severity])
  assert.equal(sorted[0].severity, 'high')
})
