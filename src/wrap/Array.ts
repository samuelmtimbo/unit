import { SharedRef } from '../SharefRef'
import { System } from '../system'
import { A } from '../types/interface/A'

export function wrapArray<T extends any[]>(
  data: SharedRef<T>,
  _system: System
): A<T> {
  return {
    append(a: T): Promise<void> {
      const b: any[] = []

      data.current.push(a)

      return
    },
    put(i: number, data: any): Promise<void> {
      throw new Error('Method not implemented.')
    },
    at(i: number): Promise<any> {
      throw new Error('Method not implemented.')
    },
    length(): Promise<number> {
      throw new Error('Method not implemented.')
    },
    indexOf(a: T): Promise<number> {
      throw new Error('Method not implemented.')
    },
  }
}
