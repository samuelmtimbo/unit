import { $ } from '../Class/$'
import { CodePathNotImplementedError } from '../exception/CodePathNotImplemented'
import { ObjectPathTooDeepError } from '../exception/ObjectPathTooDeep'
import { ReadOnlyError } from '../exception/ObjectReadOnly'
import { ObjectUpdateType } from '../ObjectUpdateType'
import { System } from '../system'
import { IM } from '../types/interface/IM'
import { J } from '../types/interface/J'
import { Unlisten } from '../types/Unlisten'

const KNOWN_IMAGE_PROPERTIES = ['naturalWidth', 'naturalHeight']

export function wrapImage(image: HTMLImageElement, system: System): IM & J {
  const stream = new (class Image extends $ implements IM, J {
    __: string[] = ['IM', 'J']

    get<K extends string>(name: K): any {
      if (KNOWN_IMAGE_PROPERTIES.includes(name)) {
        // @ts-ignore
        return image[name]
      }

      return false
    }

    set<K extends string>(name: K, data: any): void {
      throw new ReadOnlyError('image')
    }

    delete<K extends string>(name: K): void {
      throw new ReadOnlyError('image')
    }

    hasKey<K extends string>(name: K): boolean {
      if (KNOWN_IMAGE_PROPERTIES.includes(name)) {
        return true
      }

      return false
    }

    keys(): string[] {
      throw KNOWN_IMAGE_PROPERTIES
    }

    deepGet(path: string[]): any {
      if (path.length > 1) {
        throw new ObjectPathTooDeepError()
      }

      return this.get(path[0])
    }

    deepSet(path: string[], data: any): void {
      throw new ReadOnlyError('image')
    }

    deepDelete(path: string[]): void {
      throw new ReadOnlyError('image')
    }

    deepHas(path: string[]): boolean {
      try {
        this.deepGet(path)

        return true
      } catch (err) {
        return false
      }
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
      throw new CodePathNotImplementedError()
    }

    image(): any {
      return image
    }

    raw() {
      return image
    }
  })(system)

  return stream
}
