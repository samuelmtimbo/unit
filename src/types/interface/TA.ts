import { A } from './A'

export interface TA extends A {
  set(array: Uint8ClampedArray, offset: number): void
  buffer(): ArrayBuffer
}
