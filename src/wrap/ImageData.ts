import { $ } from '../Class/$'
import { ObjectUpdateType } from '../ObjectUpdateType'
import { InvalidKeyPathError } from '../exception/InvalidKeyPathError'
import { ReadOnlyError } from '../exception/ObjectReadOnly'
import { System } from '../system'
import { Unlisten } from '../types/Unlisten'
import { ID } from '../types/interface/ID'
import { J } from '../types/interface/J'
import { wrapUint8Array } from './Array'

export function wrapImageData(imageData: ImageData, system: System): ID & J {
  const image = new (class ImageData_ extends $ implements J, ID {
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
      throw new ReadOnlyError('image data')
    }

    async delete(name: string): Promise<void> {
      throw new ReadOnlyError('image data')
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

      throw new InvalidKeyPathError()
    }

    deepSet(path: string[], data: any): Promise<void> {
      throw new ReadOnlyError('image data')
    }

    deepDelete(path: string[]): Promise<void> {
      throw new ReadOnlyError('image data')
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
      throw new ReadOnlyError('image data')
    }

    raw() {
      return imageData
    }
  })(system)

  return image
}
