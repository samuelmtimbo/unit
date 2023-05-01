import * as assert from '../util/assert'

export function parsePadding(padding: string): {
  top: number
  right: number
  left: number
  bottom: number
} {
  const parts = padding.split(' ')

  const top = parseInt(parts[0], 10)
  const right = parseInt(parts[1] || parts[0], 10)
  const bottom = parseInt(parts[2] || parts[0], 10)
  const left = parseInt(parts[3] || parts[1] || parts[0], 10)

  return { top, right, bottom, left }
}

assert.deepEqual(parsePadding('10px'), {
  top: 10,
  right: 10,
  bottom: 10,
  left: 10,
})

assert.deepEqual(parsePadding('10px 10px 5px 5px'), {
  top: 10,
  right: 10,
  bottom: 5,
  left: 5,
})
