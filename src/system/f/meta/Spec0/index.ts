import { $ } from '../../../../Class/$'
import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { Unit } from '../../../../Class/Unit'
import { ObjectUpdateType } from '../../../../ObjectUpdateType'
import deepGet from '../../../../deepGet'
import { deepSet_ } from '../../../../deepSet'
import { MethodNotImplementedError } from '../../../../exception/MethodNotImplementedError'
import { System } from '../../../../system'
import { Unlisten } from '../../../../types/Unlisten'
import { J } from '../../../../types/interface/J'
import { hasKey } from '../../../../util/object'
import { ID_SPEC_0 } from '../../../_ids'
import { keys } from '../../object/Keys/f'

export interface I<T> {
  unit: Unit
}

export interface O<T> {
  spec: J<any>
}

export default class Spec_<T> extends Functional<I<T>, O<T>> {
  __: string[] = ['J']

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
        const _spec = unit.getSpec()

        delete _spec[name]

        return
      }

      async hasKey<K extends string & keyof T>(name: string): Promise<boolean> {
        const _spec = unit.getSpec()

        const has = hasKey(_spec, name)

        return has
      }

      async keys(): Promise<string[]> {
        const _spec = unit.getSpec()

        return keys(_spec)
      }

      deepGet(path: string[]): Promise<any> {
        const _spec = unit.getSpec()

        return deepGet(_spec, path)
      }

      deepSet(path: string[], data: any): Promise<void> {
        const _spec = unit.getSpec()

        deepSet_(_spec, path, data)

        return
      }

      deepDelete(path: string[]): Promise<void> {
        throw new MethodNotImplementedError()
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
    })(this.__system)

    done({
      spec,
    })
  }
}
