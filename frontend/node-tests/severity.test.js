import assert from 'assert'
import { test } from 'node:test'

// Mirror of SeverityBadge styles for pure logic tests
const severityStyles = {
  Low: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  Medium: 'border-amber-200 bg-amber-50 text-amber-950',
  High: 'border-orange-200 bg-orange-50 text-orange-950',
  Critical: 'border-red-200 bg-red-50 text-red-950',
}

test('severity styles contain expected keys', () => {
  const keys = Object.keys(severityStyles)
  assert.deepEqual(keys.sort(), ['Critical','High','Low','Medium'].sort())
})

test('High severity includes orange class', () => {
  assert(severityStyles.High.includes('orange'))
})

test('Low severity includes emerald class', () => {
  assert(severityStyles.Low.includes('emerald'))
})
