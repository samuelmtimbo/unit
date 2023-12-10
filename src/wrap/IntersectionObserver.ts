import { $ } from '../Class/$'
import { MethodNotImplementedError } from '../exception/MethodNotImplementedError'
import { System } from '../system'
import { Callback } from '../types/Callback'
import { Unlisten } from '../types/Unlisten'
import { A } from '../types/interface/A'
import { OB } from '../types/interface/OB'

export function wrapIntersectionObserver(
  intersectionObserver: IntersectionObserver,
  system: System
): OB & $ {
  const observer = new (class IntersectionObserver_ extends $ implements OB {
    __: string[] = ['OB']

    observe(element: Element, callback: Callback): Unlisten {
      intersectionObserver.observe(element)

      return () => {
        intersectionObserver.unobserve(element)
      }
    }
  })(system)

  return observer
}

export function wrapUint8Array(
  array: Uint8Array | Uint8ClampedArray,
  system: System
): A<number> & $ {
  const _array = new (class Array extends $ implements A<number> {
    __: string[] = ['A']

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

    raw() {
      return array
    }
  })(system)

  return _array
}
