export type HeapSpec<T, X = {}> = X & {
  value: T
  children: HeapSpec<T, X>[]
}

export type Heap<T> = HeapSpec<T, { parent: Heap<T> | null }>

export function traverseHeap<T>(
  heap: HeapSpec<T>,
  callback: (value: T) => void
) {
  const { value, children } = heap

  callback(value)

  for (const child of children) {
    traverseHeap(child, callback)
  }
}

export function toArray<T>(heap: HeapSpec<T>): T[] {
  const array = []

  traverseHeap(heap, (value) => {
    array.push(value)
  })

  return array
}

export function parentHeap<T>(
  heap: HeapSpec<T>,
  parent: Heap<T> | null = null
): Heap<T> {
  const { value, children } = heap

  const _children = []

  const _heap = {
    value,
    children: _children,
    parent,
  }

  for (const child of children) {
    const _child = parentHeap(child, _heap)

    _children.push(_child)
  }

  return _heap
}

export function readHeap<T>(heap: Heap<T>): HeapSpec<T> {
  const { value, children } = heap

  const _children = []

  const _heap = {
    value,
    children: _children,
  }

  for (const child of children) {
    if (child) {
      const _child = readHeap(child)

      _children.push(_child)
    }
  }

  return _heap
}

export function removeHeapNode<T>(
  heap: Heap<T>,
  predicate: (a: T, b: T) => boolean
): Heap<T> | null {
  const { value, parent, children } = heap

  const [first, second] = children

  heap.parent = null
  heap.children = []

  if (parent) {
    const i: number = +(parent.children[1] === heap)
    if (first && second) {
      if (predicate(first.value, second.value)) {
        parent.children[i] = first
        first.parent = parent
        addHeapNode(first, second, predicate)
      } else {
        parent.children[i] = second
        second.parent = parent
        addHeapNode(second, first, predicate)
      }
    } else if (first) {
      parent.children[i] = first
      first.parent = parent
    } else if (second) {
      parent.children[i] = second
      second.parent = parent
    } else {
      parent.children[i] = undefined
    }
    return findRoot(parent)
  } else {
    if (first && second) {
      if (predicate(first.value, second.value)) {
        first.parent = null
        addHeapNode(first, second, predicate)
        return first
      } else {
        second.parent = null
        addHeapNode(second, first, predicate)
        return second
      }
    } else if (first) {
      first.parent = null
      return first
    } else if (second) {
      second.parent = null
      return second
    } else {
      return null
    }
  }
}

export function addHeapNode<T>(
  root: Heap<T> | null,
  child: Heap<T>,
  predicate: (a: T, b: T) => boolean
): Heap<T> {
  if (root === null) {
    return child
  }

  const { value, parent, children } = root

  if (predicate(value, child.value)) {
    const [first, second] = children
    if (first && second) {
      if (predicate(first.value, second.value)) {
        addHeapNode(first, child, predicate)
      } else {
        addHeapNode(second, child, predicate)
      }
    } else if (first) {
      children[1] = child
      child.parent = root
    } else if (second) {
      children[0] = child
      child.parent = root
    } else {
      children[0] = child
      child.parent = root
    }
  } else {
    addHeapNode(child, root, predicate)
    if (parent) {
      const i = +(parent.children[1] === root)
      parent.children[i] = undefined
      addHeapNode(parent, child, predicate)
    }
  }
  return findRoot(root)
}

export function setHeapNode<T>(
  heap: Heap<T>,
  newValue: T,
  predicate: (a: T, b: T) => boolean
): Heap<T> | null {
  const { parent, children } = heap

  heap.value = newValue

  const [first, second] = children

  if (first && second) {
    const p0 = predicate(newValue, first.value)
    const p1 = predicate(newValue, second.value)
    if (p0 && p1) {
      refreshParent(heap, predicate)
    } else {
      removeHeapNode(heap, predicate)
      if (p0) {
        second.parent = null
        addHeapNode(second, heap, predicate)
      } else if (p1) {
        first.parent = null
        addHeapNode(first, heap, predicate)
      } else {
        if (predicate(first.value, second.value)) {
          first.parent = parent
          addHeapNode(first, heap, predicate)
        } else {
          second.parent = parent
          addHeapNode(second, heap, predicate)
        }
      }
    }
  } else if (first) {
    if (predicate(newValue, first.value)) {
      //
    } else {
      removeHeapNode(heap, predicate)
      addHeapNode(first, heap, predicate)
    }
  } else if (second) {
    if (predicate(newValue, second.value)) {
      //
    } else {
      removeHeapNode(heap, predicate)
      addHeapNode(second, heap, predicate)
    }
  } else {
    refreshParent(heap, predicate)
  }
  return findRoot(heap)
}

export function refreshParent<T>(heap: Heap<T>, predicate): void {
  const { parent } = heap

  if (parent) {
    heap.parent = null
    const i = +(parent.children[1] === heap)
    parent.children[i] = undefined
    addHeapNode(parent, heap, predicate)
  } else {
    //
  }
}

export function findRoot<T>(node: Heap<T>): Heap<T> {
  if (node.parent) {
    return findRoot(node.parent)
  } else {
    return node
  }
}
