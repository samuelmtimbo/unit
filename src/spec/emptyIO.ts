import { IOOf } from '../types/IOOf'

export const emptyIO = <T>(i: T, o: T): IOOf<T> => ({
  input: i,
  output: o,
})
