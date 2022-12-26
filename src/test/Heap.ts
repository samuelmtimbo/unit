import {
  addHeapNode,
  HeapSpec,
  parentHeap,
  readHeap,
  removeHeapNode,
  setHeapNode,
} from '../Heap'
import assert from '../util/assert'

const heap: HeapSpec<number> = {
  value: 6,
  children: [
    {
      value: 5,
      children: [
        { value: 4, children: [] },
        { value: 3, children: [] },
      ],
    },
    {
      value: 2,
      children: [
        { value: 1, children: [] },
        { value: 0, children: [] },
      ],
    },
  ],
}
const predicate = (a: number, b: number) => a >= b

let _heap = parentHeap(heap, null)

assert.deepEqual(readHeap(_heap), {
  value: 6,
  children: [
    {
      value: 5,
      children: [
        { value: 4, children: [] },
        { value: 3, children: [] },
      ],
    },
    {
      value: 2,
      children: [
        { value: 1, children: [] },
        { value: 0, children: [] },
      ],
    },
  ],
})

_heap = removeHeapNode(_heap, predicate)

assert.deepEqual(readHeap(_heap), {
  value: 5,
  children: [
    {
      value: 4,
      children: [
        {
          value: 2,
          children: [
            {
              value: 1,
              children: [],
            },
            {
              value: 0,
              children: [],
            },
          ],
        },
      ],
    },
    {
      value: 3,
      children: [],
    },
  ],
})

_heap = removeHeapNode(_heap, predicate)

assert.deepEqual(readHeap(_heap), {
  value: 4,
  children: [
    {
      value: 2,
      children: [
        {
          value: 1,
          children: [],
        },
        {
          value: 0,
          children: [],
        },
      ],
    },
    {
      value: 3,
      children: [],
    },
  ],
})

_heap = addHeapNode(_heap, { value: 7, parent: null, children: [] }, predicate)

assert.deepEqual(readHeap(_heap), {
  value: 7,
  children: [
    {
      value: 4,
      children: [
        {
          value: 2,
          children: [
            {
              value: 1,
              children: [],
            },
            {
              value: 0,
              children: [],
            },
          ],
        },
        {
          value: 3,
          children: [],
        },
      ],
    },
  ],
})

_heap = addHeapNode(_heap, { value: 6, parent: null, children: [] }, predicate)

assert.deepEqual(readHeap(_heap), {
  value: 7,
  children: [
    {
      value: 4,
      children: [
        {
          value: 2,
          children: [
            {
              value: 1,
              children: [],
            },
            {
              value: 0,
              children: [],
            },
          ],
        },
        {
          value: 3,
          children: [],
        },
      ],
    },
    { value: 6, children: [] },
  ],
})

const _heap_2 = _heap.children[0].children[0]

_heap = removeHeapNode(_heap_2, predicate)

assert.deepEqual(readHeap(_heap), {
  value: 7,
  children: [
    {
      value: 4,
      children: [
        {
          value: 1,
          children: [
            {
              value: 0,
              children: [],
            },
          ],
        },
        {
          value: 3,
          children: [],
        },
      ],
    },
    { value: 6, children: [] },
  ],
})

_heap = setHeapNode(_heap, 5, predicate)

assert.deepEqual(readHeap(_heap), {
  value: 6,
  children: [
    {
      value: 4,
      children: [
        {
          value: 1,
          children: [
            {
              value: 0,
              children: [],
            },
          ],
        },
        {
          value: 3,
          children: [],
        },
      ],
    },
    { value: 5, children: [] },
  ],
})

let _heap_000 = _heap.children[0].children[0].children[0]

_heap = setHeapNode(_heap_000, 7, predicate)

assert.deepEqual(readHeap(_heap), {
  value: 7,
  children: [
    {
      value: 1,
      children: [],
    },
    {
      value: 6,
      children: [
        {
          value: 4,
          children: [
            {
              value: 3,
              children: [],
            },
          ],
        },
        { value: 5, children: [] },
      ],
    },
  ],
})

_heap = addHeapNode(_heap, { value: 7, parent: null, children: [] }, predicate)

assert.deepEqual(readHeap(_heap), {
  value: 7,
  children: [
    {
      value: 1,
      children: [],
    },
    {
      value: 7,
      children: [
        {
          value: 6,
          children: [
            {
              value: 4,
              children: [
                {
                  value: 3,
                  children: [],
                },
              ],
            },
            { value: 5, children: [] },
          ],
        },
      ],
    },
  ],
})

let _heap_100 = _heap.children[1].children[0].children[0]

_heap = setHeapNode(_heap_100, 7, predicate)

assert.deepEqual(readHeap(_heap), {
  value: 7,
  children: [
    {
      value: 1,
      children: [],
    },
    {
      value: 7,
      children: [
        {
          value: 7,
          children: [
            {
              value: 6,
              children: [{ value: 5, children: [] }],
            },
            {
              value: 3,
              children: [],
            },
          ],
        },
      ],
    },
  ],
})

_heap = removeHeapNode(_heap, predicate)

assert.deepEqual(readHeap(_heap), {
  value: 7,
  children: [
    {
      value: 7,
      children: [
        {
          value: 6,
          children: [{ value: 5, children: [] }],
        },
        {
          value: 3,
          children: [],
        },
      ],
    },
    {
      value: 1,
      children: [],
    },
  ],
})

_heap_000 = _heap.children[0].children[0]

_heap = removeHeapNode(_heap_000, predicate)

assert.deepEqual(readHeap(_heap), {
  value: 7,
  children: [
    {
      value: 7,
      children: [
        {
          value: 5,
          children: [],
        },
        {
          value: 3,
          children: [],
        },
      ],
    },
    {
      value: 1,
      children: [],
    },
  ],
})
