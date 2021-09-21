import * as assert from 'assert'

function* range0(a: number, b: number) {
  if (a < b) {
    yield a
    yield* range0(a + 1, b)
  }
}

const r0 = range0(0, 3)

assert.equal(r0.next().value, 0)
assert.equal(r0.next().value, 1)
assert.equal(r0.next().value, 2)
assert.equal(r0.next().value, null)

function* range1(a: number, b: number) {
  while (a < b) {
    yield a
    a++
  }
}

const r1 = range1(0, 3)

assert.equal(r1.next().value, 0)
assert.equal(r1.next().value, 1)
assert.equal(r1.next().value, 2)
assert.equal(r1.next().value, null)
