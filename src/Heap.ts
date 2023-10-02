export type Heap<T> = {
  value: T
  left?: Heap<T> | null
  right?: Heap<T> | null
  parent?: Heap<T> | null
}

export function bffHeap<T>(
  heap: Heap<T>,
  callback: (heap: Heap<T>) => void,
  queue: Heap<T>[] = []
): void {
  queue.push(heap)

  while (queue.length) {
    const node = queue.shift()

    callback(node)

    node.left && queue.push(node.left)
    node.right && queue.push(node.right)
  }
}

export function findInsertionPoint<T>(heap: Heap<T>) {
  let result = null

  bffHeap(heap, (node) => {
    if (!node.left || !node.right) {
      if (!result) {
        result = node
      }
    }
  })

  return result
}

export function findLastLeaf<T>(heap: Heap<T>) {
  let result = null

  bffHeap(heap, (node) => {
    result = node
  })

  return result
}

export function traverseHeap<T>(heap: Heap<T>, callback: (value: T) => void) {
  const { value, left, right } = heap

  callback(value)

  left && traverseHeap(left, callback)
  right && traverseHeap(right, callback)
}

export function toArray<T>(heap: Heap<T>): T[] {
  const array = []

  traverseHeap(heap, (value) => {
    if (value !== undefined) {
      array.push(value)
    }
  })

  return array
}

export function toSortedArray<T>(
  heap: Heap<T>,
  predicate: (a: T, b: T) => boolean
): T[] {
  const array = []

  do {
    array.push(heap.value)

    const lastLeaf = findLastLeaf(heap)

    heap = removeHeapNode(lastLeaf, predicate)

    if (heap) {
      heap.value = lastLeaf.value

      bubbleDown(heap, predicate)
    }

    heap = heap && findRoot(heap)
  } while (heap)

  return array
}

export async function asyncToSortedArray<T>(
  heap: Heap<T>,
  predicate: (a: T, b: T) => Promise<boolean>
): Promise<T[]> {
  const array = []

  do {
    array.push(heap.value)

    const lastLeaf = findLastLeaf(heap)

    heap = await asyncRemoveHeapNode(lastLeaf, predicate)

    if (heap) {
      heap.value = lastLeaf.value

      await asyncBubbleDown(heap, predicate)
    }

    heap = heap && findRoot(heap)
  } while (heap)

  return array
}

export function parentHeap<T>(
  heap: Heap<T>,
  parent: Heap<T> | null = null
): Heap<T> {
  const { value, left, right } = heap

  heap.parent = parent

  if (left) {
    parentHeap(left, heap)
  }

  if (right) {
    parentHeap(right, heap)
  }

  return heap
}

export function readHeap<T>(heap: Heap<T>): Heap<T> {
  const { value, left, right } = heap

  const _heap: Heap<T> = {
    value,
  }

  if (left) {
    const _child = readHeap(left)

    _heap.left = _child
  }
  if (right) {
    const _child = readHeap(right)

    _heap.right = _child
  }

  return _heap
}

export function removeHeapNode<T>(
  heap: Heap<T>,
  predicate: (a: T, b: T) => boolean
): Heap<T> | null {
  // console.log('Graph', 'removeHeapNode', heap)

  const { parent, left, right } = heap

  const root = findRoot(heap)

  const lastLeaf = findLastLeaf(root)

  if (lastLeaf.parent) {
    const isLastLeafLeft = lastLeaf.parent.left === lastLeaf

    if (isLastLeafLeft) {
      lastLeaf.parent.left = null
    } else {
      lastLeaf.parent.right = null
    }
  }

  heap.parent = null
  heap.left = null
  heap.right = null

  if (lastLeaf === root) {
    return null
  }

  if (lastLeaf === heap) {
    return (parent && findRoot(parent)) || null
  }

  lastLeaf.parent = parent

  if (parent) {
    const isLeft: boolean = parent.left === heap

    if (isLeft) {
      parent.left = lastLeaf
    } else {
      parent.right = lastLeaf
    }

    bubbleUp(lastLeaf, predicate)
  } else {
    if (lastLeaf !== left) {
      lastLeaf.left = left

      left && (left.parent = lastLeaf)
    }

    if (lastLeaf !== right) {
      lastLeaf.right = right

      right && (right.parent = lastLeaf)
    }

    bubbleDown(lastLeaf, predicate)
  }

  return findRoot(lastLeaf)
}

export async function asyncRemoveHeapNode<T>(
  heap: Heap<T>,
  predicate: (a: T, b: T) => Promise<boolean>
): Promise<Heap<T> | null> {
  const { parent, left, right } = heap

  const root = findRoot(heap)

  const lastLeaf = findLastLeaf(root)

  if (lastLeaf.parent) {
    const isLastLeafLeft = lastLeaf.parent.left === lastLeaf

    if (isLastLeafLeft) {
      lastLeaf.parent.left = null
    } else {
      lastLeaf.parent.right = null
    }
  }

  heap.parent = null
  heap.left = null
  heap.right = null

  if (lastLeaf === root) {
    return null
  }

  if (lastLeaf === heap) {
    return (parent && findRoot(parent)) || null
  }

  lastLeaf.parent = parent

  if (parent) {
    const isLeft: boolean = parent.left === heap

    if (isLeft) {
      parent.left = lastLeaf
    } else {
      parent.right = lastLeaf
    }

    await asyncBubbleUp(lastLeaf, predicate)
  } else {
    if (lastLeaf !== left) {
      lastLeaf.left = left

      left && (left.parent = lastLeaf)
    }

    if (lastLeaf !== right) {
      lastLeaf.right = right

      right && (right.parent = lastLeaf)
    }

    await asyncBubbleDown(lastLeaf, predicate)
  }

  return findRoot(lastLeaf)
}

export function bubbleDown<T>(
  root: Heap<T>,
  predicate: (a: T, b: T) => boolean
) {
  const { parent, value, left, right } = root

  const gtLeft = !left || predicate(value, left.value)
  const gtRight = !right || predicate(value, right.value)

  const bubbleDownRight = () => {
    root.left = right.left

    right.left && (right.left.parent = root)

    root.right = right.right

    right.right && (right.right.parent = root)

    right.left = left

    left.parent = right

    right.right = root

    root.parent = right

    right.parent = parent

    if (parent) {
      const isLeft = parent.left === root

      if (isLeft) {
        parent.left = right
      } else {
        parent.right = right
      }
    }

    bubbleDown(root, predicate)
  }

  const bubbleDownLeft = () => {
    root.left = left.left

    left.left && (left.left.parent = root)

    root.right = left.right

    left.right && (left.right.parent = root)

    root.parent = left

    left.left = root
    left.right = right

    left.parent = parent

    if (parent) {
      const isLeft = parent.left === root

      if (isLeft) {
        parent.left = left
      } else {
        parent.right = left
      }
    }

    right && (right.parent = left)

    bubbleDown(root, predicate)
  }

  if (left && right) {
    if (gtLeft && gtRight) {
      //
    } else if (gtLeft) {
      bubbleDownRight()
    } else if (gtRight) {
      bubbleDownLeft()
    } else {
      if (predicate(left.value, right.value)) {
        bubbleDownLeft()
      } else {
        bubbleDownRight()
      }
    }
  } else if (left) {
    if (gtLeft) {
      //
    } else {
      bubbleDownLeft()
    }
  } else {
    return null
  }
}

export async function asyncBubbleDown<T>(
  root: Heap<T>,
  predicate: (a: T, b: T) => Promise<boolean>
) {
  const { parent, value, left, right } = root

  const gtLeft = !left || (await predicate(value, left.value))
  const gtRight = !right || (await predicate(value, right.value))

  const asyncBubbleDownRight = async () => {
    root.left = right.left

    right.left && (right.left.parent = root)

    root.right = right.right

    right.right && (right.right.parent = root)

    right.left = left

    left.parent = right

    right.right = root

    root.parent = right

    right.parent = parent

    if (parent) {
      const isLeft = parent.left === root

      if (isLeft) {
        parent.left = right
      } else {
        parent.right = right
      }
    }

    await asyncBubbleDown(root, predicate)
  }

  const asyncBubbleDownLeft = async () => {
    root.left = left.left

    left.left && (left.left.parent = root)

    root.right = left.right

    left.right && (left.right.parent = root)

    root.parent = left

    left.left = root
    left.right = right

    left.parent = parent

    if (parent) {
      const isLeft = parent.left === root

      if (isLeft) {
        parent.left = left
      } else {
        parent.right = left
      }
    }

    right && (right.parent = left)

    await asyncBubbleDown(root, predicate)
  }

  if (left && right) {
    if (gtLeft && gtRight) {
      //
    } else if (gtLeft) {
      await asyncBubbleDownRight()
    } else if (gtRight) {
      await asyncBubbleDownLeft()
    } else {
      if (await predicate(left.value, right.value)) {
        await asyncBubbleDownLeft()
      } else {
        await asyncBubbleDownRight()
      }
    }
  } else if (left) {
    if (gtLeft) {
      //
    } else {
      await asyncBubbleDownLeft()
    }
  } else {
    return null
  }
}

export function bubbleUp<T>(
  child: Heap<T>,
  predicate: (a: T, b: T) => boolean
) {
  if (child.parent && predicate(child.value, child.parent.value)) {
    const { parent, left, right } = child

    child.parent = parent.parent

    const isLeft = parent.left === child

    if (parent.parent) {
      const isParentLeft = parent.parent.left === parent

      if (isParentLeft) {
        parent.parent.left = child
      } else {
        parent.parent.right = child
      }
    }

    parent.parent = child

    if (isLeft) {
      child.left = parent
      child.right = parent.right

      if (parent.right) {
        parent.right.parent = child
      }
    } else {
      child.right = parent
      child.left = parent.left

      if (parent.left) {
        parent.left.parent = child
      }
    }

    parent.left = left
    if (left) {
      left.parent = parent
    }

    parent.right = right
    if (right) {
      right.parent = parent
    }

    bubbleUp(child, predicate)

    return parent
  }

  return null
}

export async function asyncBubbleUp<T>(
  child: Heap<T>,
  predicate: (a: T, b: T) => Promise<boolean>
) {
  if (child.parent && (await predicate(child.value, child.parent.value))) {
    const { parent, left, right } = child

    child.parent = parent.parent

    const isLeft = parent.left === child

    if (parent.parent) {
      const isParentLeft = parent.parent.left === parent

      if (isParentLeft) {
        parent.parent.left = child
      } else {
        parent.parent.right = child
      }
    }

    parent.parent = child

    if (isLeft) {
      child.left = parent
      child.right = parent.right

      if (parent.right) {
        parent.right.parent = child
      }
    } else {
      child.right = parent
      child.left = parent.left

      if (parent.left) {
        parent.left.parent = child
      }
    }

    parent.left = left
    if (left) {
      left.parent = parent
    }

    parent.right = right
    if (right) {
      right.parent = parent
    }

    await asyncBubbleUp(child, predicate)

    return parent
  }

  return null
}

export function addHeapNode<T>(
  root: Heap<T> | null,
  child: Heap<T>,
  predicate: (a: T, b: T) => boolean
): Heap<T> {
  if (root === null) {
    return child
  }

  while (child) {
    const nextChild = removeHeapNode(child, predicate)

    const lastLeaf = findInsertionPoint(root)

    if (!lastLeaf.left) {
      lastLeaf.left = child
    } else {
      lastLeaf.right = child
    }

    child.parent = lastLeaf

    bubbleUp(child, predicate)

    child = nextChild
  }

  return findRoot(root)
}

export async function asyncAddHeapNode<T>(
  root: Heap<T> | null,
  child: Heap<T>,
  predicate: (a: T, b: T) => Promise<boolean>
): Promise<Heap<T>> {
  if (root === null) {
    return child
  }

  while (child) {
    const nextChild = await asyncRemoveHeapNode(child, predicate)

    const lastLeaf = findInsertionPoint(root)

    if (!lastLeaf.left) {
      lastLeaf.left = child
    } else {
      lastLeaf.right = child
    }

    child.parent = lastLeaf

    await asyncBubbleUp(child, predicate)

    child = nextChild
  }

  return findRoot(root)
}

export function setHeapNode<T>(
  heap: Heap<T>,
  newValue: T,
  predicate: (a: T, b: T) => boolean
): Heap<T> | null {
  const { parent, left, right } = heap

  heap.value = newValue

  if (parent) {
    if (predicate(parent.value, newValue)) {
      bubbleDown(heap, predicate)
    } else {
      bubbleUp(heap, predicate)
    }
  } else {
    bubbleDown(heap, predicate)
  }

  return findRoot(heap)
}

export function findRoot<T>(node: Heap<T>): Heap<T> {
  if (node.parent) {
    return findRoot(node.parent)
  } else {
    return node
  }
}
