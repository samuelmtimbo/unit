import { $ } from '../Class/$'
import { ObjectUpdateType } from '../ObjectUpdateType'
import { System } from '../system'
import { Unlisten } from '../types/Unlisten'
import { ID } from '../types/interface/ID'
import { J } from '../types/interface/J'
import { wrapUint8Array } from './Array'

export function wrapImageData(imageData: ImageData, system: System): ID & J {
  const image = new (class ImageObject extends $ implements J, ID {
    __: string[] = ['J', 'ID']

    imageData(): ImageData {
      return imageData
    }

    async get(name: string): Promise<any> {
      if (imageData[name] !== undefined) {
        if (name === 'data') {
          return wrapUint8Array(imageData.data, system)
        }

        return imageData[name]
      }
    }
    async set(name: string, data: any): Promise<void> {
      throw new Error('read only')
    }
    async delete(name: string): Promise<void> {
      throw new Error('read only')
    }
    async hasKey(name: string): Promise<boolean> {
      if (imageData[name] !== undefined) {
        return true
      }

      return false
    }
    async keys(): Promise<string[]> {
      return ['width', 'height', 'data', 'colorSpace']
    }
    deepGet(path: string[]): Promise<any> {
      if (path.length === 1) {
        return this.get(path[0])
      }

      throw new Error('invalid key path')
    }
    deepSet(path: string[], data: any): Promise<void> {
      throw new Error('read only')
    }
    deepDelete(path: string[]): Promise<void> {
      throw new Error('read only')
    }
    subscribe(
      path: string[],
      key: string,
      listener: (
        type: ObjectUpdateType,
        path: string[],
        key: string,
        data: any
      ) => void
    ): Unlisten {
      throw new Error('read only')
    }

    raw() {
      return imageData
    }
  })(system)

  return image
}
