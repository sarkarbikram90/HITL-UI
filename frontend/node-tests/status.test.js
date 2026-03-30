import assert from 'assert'
import { test } from 'node:test'

const statusStyles = {
  Pending: 'border-slate-500 bg-slate-500/10 text-slate-300',
  Approved: 'border-emerald-500 bg-emerald-500/10 text-emerald-400',
  Rejected: 'border-red-500 bg-red-500/10 text-red-400',
  Modified: 'border-amber-500 bg-amber-500/10 text-amber-400',
  Executing: 'border-blue-500 bg-blue-500/10 text-blue-400 animate-pulse',
  Completed: 'border-emerald-400 bg-emerald-400/20 text-emerald-300 border-2',
  Failed: 'border-rose-600 bg-rose-600/10 text-rose-400',
}

test('status styles contain Approved and Rejected', () => {
  assert('Approved' in statusStyles)
  assert('Rejected' in statusStyles)
})

test('Executing status includes animate-pulse', () => {
  assert(statusStyles.Executing.includes('animate-pulse'))
})
