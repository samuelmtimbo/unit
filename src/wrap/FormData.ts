import { $ } from '../Class/$'
import { ObjectUpdateType } from '../ObjectUpdateType'
import { InvalidKeyPathError } from '../exception/InvalidKeyPathError'
import { MethodNotImplementedError } from '../exception/MethodNotImplementedError'
import { System } from '../system'
import { Dict } from '../types/Dict'
import { Unlisten } from '../types/Unlisten'
import { FD } from '../types/interface/FD'
import { J } from '../types/interface/J'

export function wrapFormData(
  formData: FormData,
  system: System
): J<Dict<any>> & FD & $ {
  const _obj = new (class FormData_ extends $ implements J<Dict<any>>, FD {
    __: string[] = ['J', 'FD']

    async get(name: string): Promise<any> {
      const data = formData.get(name)

      return Promise.resolve(data)
    }

    async set(name: string, data: any): Promise<void> {
      formData.set(name, data)

      return
    }

    async delete(name: string): Promise<void> {
      formData.delete(name)

      return
    }

    async hasKey(name: string): Promise<boolean> {
      return formData.has(name)
    }

    async keys(): Promise<string[]> {
      const keys = []

      for (const key of formData.keys()) {
        keys.push(key)
      }

      return keys
    }

    deepGet(path: string[]): Promise<any> {
      if (path.length === 1) {
        return Promise.resolve(formData.get(path[0]))
      }

      throw new InvalidKeyPathError()
    }

    deepSet(path: string[], data: any): Promise<void> {
      if (path.length === 1) {
        formData.set(path[0], data)

        return
      }

      throw new InvalidKeyPathError()
    }

    deepDelete(path: string[]): Promise<void> {
      if (path.length === 1) {
        formData.delete(path[0])

        return
      }

      throw new InvalidKeyPathError()
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
      throw new MethodNotImplementedError()
    }

    append(name: string, value: any): void {
      formData.append(name, value)
    }

    raw() {
      return formData
    }
  })(system)

  return _obj
}
