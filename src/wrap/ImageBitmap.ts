import { $ } from '../Class/$'
import { System } from '../system'
import { IB } from '../types/interface/IB'

export function wrapImageBitmap(imageBitmap: ImageBitmap, system: System): IB {
  const stream = new (class Stream extends $ implements IB {
    __: string[] = ['IB']

    async imageBitmap() {
      return imageBitmap
    }

    async image(): Promise<any> {
      return imageBitmap
    }
  })(system)

  return stream
}
