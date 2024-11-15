import { Object_ } from './Object'
import { emptySpec, isSystemSpecId } from './client/spec'
import { evaluateDataValue } from './spec/evaluateDataValue'
import { remapSpec } from './spec/remapSpec'
import { Spec, Specs } from './types'
import { Dict } from './types/Dict'
import { GraphSpec } from './types/GraphSpec'
import { GraphSpecs } from './types/GraphSpecs'
import { R } from './types/interface/R'
import { clone } from './util/clone'
import { uuidNotIn } from './util/id'
import { deepGet } from './util/object'
import { weakMerge } from './weakMerge'

export class Registry implements R {
  specs: Specs
  specs_: Object_<Specs>
  specsCount: Dict<number>
  specsLock: Dict<boolean>

  constructor(
    specs: Specs,
    specs_?: Object_<Specs>,
    specsCount?: Dict<number>
  ) {
    this.specs = specs
    this.specs_ = specs_ ?? new Object_(specs)
    this.specsCount = specsCount ?? {}
    this.specsLock = {}
  }

  newSpecId(): string {
    return uuidNotIn(this.specs)
  }

  hasSpec(id: string): boolean {
    return !!this.specs[id]
  }

  emptySpec(partial: Partial<GraphSpec> = {}) {
    const id = partial.id ?? this.newSpecId()

    const spec = emptySpec({ ...partial, id })

    this.newSpec(spec)

    return spec
  }

  newSpec(spec: GraphSpec, specId?: string) {
    // console.log('newSpec', spec, specId)

    specId = specId ?? this.newSpecId()

    spec.id = specId

    this.specs_.set(specId, spec)

    return spec
  }

  getSpec(id: string): Spec {
    return this.specs[id]
  }

  setSpec(specId: string, spec: GraphSpec) {
    // console.log('Registry', 'setSpec', specId, spec)

    this.specs_.set(specId, spec)
  }

  injectSpecs(newSpecs: GraphSpecs): Dict<string> {
    // console.log('injectSpecs', newSpecs)

    const specIdMap: Dict<string> = {}
    const nextSpecs = {}

    const visited: Set<string> = new Set()

    const setSpec = (
      specId: string,
      spec: GraphSpec,
      visited: Set<string> = new Set()
    ) => {
      const { units } = spec

      if (visited.has(specId)) {
        return
      }

      visited.add(specId)

      for (const unitId in units) {
        const unit = units[unitId]

        if (this.hasSpec(unit.id)) {
          //
        } else {
          const spec = nextSpecs[unit.id]

          if (spec) {
            setSpec(unit.id, spec, visited)
          } else {
            //
          }
        }

        const { input = {} } = unit

        for (const name in input) {
          const { data } = input[name]

          if (data !== undefined) {
            const dataRef = evaluateDataValue(
              data,
              weakMerge(this.specs, nextSpecs),
              {}
            )

            for (const path of dataRef.ref ?? []) {
              const bundle = deepGet(dataRef.data, path)

              const spec = nextSpecs[bundle.unit.id]

              if (spec) {
                setSpec(spec.id, spec, visited)
              } else {
                //
              }
            }
          }
        }
      }

      this.specs_.set(specId, spec)
    }

    for (const specId in newSpecs) {
      const spec = newSpecs[specId]

      if (visited.has(specId)) {
        return
      }

      if (specIdMap[specId]) {
        return
      }

      let nextSpecId = specId
      let hasSpec = false

      while (this.hasSpec(nextSpecId)) {
        nextSpecId = this.newSpecId()

        hasSpec = true
      }

      visited.add(specId)

      if (hasSpec) {
        if (JSON.stringify(spec) === JSON.stringify(this.getSpec(specId))) {
          //
        } else {
          specIdMap[specId] = nextSpecId
        }
      }
    }

    const specSet = new Set<string>()

    for (const specId in newSpecs) {
      const spec = newSpecs[specId]

      const id = remapSpec(spec, specIdMap)

      if (this.hasSpec(id)) {
        if (JSON.stringify(spec) === JSON.stringify(this.getSpec(specId))) {
          //
        } else {
          nextSpecs[id] = spec
        }
      } else {
        nextSpecs[id] = spec
      }
    }

    for (const specId in nextSpecs) {
      const spec = nextSpecs[specId]

      setSpec(specId, spec, specSet)
    }

    return specIdMap
  }

  shouldFork(id: string): boolean {
    return (this.specsCount[id] ?? 0) > 1 || isSystemSpecId(this.specs, id)
  }

  forkSpec(spec: GraphSpec, specId?: string): [string, GraphSpec] {
    // console.log('forkSpec', spec, specId)

    if (this.shouldFork(spec.id)) {
      const clonedSpec = clone(spec)

      delete clonedSpec.system

      const { id: newSpecId } = this.newSpec(clonedSpec, specId)

      return [newSpecId, clonedSpec]
    } else {
      return [spec.id, spec]
    }
  }

  registerUnit(id: string): void {
    // console.log('registerUnit', { id })

    if (this.specsCount[id] === undefined) {
      this.specsCount[id] = 0
    }

    this.specsCount[id] += 1
  }

  unregisterUnit(id: string): void {
    // console.log('unregisterUnit', { id })

    if (!this.specsCount[id]) {
      throw new Error(`cannot unregister unit: no spec with id ${id}`)
    }

    this.specsCount[id] -= 1

    if (this.specsCount[id] === 0) {
      delete this.specsCount[id]

      const spec = this.specs[id]

      if (!isSystemSpecId(this.specs, id) && !this.specsLock[id]) {
        this.deleteSpec(id)
      }
    }
  }

  deleteSpec(id: string): void {
    // console.log('deleteSpec', id)

    this.specs_.delete(id)
  }

  lockSpec(id: string): void {
    this.specsLock[id] = true
  }

  unlockSpec(id: string): void {
    delete this.specsLock[id]
  }
}
