import assert from 'assert'
import { test } from 'node:test'

function keyToAction(key) {
  const k = key.toLowerCase()
  if (k === 'a') return 'approve'
  if (k === 'r') return 'reject'
  if (k === 'm') return 'modify'
  return null
}

test('maps A to approve', () => {
  assert.equal(keyToAction('A'), 'approve')
})

test('maps r to reject', () => {
  assert.equal(keyToAction('r'), 'reject')
})

test('maps M to modify', () => {
  assert.equal(keyToAction('M'), 'modify')
})

test('unknown key returns null', () => {
  assert.equal(keyToAction('x'), null)
})
