import { $ } from '../Class/$'
import { ObjectUpdateType } from '../ObjectUpdateType'
import { System } from '../system'
import { Unlisten } from '../types/Unlisten'
import { FD } from '../types/interface/FD'
import { J } from '../types/interface/J'

export function wrapFormData(
  formData: FormData,
  system: System
): J<any> & FD & $ {
  const _obj = new (class Object_ extends $ implements J<any>, FD {
    __: string[] = ['J', 'FD']

    get(name: string): Promise<any> {
      const data = formData.get(name)

      return Promise.resolve(data)
    }

    set(name: string, data: any): Promise<void> {
      formData.set(name, data)

      return
    }

    delete(name: string): Promise<void> {
      throw new Error('Method not implemented.')
    }

    hasKey(name: string): Promise<boolean> {
      throw new Error('Method not implemented.')
    }

    keys(): Promise<string[]> {
      throw new Error('Method not implemented.')
    }

    deepGet(path: string[]): Promise<any> {
      throw new Error('Method not implemented.')
    }

    deepSet(path: string[], data: any): Promise<void> {
      throw new Error('Method not implemented.')
    }

    deepDelete(path: string[]): Promise<void> {
      throw new Error('Method not implemented.')
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
      throw new Error('Method not implemented.')
    }

    raw() {
      return formData
    }
  })(system)

  return _obj
}
