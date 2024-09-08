import { $ } from '../../../../Class/$'
import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { Graph } from '../../../../Class/Graph'
import { Unit } from '../../../../Class/Unit'
import { ObjectUpdateType } from '../../../../ObjectUpdateType'
import { CodePathNotImplementedError } from '../../../../exception/CodePathNotImplemented'
import { MethodNotImplementedError } from '../../../../exception/MethodNotImplementedError'
import { System } from '../../../../system'
import { Dict } from '../../../../types/Dict'
import { Key } from '../../../../types/Key'
import { Unlisten } from '../../../../types/Unlisten'
import { J } from '../../../../types/interface/J'
import { deepGet, hasKey } from '../../../../util/object'
import { ID_SPEC_0 } from '../../../_ids'
import { keys } from '../../object/Keys/f'

export interface I {
  unit: Unit
}

export interface O {
  spec: J<Dict<any>>
}

export default class Spec_ extends Functional<I, O> {
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

  f({ unit }: I, done: Done<O>): void {
    const spec: J<Dict<any>> = new (class Object_
      extends $
      implements J<Dict<any>>
    {
      get(name: Key): Promise<any> {
        const _spec = unit.getSpec()

        return Promise.resolve(_spec[name])
      }

      set(name: Key, data: any): Promise<void> {
        const _spec = unit.getSpec()

        _spec[name] = data

        return
      }

      delete(name: Key): Promise<void> {
        const _spec = unit.getSpec()

        delete _spec[name]

        return
      }

      async hasKey(name: string): Promise<boolean> {
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

        if (path[0] === 'metadata') {
          const [_, ...rest] = path

          ;(unit as Graph).setMetadata(rest, data)
        } else {
          throw new CodePathNotImplementedError()
        }

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
