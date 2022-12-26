import { IOOf } from '../types/IOOf'

export const emptyIO = <T extends any>(i: T, o: T): IOOf<T> => ({
  input: i,
  output: o,
})
