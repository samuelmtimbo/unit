import { $ } from '../Class/$'
import { SharedRef } from '../SharefRef'
import { MethodNotImplementedError } from '../exception/MethodNotImplementedError'
import { System } from '../system'
import { A } from '../types/interface/A'

export function wrapSharedRefArrayInterface<T extends any[]>(
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

    append(a: T): Promise<void> {
      array.push(a)

      return
    }

    put(i: number, data: any): Promise<void> {
      throw new Error('Method not implemented.')
    }

    at(i: number): Promise<any> {
      throw new Error('Method not implemented.')
    }

    length(): Promise<number> {
      throw new Error('Method not implemented.')
    }

    indexOf(a: T): Promise<number> {
      throw new Error('Method not implemented.')
    }
  })(system)

  return _array
}

export function wrapUint8Array(
  array: Uint8Array,
  system: System
): A<number> & $ {
  const _array = new (class Array extends $ implements A<number> {
    __: string[] = ['A']

    append(a: number): Promise<void> {
      array[array.length] = a

      return
    }

    put(i: number, data: any): Promise<void> {
      throw new Error('Method not implemented.')
    }

    async at(i: number): Promise<any> {
      return array[i]
    }

    async length(): Promise<number> {
      return array.length
    }

    indexOf(a: number): Promise<number> {
      throw new Error('Method not implemented.')
    }
  })(system)

  return _array
}
