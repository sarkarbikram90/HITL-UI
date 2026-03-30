import assert from 'assert'
import { test } from 'node:test'

function areActionsDisabled(status) {
  // simple pure logic: when executed, no actions allowed
  if (status === 'Executed' || status === 'executed') return true
  return false
}

test('actions disabled when executed', () => {
  assert.equal(areActionsDisabled('executed'), true)
  assert.equal(areActionsDisabled('Executed'), true)
})

test('actions enabled for approved', () => {
  assert.equal(areActionsDisabled('Approved'), false)
})

test('actions enabled for open', () => {
  assert.equal(areActionsDisabled('open'), false)
})
