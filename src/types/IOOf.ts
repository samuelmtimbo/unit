import { forEachObjKV, forEachObjVK } from '../util/object'
import { Dict } from './Dict'
import { IO } from './IO'

export type IOOf<T = any> = {
  input: T
  output: T
}

export type _IOOf<T = any> = {
  input?: T
  output?: T
}

export type KindOf<T = any> = {
  data: T
  ref: T
}

export type IOKindOf<T = any> = IOOf<KindOf<T>>

export function forIO<T>(
  data: _IOOf<T>,
  callback: (type: IO, data: T) => void
): void {
  if (data.input !== undefined) {
    callback('input', data.input)
  }
  if (data.output !== undefined) {
    callback('output', data.output)
  }
}

export function forIOObjKV<T>(
  data: _IOOf<Dict<T>>,
  callback: (type: IO, key: string, data: T) => void
): void {
  forIO(data, (type, data) => {
    forEachObjKV(data, (key, value) => {
      callback(type, key, value)
    })
  })
}

export function forIOObjVK<T>(
  data: _IOOf<Dict<T>>,
  callback: (type: IO, data: T, key: string) => void
): void {
  forIO(data, (type, data) => {
    forEachObjVK(data, (value, key) => {
      callback(type, value, key)
    })
  })
}
