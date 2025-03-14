import { unitBundleSpec } from '../bundle'
import { NOOP } from '../NOOP'
import { ObjectUpdateType } from '../ObjectUpdateType'
import { System } from '../system'
import { Specs } from '../types'
import { J } from '../types/interface/J'
import { UnitBundle } from '../types/UnitBundle'
import { UnitBundleSpec } from '../types/UnitBundleSpec'
import { UnitClass } from '../types/UnitClass'
import { Unlisten } from '../types/Unlisten'
import { deepDelete, deepGet, deepSet, hasKey, keys, set } from '../util/object'
import { remapSpecs } from './remapBundle'

export function bundleClass(
  Class: UnitClass,
  bundle: UnitBundleSpec,
  specs: Specs
): UnitBundle {
  const { unit } = bundle

  const { id, memory } = unit

  if (!bundle.specs) {
    bundle = unitBundleSpec(unit, specs)
  }

  class Bundle extends Class implements J<UnitBundleSpec> {
    static readonly __bundle = bundle

    constructor(system: System, push: boolean) {
      if (bundle.specs) {
        const map = system.injectSpecs(bundle.specs)

        remapSpecs(bundle, map)
      }

      super(system, id, push || !memory)

      if (memory) {
        this.restore(memory)
      }
    }

    async get<K extends keyof UnitBundleSpec>(
      name: K
    ): Promise<UnitBundleSpec[K]> {
      return bundle[name]
    }

    async set<K extends keyof UnitBundleSpec>(
      name: K,
      data: UnitBundleSpec[K]
    ): Promise<void> {
      return set(bundle, name, data)
    }

    async delete<K extends keyof UnitBundleSpec>(name: K): Promise<void> {
      delete bundle[name]
    }

    async hasKey(name: string): Promise<boolean> {
      return hasKey(bundle, name)
    }

    async keys(): Promise<string[]> {
      return keys(bundle)
    }

    async deepGet(path: string[]): Promise<any> {
      return deepGet(bundle, path)
    }

    async deepSet(path: string[], data: any): Promise<void> {
      return deepSet(bundle, path, data)
    }

    async deepDelete(path: string[]): Promise<void> {
      return deepDelete(bundle, path)
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
      return NOOP
    }
  }

  // @ts-ignore
  return Bundle
}
