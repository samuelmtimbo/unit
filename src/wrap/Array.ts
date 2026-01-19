import { $ } from '../Class/$'
import { SharedRef } from '../SharefRef'
import { IndexOutOfBoundaryError } from '../exception/IndexOutOfBOundaryError'
import { MethodNotImplementedError } from '../exception/MethodNotImplementedError'
import { System } from '../system'
import { A } from '../types/interface/A'
import { TA } from '../types/interface/TA'
import { V } from '../types/interface/V'

export function wrapSharedRefArrayInterface<T extends any[]>(
  data: SharedRef<T>
): A<T> {
  const array: A<T> = {
    append(a: T): Promise<void> {
      data.current.push(a)

      return
    },
    put(i: number, data: any): Promise<void> {
      data.current[i] = data

      return Promise.resolve()
    },
    at(i: number): Promise<any> {
      if (i < 0 && i >= data.current.length) {
        throw new IndexOutOfBoundaryError()
      }

      return Promise.resolve(data.current[i])
    },
    length(): Promise<number> {
      return Promise.resolve(data.current.length)
    },
    indexOf(a: T): Promise<number> {
      return Promise.resolve(data.current.indexOf(a))
    },
    pop: function (): Promise<T> {
      if (!data.current.length) {
        throw new Error('empty array')
      }

      return Promise.resolve(data.current.pop())
    },
    shift: function (): Promise<T> {
      return Promise.resolve(data.current.shift())
    },
  }

  return array
}

export function wrapArray<T>(array: T[], system: System): A<T> & $ {
  const _array = new (class Array extends $ implements A<T> {
    __: string[] = ['A']

    async append(a: T): Promise<void> {
      array.push(a)
    }

    put(i: number, data: any): Promise<void> {
      throw new MethodNotImplementedError()
    }

    async at(i: number): Promise<T> {
      if (i < 0 && i >= array.length) {
        throw new IndexOutOfBoundaryError()
      }

      return array[i]
    }

    async length(): Promise<number> {
      return array.length
    }

    async indexOf(a: T): Promise<number> {
      throw new MethodNotImplementedError()
    }

    async pop(): Promise<T> {
      if (!array.length) {
        throw new Error('empty array')
      }

      return array.pop()
    }

    async shift(): Promise<T> {
      if (!array.length) {
        throw new Error('empty array')
      }

      return array.shift()
    }
  })(system)

  return _array
}

export function wrapUint8Array(
  array: Uint8Array | Uint8ClampedArray,
  system: System
): V<number[]> & A<number> & TA & $ {
  const _array = new (class Array
    extends $
    implements V<number[]>, A<number>, TA
  {
    __: string[] = ['A']

    buffer(): ArrayBuffer {
      return array.buffer
    }

    read(): number[] {
      return [...array]
    }

    write(data: number[]): void {
      array.set(data)
    }

    async append(a: number): Promise<void> {
      array[array.length] = a

      return
    }

    async put(i: number, data: any): Promise<void> {
      array[i] = data
    }

    async at(i: number): Promise<any> {
      return array[i]
    }

    async length(): Promise<number> {
      return array.length
    }

    async indexOf(a: number): Promise<number> {
      throw new MethodNotImplementedError()
    }

    async set(array_: Uint8ClampedArray, offset: number): Promise<void> {
      array.set(array_, offset)
    }

    async pop(): Promise<number> {
      if (array.length === 0) {
        throw new Error('empty array')
      }

      const last = array[array.length - 1]

      array = array.subarray(0, array.length - 1)

      return Promise.resolve(last)
    }

    shift(): Promise<number> {
      if (array.length === 0) {
        throw new Error('empty array')
      }

      const first = array[0]

      array = array.subarray(1, array.length)

      return Promise.resolve(first)
    }

    raw() {
      return array
    }
  })(system)

  return _array
}
