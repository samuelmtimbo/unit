import { Dict } from '../types/Dict'
import { IOOf } from '../types/IOOf'

export const emptyIO = <T>(i: T, o: T): IOOf<T> => ({
  input: i,
  output: o,
})

export const emptyObjIO = <T extends Dict<any>>(): IOOf<T> =>
  emptyIO({} as T, {} as T)
