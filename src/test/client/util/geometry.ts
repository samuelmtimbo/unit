import { isInside } from '../../../client/util/geometry'
import { assert } from '../../../util/assert'

assert(
  isInside(
    { x: 0, y: 0, width: 100, height: 100, shape: 'circle', r: 25 },
    { x: 0, y: 0, width: 100, height: 100, shape: 'circle', r: 50 }
  )
)
assert(
  isInside(
    { x: 0, y: 0, width: 100, height: 100, shape: 'circle', r: 50 },
    { x: 0, y: 0, width: 100, height: 100, shape: 'circle', r: 50 }
  )
)
assert(
  isInside(
    { x: 0, y: 0, width: 100, height: 100, shape: 'circle', r: 60 },
    { x: 0, y: 0, width: 100, height: 100, shape: 'circle', r: 50 },
    5
  )
)

assert(
  !isInside(
    { x: 0, y: 0, width: 200, height: 200, shape: 'circle', r: 100 },
    { x: 0, y: 0, width: 100, height: 100, shape: 'circle', r: 50 }
  )
)
assert(
  !isInside(
    { x: 50, y: 0, width: 100, height: 100, shape: 'circle', r: 50 },
    { x: 0, y: 0, width: 100, height: 100, shape: 'circle', r: 50 }
  )
)
