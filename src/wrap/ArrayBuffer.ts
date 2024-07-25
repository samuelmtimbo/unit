import { $ } from '../Class/$'
import { System } from '../system'
import { AB } from '../types/interface/AB'

export function wrapArrayBuffer(
  arrayBuffer: ArrayBuffer,
  system: System
): AB & $ {
  const _array = new (class Array extends $ implements AB {
    __: string[] = ['AB']

    async arrayBuffer(): Promise<ArrayBuffer> {
      return arrayBuffer
    }

    raw() {
      return arrayBuffer
    }
  })(system)

  return _array
}
