import { $ } from '../Class/$'
import { SharedRef } from '../SharefRef'
import { MethodNotImplementedError } from '../exception/MethodNotImplementedError'
import { System } from '../system'
import { Callback } from '../types/Callback'
import { A } from '../types/interface/A'
import { TA } from '../types/interface/TA'
import { V } from '../types/interface/V'

export function wrapSharedRefArrayInterface<T extends any[]>(
  data: SharedRef<T>
): A<T> {
  return {
    append(a: T): Promise<void> {
      data.current.push(a)

      return
    },
    put(i: number, data: any): Promise<void> {
      throw new MethodNotImplementedError()
    },
    at(i: number): Promise<any> {
      throw new MethodNotImplementedError()
    },
    length(): Promise<number> {
      throw new MethodNotImplementedError()
    },
    indexOf(a: T): Promise<number> {
      throw new MethodNotImplementedError()
    },
  }
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
      return array[i]
    }

    async length(): Promise<number> {
      return array.length
    }

    indexOf(a: T): Promise<number> {
      throw new MethodNotImplementedError()
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

    read(callback: Callback<number[]>): void {
      callback([...array])
    }

    write(data: number[], callback: Callback): void {
      array.set(data)

      callback()
    }

    append(a: number): Promise<void> {
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

    indexOf(a: number): Promise<number> {
      throw new MethodNotImplementedError()
    }

    set(array_: Uint8ClampedArray, offset: number): void {
      array.set(array_, offset)
    }

    raw() {
      return array
    }
  })(system)

  return _array
}
