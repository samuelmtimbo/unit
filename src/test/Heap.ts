import {
  Heap,
  addHeapNode,
  findInsertionPoint,
  findLastLeaf,
  parentHeap,
  readHeap,
  removeHeapNode,
  setHeapNode,
  toSortedArray,
} from '../Heap'
import { assert } from '../util/assert'

const heap: Heap<number> = {
  value: 6,
  left: {
    value: 5,
    left: { value: 4 },
    right: { value: 3 },
  },
  right: {
    value: 2,
    left: { value: 1 },
    right: { value: 0 },
  },
}

const predicate = (a: number, b: number) => a >= b

let _heap = parentHeap(heap, null)

assert.deepEqual(readHeap(_heap), {
  value: 6,
  left: {
    value: 5,
    left: { value: 4 },
    right: { value: 3 },
  },
  right: {
    value: 2,
    left: { value: 1 },
    right: { value: 0 },
  },
})

assert.deepEqual(findInsertionPoint(_heap).value, 4)
assert.deepEqual(findLastLeaf(_heap).value, 0)

_heap = addHeapNode(
  _heap,
  { value: 7, parent: null, left: null, right: null },
  predicate
)

assert.deepEqual(readHeap(_heap), {
  value: 7,
  left: {
    value: 6,
    left: {
      value: 5,
      left: {
        value: 4,
      },
    },
    right: {
      value: 3,
    },
  },
  right: {
    value: 2,
    left: {
      value: 1,
    },
    right: {
      value: 0,
    },
  },
})

assert.deepEqual(findLastLeaf(_heap).value, 4)
assert.deepEqual(findInsertionPoint(_heap).value, 5)

_heap = removeHeapNode(_heap, predicate)

assert.deepEqual(readHeap(_heap), {
  value: 6,
  left: {
    value: 5,
    left: {
      value: 4,
    },
    right: {
      value: 3,
    },
  },
  right: {
    value: 2,
    left: {
      value: 1,
    },
    right: {
      value: 0,
    },
  },
})

_heap = removeHeapNode(_heap, predicate)

assert.deepEqual(readHeap(_heap), {
  value: 5,
  left: {
    value: 4,
    left: {
      value: 0,
    },
    right: {
      value: 3,
    },
  },
  right: {
    value: 2,
    left: {
      value: 1,
    },
  },
})

_heap = removeHeapNode(_heap, predicate)

assert.deepEqual(readHeap(_heap), {
  value: 4,
  left: {
    value: 3,
    left: {
      value: 0,
    },
    right: {
      value: 1,
    },
  },
  right: {
    value: 2,
  },
})

_heap = addHeapNode(_heap, { value: 7, parent: null }, predicate)

assert.deepEqual(readHeap(_heap), {
  value: 7,
  left: {
    value: 3,
    left: {
      value: 0,
    },
    right: {
      value: 1,
    },
  },
  right: {
    value: 4,
    left: {
      value: 2,
    },
  },
})

_heap = addHeapNode(_heap, { value: 6, parent: null }, predicate)

assert.deepEqual(readHeap(_heap), {
  value: 7,
  left: {
    value: 3,
    left: {
      value: 0,
    },
    right: {
      value: 1,
    },
  },
  right: {
    value: 6,
    left: {
      value: 2,
    },
    right: {
      value: 4,
    },
  },
})

assert.deepEqual(findLastLeaf(_heap).value, 4)
assert.deepEqual(findInsertionPoint(_heap).value, 0)

const _heap_2 = _heap.left.left

_heap = removeHeapNode(_heap_2, predicate)

assert.deepEqual(readHeap(_heap), {
  value: 7,
  left: {
    value: 4,
    left: {
      value: 3,
    },
    right: {
      value: 1,
    },
  },
  right: {
    value: 6,
    left: {
      value: 2,
    },
  },
})

_heap = setHeapNode(_heap, 5, predicate)

assert.deepEqual(readHeap(_heap), {
  value: 6,
  left: {
    value: 4,
    left: {
      value: 3,
    },
    right: {
      value: 1,
    },
  },
  right: {
    value: 5,
    left: {
      value: 2,
    },
  },
})

let _heap_00 = _heap.left.left

_heap = setHeapNode(_heap_00, 7, predicate)

assert.deepEqual(readHeap(_heap), {
  value: 7,
  left: {
    value: 6,
    left: {
      value: 4,
    },
    right: {
      value: 1,
    },
  },
  right: {
    value: 5,
    left: {
      value: 2,
    },
  },
})

_heap = addHeapNode(_heap, { value: 7, parent: null }, predicate)

assert.deepEqual(readHeap(_heap), {
  value: 7,
  left: {
    value: 6,
    left: {
      value: 4,
    },
    right: {
      value: 1,
    },
  },
  right: {
    value: 7,
    left: {
      value: 2,
    },
    right: {
      value: 5,
    },
  },
})

let _heap_10 = _heap.right.left

_heap = setHeapNode(_heap_10, 7, predicate)

assert.deepEqual(readHeap(_heap), {
  value: 7,
  left: {
    value: 6,
    left: {
      value: 4,
    },
    right: {
      value: 1,
    },
  },
  right: {
    value: 7,
    left: {
      value: 7,
    },
    right: {
      value: 5,
    },
  },
})

_heap = removeHeapNode(_heap, predicate)

assert.deepEqual(readHeap(_heap), {
  value: 7,
  left: {
    value: 6,
    left: {
      value: 4,
    },
    right: {
      value: 1,
    },
  },
  right: {
    value: 7,
    left: {
      value: 5,
    },
  },
})

_heap_00 = _heap.left.left

_heap = removeHeapNode(_heap_00, predicate)

assert.deepEqual(readHeap(_heap), {
  value: 7,
  left: {
    value: 6,
    left: {
      value: 5,
    },
    right: {
      value: 1,
    },
  },
  right: {
    value: 7,
  },
})

assert.deepEqual(toSortedArray(_heap, predicate), [7, 7, 6, 5, 1])

const last_leaf = findLastLeaf(_heap)

assert.equal(findLastLeaf(_heap).value, 1)

_heap = removeHeapNode(last_leaf, predicate)

// _heap = addHeapNode(_heap, { value: 7, parent: null }, predicate)

// assert.deepEqual(toSortedArray(_heap, predicate), [7, 7, 7, 6, 5, 1])

// _heap = addHeapNode(_heap, { value: 7, parent: null, children: [] }, predicate)

// assert.deepEqual(toArray(_heap), [7, 7, 6, 5, 4, 3, 2, 1, 0])
