import deepMerge from '../system/f/object/DeepMerge/f'
import { keys } from '../system/f/object/Keys/f'
import { Dict } from '../types/Dict'
import { Key } from '../types/Key'

export function forEachObjVK<A>(
  obj: Dict<A>,
  callback: (value: A, key: string) => void
): void {
  for (const key in obj) {
    callback(obj[key], key)
  }
}

export function forEachObjKV<A>(
  obj: Dict<A>,
  callback: (key: string, value: A) => void
): void {
  for (const key in obj) {
    callback(key, obj[key])
  }
}

export function mapObjVK<A, B>(
  obj: Dict<A>,
  callback: (value: A, key: string) => B
): Dict<B> {
  const result = {}
  for (const key in obj) {
    result[key] = callback(obj[key], key)
  }
  return result
}

export function mapObjKV<A, B>(
  obj: Dict<A>,
  callback: (key: string, value: A) => B
): Dict<B> {
  const result = {}
  for (const key in obj) {
    result[key] = callback(key, obj[key])
  }
  return result
}

export function mapObjKey<V>(
  obj: Dict<V>,
  callback: (value: V, key: string) => string
): Dict<V> {
  return mapObjKeyVK(obj, callback)
}

export function mapObjKeyVK<V>(
  obj: Dict<V>,
  callback: (value: V, key: string) => string
): Dict<V> {
  const entries = []

  for (const key in obj) {
    const value = obj[key]

    const newKey = callback(value, key)

    entries.push([newKey, value])
  }

  const result: Dict<V> = fromEntries(entries)

  return result
}

export function mapObjKeyKV<V>(
  obj: Dict<V>,
  callback: (key: string, value: V) => string
): Dict<V> {
  const entries = []

  for (const key in obj) {
    const value = obj[key]

    const newKey = callback(key, value)

    entries.push([newKey, value])
  }

  const result: Dict<V> = fromEntries(entries)

  return result
}

export function someObj<A>(
  obj: Dict<A>,
  callback: (value: A, key: string) => boolean
): boolean {
  for (const key in obj) {
    if (callback(obj[key], key)) {
      return true
    }
  }
  return false
}

export function findObj<A>(
  obj: Dict<A>,
  callback: (value: A, key: string) => boolean
): A | undefined {
  for (const key in obj) {
    if (callback(obj[key], key)) {
      return obj[key]
    }
  }
  return undefined
}

export function reduceObj<V, A>(
  obj: Dict<V>,
  callback: (acc: A, value: V, key: string) => A,
  acc: A
): A {
  let _acc: A = acc
  for (const key in obj) {
    _acc = callback(_acc, obj[key], key)
  }
  return _acc
}

export function findKeyObjIndexed<A>(
  obj: Dict<A>,
  callback: (value: A, key: string) => boolean
): string | undefined {
  for (const key in obj) {
    if (callback(obj[key], key)) {
      return key
    }
  }
}

export function filterObj<T extends Dict<any>>(
  obj: T,
  callback: <K extends keyof T>(value: T[K], key: K) => boolean
): Partial<T> {
  const result: Partial<T> = {}
  for (const key in obj) {
    if (callback(obj[key], key)) {
      result[key] = obj[key]
    }
  }
  return result
}

export function isEmptyObject(obj: object): boolean {
  return keys(obj).length === 0
}

export function isNotEmptyObject(obj: object): boolean {
  return !isEmptyObject(obj)
}

export function extractFromObj<A>(obj: Dict<A>, keys: string[]): Dict<A> {
  const result = {}
  for (const key of keys) {
    if (obj[key]) {
      result[key] = obj[key]
    }
  }
  return result
}

export const getObjSingleKey = (obj: Dict<any>): string => {
  return keys(obj)[0]
}

export function clone<T>(a: T): T {
  if (typeof a !== 'object' || a === null) {
    return a
  }

  if (a instanceof Set) {
    return new Set(clone([...a])) as any
  }

  const _a = (Array.isArray(a) ? [] : {}) as T

  for (const k in a) {
    _a[k] = clone(a[k])
  }

  return _a
}

export function invertObj(obj: Dict<string>): Dict<string> {
  const _obj = {}
  for (const key in obj) {
    const value = obj[key]
    _obj[value] = key
  }
  return _obj
}

export function clearObj(obj: Dict<any>) {
  for (const key in obj) {
    delete obj[key]
  }
}

export function _keyCount(obj: Dict<any>): number {
  return keys(obj).length
}

export function set<T>(obj: object, k: Key, v: any): void {
  obj[k] = v
}

export function get<T extends object, K extends keyof T>(obj: T, k: K): T[K] {
  return obj[k]
}

export function deepSet(obj: object, path: Key[], value: any): void {
  let o = obj

  const last_index = path.length - 1

  if (last_index >= 0) {
    const last_p = path[last_index]

    for (let i = 0; i < last_index; i++) {
      const p = path[i]

      if (o[p] === undefined) {
        o[p] = {}
      }

      o = o[p]
    }

    o[last_p] = value
  }
}

export function deepDelete(obj: object, path: Key[]): void {
  let o = obj

  const last_index = path.length - 1

  if (last_index >= 0) {
    const last_p = path[last_index]

    for (let i = 0; i < last_index; i++) {
      const p = path[i]

      if (o[p] === undefined) {
        return
      }

      o = o[p]
    }

    delete o[last_p]
  }
}

export function deepDestroy(obj: object, path: Key[]): void {
  if (path.length === 1) {
    delete obj[path[0]]

    return
  }

  const [p, ...rest] = path

  const o = obj[p]

  deepDestroy(o, rest)

  if (isEmptyObject(o)) {
    delete obj[p]
  }
}

export function deepDeepMerge(obj: object, path: Key[], value: any): void {
  deepSet(obj, path, deepMerge(deepGetOrDefault(obj, path, {}), value))
}

export function deepGetOrDefault(obj: object, path: Key[], d: any): any {
  let o = obj

  for (let i = 0; i < path.length; i++) {
    const p = path[i]

    if (o[p] === undefined) {
      return d
    }

    o = o[p]
  }

  return o
}

export function ensureObj(obj: object, key: string | number) {
  return ensure(obj, key, () => ({}))
}

export function ensure(obj: object, key: string | number, generate: () => any) {
  let value = obj[key]

  if (value === undefined) {
    value = generate()

    obj[key] = value
  }

  return value
}

export function inplaceOmit(obj: object, key: string | number) {
  let value = obj[key]

  delete obj[key]

  return value
}

export function omit(obj: Dict<any>, key: string): Dict<any> {
  const { [key]: value, ...rest } = obj

  return rest
}

export function addKey(obj: object, key: string, value: any): any {
  if (obj[key] === undefined) {
    obj[key] = new Set()
  }

  obj[key].add(value)
}

export function pushKey(obj: object, key: string, value: any): any {
  if (obj[key] === undefined) {
    obj[key] = []
  }

  obj[key].push(value)
}

export function unshiftKey(obj: object, key: string, value: any): any {
  if (obj[key] === undefined) {
    obj[key] = []
  }

  obj[key].unshift(value)
}

export function incKey(obj: object, key: string): any {
  return incKeyFrom(obj, key, 0)
}

export function decKey(obj: object, key: string): any {
  return decKeyFrom(obj, key, 0)
}

export function deepIncFrom(obj: object, path: string[], from: number): any {
  let value = deepGetOrDefault(obj, path, undefined)

  if (value === undefined) {
    value = from
  }

  deepSet(obj, path, value + 1)
}

export function deepDecFrom(obj: object, path: string[], from: number): any {
  let value = deepGetOrDefault(obj, path, undefined)

  if (value === undefined) {
    value = from
  }

  deepSet(obj, path, value - 1)
}

export function incKeyFrom(obj: object, key: string, from: number): any {
  if (obj[key] === undefined) {
    obj[key] = from
  }

  obj[key]++
}

export function decKeyFrom(obj: object, key: string, from: number): any {
  if (obj[key] === undefined) {
    obj[key] = from
  }

  obj[key]--
}

export function makeTagObj<T>(keys: string[], value: T): Dict<T> {
  const obj = {}

  for (const key of keys) {
    obj[key] = value
  }

  return obj
}

export function entries<T>(obj: Dict<T>): [string, T][] {
  return Object.entries(obj)
}

export function values<T>(obj: Dict<T>): T[] {
  return Object.values(obj)
}

export function fromEntries<T>(entries: [string, T][]): Dict<T> {
  return Object.fromEntries(entries)
}

export function revertObj(obj: Dict<string>) {
  return fromEntries(
    entries(obj).map(([key, value]) => {
      return [value, key]
    })
  )
}

export function hasKey(obj: Dict<any>, key: string): boolean {
  return obj[key] !== undefined
}
