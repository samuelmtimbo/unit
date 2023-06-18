export function forEach<V>(
  array: V[],
  callback: (value: V, index: number) => void
) {
  array.forEach(callback)
}

export function reduce<V, A>(
  array: V[],
  acc: A,
  callback: (acc: A, value: V, index: number) => A
): A {
  return array.reduce(callback, acc)
}

// https://stackoverflow.com/questions/1985260/javascript-array-rotate
export function rotate<T>(array: T[], count: number): T[] {
  const len = array.length >>> 0 // convert to uint
  count = count >> 0 // convert to int
  // convert count to value in range [0, len)
  count = ((count % len) + len) % len
  array.push(...array.splice(0, count))
  return array
}

export function at<T>(array: T[], index: number): T {
  return array[index]
}

export function removeAt<T>(array: T[], index: number): T[] {
  return array.splice(index, 1)
}

export function remove<T>(array: T[], element: T): T[] {
  const index = array.indexOf(element)
  return removeAt(array, index)
}

export function pull<T>(array: T[], element: T): T[] {
  const index = array.indexOf(element)
  array = removeAt(array, index)
  return array
}

export function push<T>(array: T[], element: T): T[] {
  array.push(element)
  return array
}

export function insert<T>(array: T[], element: T, at: number): T[] {
  array.splice(at, 0, element)
  return array
}

export function unshift<T>(array: T[], ...elements: T[]): number {
  return array.unshift(...elements)
}

export function lastIndex<T>(array: T[]): number {
  const _lastIndex = array.length - 1
  return _lastIndex
}

export function last<T>(array: T[]): T {
  const _lastIndex = lastIndex(array)
  const _last = array[_lastIndex]
  return _last
}

export function pop<T>(array: T[]): [T, T[]] {
  const l = array.length
  const last = array[l - 1]
  const rest = array.slice(0, l - 1)
  return [last, rest]
}

export function rangeArray(n): number[] {
  const array: number[] = []
  for (let i = 0; i < n; i++) {
    array.push(i)
  }
  return array
}

export function repeatArray<T>(n, value: T): T[] {
  const array: T[] = []
  for (let i = 0; i < n; i++) {
    array.push(value)
  }
  return array
}

export function matchAll<T>(
  a: T[],
  b: T[],
  match: (ai: T, bi: T) => boolean
): [number, number][] {
  const all: [number, number][] = []
  for (let i = 0; i < a.length; i++) {
    const ai = a[i]
    for (let j = 0; j < b.length; j++) {
      const bi = b[j]
      if (match(ai, bi)) {
        all.push([i, j])
      }
    }
  }
  return all
}

function indexSet<T>(a: T[]): Set<number> {
  return new Set(rangeArray(a.length))
}

// exclusive
export function matchAllExc<T>(
  a: T[],
  b: T[],
  match: (ai: T, bi: T) => boolean
): [number, number][][] {
  return _matchAllExc(a, b, indexSet(a), indexSet(b), [], match)
}

export function _matchAllExc<T>(
  a: T[],
  b: T[],
  _a: Set<number>,
  _b: Set<number>,
  _all: [number, number][],
  match: (ai: T, bi: T) => boolean
): [number, number][][] {
  let all: [number, number][][] = []
  for (let i of _a) {
    const ai = a[i]
    for (let j of _b) {
      const bi = b[j]
      if (match(ai, bi)) {
        const __a = new Set(_a)
        const __b = new Set(_b)
        __a.delete(i)
        __b.delete(j)
        const other = _matchAllExc(a, b, __a, __b, _all, match)
        if (other.length > 0) {
          for (const x of other) {
            all.push([[i, j], ...x])
          }
        } else {
          all.push([..._all, [i, j]])
        }
      }
    }
  }
  return all
}

export function reorder<A>(array: A[], element: A, to: number): void {
  remove(array, element)
  insert(array, element, to)
}
