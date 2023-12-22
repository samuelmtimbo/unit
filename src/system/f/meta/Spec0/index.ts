import { ObjectUpdateType } from '@_unit/unit/lib/ObjectUpdateType'
import { Unlisten } from '@_unit/unit/lib/types/Unlisten'
import { J } from '@_unit/unit/lib/types/interface/J'
import { $ } from '../../../../Class/$'
import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { Unit } from '../../../../Class/Unit'
import { System } from '../../../../system'
import { ID_SPEC_0 } from '../../../_ids'

export interface I<T> {
  unit: Unit
}

export interface O<T> {
  spec: J<any>
}

export default class Spec_<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['unit'],
        o: ['spec'],
      },
      {
        input: {
          unit: {
            ref: true,
          },
        },
        output: {
          spec: {
            ref: true,
          },
        },
      },
      system,
      ID_SPEC_0
    )
  }

  f({ unit }: I<T>, done: Done<O<T>>): void {
    const spec = new (class Object_ extends $ implements J<any> {
      get<K extends string & keyof T>(name: string): Promise<T[K]> {
        const _spec = unit.getSpec()

        return Promise.resolve(_spec[name])
      }

      set<K extends string & keyof T>(name: string, data: T[K]): Promise<void> {
        const _spec = unit.getSpec()

        _spec[name] = data

        return
      }

      delete<K extends string & keyof T>(name: string): Promise<void> {
        throw new Error('Method not implemented.')
      }

      hasKey<K extends string & keyof T>(name: string): Promise<boolean> {
        throw new Error('Method not implemented.')
      }

      keys(): Promise<string[]> {
        throw new Error('Method not implemented.')
      }

      pathGet(path: string[], name: string): Promise<any> {
        throw new Error('Method not implemented.')
      }

      pathSet(path: string[], name: string, data: any): Promise<void> {
        throw new Error('Method not implemented.')
      }

      pathDelete(path: string[], name: string): Promise<void> {
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
      __: string[] = ['J']
    })(this.__system)

    done({
      spec,
    })
  }
}
