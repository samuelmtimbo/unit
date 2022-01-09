import { fromId } from '../spec/fromId'
import Identity from '../system/f/control/Identity'
import _classes from '../system/_classes'
import _specs from '../system/_specs'
import { pod, system } from './util/system'
const now = require('performance-now')

function log(...args) {
  console.log(...args)
}

let t0
let t1

t0 = now()
new Identity(system, pod)
t1 = now()
log('new Identity()', (t1 - t0).toFixed(3))

t0 = now()
const Range = fromId<{ a: number; b: number }, { i: number }>(
  '29e43ad7-be5e-437f-8f0f-2df996c8b89c',
  _specs,
  _classes
)
t1 = now()
log(
  "const Range = fromId<{ a: number; b: number }, { i: number }>('29e43ad7-be5e-437f-8f0f-2df996c8b89c')",
  (t1 - t0).toFixed(3)
)

t0 = now()
const range = new Range(system, pod)
t1 = now()
log('const range = new Range()', (t1 - t0).toFixed(3))

t0 = now()
for (let i = 0; i < 1000; i++) {}
t1 = now()
const t_for = t1 - t0
log('for (let i = 0; i < 1000; i++) {}', t_for.toFixed(3))

range.setOutputIgnored('i', true)
t0 = now()
range.push('a', 0)
range.push('b', 1000)
t1 = now()
const t_range = t1 - t0
log("range.push('a', 0); range.push('b', 1000)", t_range.toFixed(3))

log('range / for', (t_range / t_for).toFixed(1))
