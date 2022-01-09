import { Dict } from '../types/Dict'

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
  const result = {}
  for (const key in obj) {
    const value = obj[key]
    result[callback(value, key)] = value
  }
  return result
}

export function mapObjKeyKV<V>(
  obj: Dict<V>,
  callback: (key: string, value: V) => string
): Dict<V> {
  const result = {}
  for (const key in obj) {
    const value = obj[key]
    result[callback(key, value)] = value
  }
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
  let _acc = acc
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

export function filterObj<T>(
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
  return Object.keys(obj).length === 0
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
  return Object.keys(obj)[0]
}

export function clone<T>(a: T): T {
  if (typeof a !== 'object' || a === null) {
    return a
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
  return Object.keys(obj).length
}

export function set<T>(obj: object, k: string, v: any): void {
  obj[k] = v
}

export function get<T extends object, K extends keyof T>(obj: T, k: K): T[K] {
  return obj[k]
}
