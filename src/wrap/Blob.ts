import { $ } from '../Class/$'
import { System } from '../system'
import { B } from '../types/interface/B'

export function wrapBlob(blob: Blob, system: System): B & $ {
  const blob_ = new (class Blob_ extends $ implements B {
    __: string[] = ['B']

    async blob(): Promise<Blob> {
      return blob
    }

    async image(): Promise<any> {
      return blob
    }

    raw() {
      return blob
    }
  })(system)

  return blob_
}
