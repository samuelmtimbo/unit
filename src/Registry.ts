import { Object_ } from './Object'
import { emptySpec, isSystemSpecId, newSpecId } from './client/spec'
import { Spec, Specs } from './types'
import { Dict } from './types/Dict'
import { GraphSpec } from './types/GraphSpec'
import { GraphSpecs } from './types/GraphSpecs'
import { R } from './types/interface/R'
import { uuidNotIn } from './util/id'
import { clone } from './util/object'

export class Registry implements R {
  specs: Specs
  specs_: Object_<Specs>
  specsCount: Dict<number> = {}

  constructor(specs: Specs) {
    this.specs = specs
    this.specs_ = new Object_(specs)
  }

  newSpecId(): string {
    return uuidNotIn(this.specs)
  }

  hasSpec(id: string): boolean {
    return !!this.specs[id]
  }

  emptySpec() {
    const id = newSpecId(this.specs)

    const spec = emptySpec({ id })

    this.newSpec(spec)

    return spec
  }

  newSpec(spec: GraphSpec, specId?: string) {
    // console.log('newSpec', spec, specId)

    specId = specId ?? newSpecId(this.specs)

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

    const mapSpecId: Dict<string> = {}

    const visited: Set<string> = new Set()

    const _set = (specId, spec) => {
      if (visited.has(specId)) {
        return
      }

      if (mapSpecId[specId]) {
        return
      }

      let nextSpecId = specId
      let hasSpec = false

      while (this.hasSpec(nextSpecId)) {
        nextSpecId = this.newSpecId()

        hasSpec = true
      }

      visited.add(specId)

      const { units } = spec

      for (const unitId in units) {
        const unit = units[unitId]

        if (this.hasSpec(unit.id) && !!this.specs[unit.id]) {
          //
        } else {
          const spec = newSpecs[unit.id]

          _set(unit.id, spec)
        }
      }

      if (hasSpec) {
        // TODO spec equality
        if (JSON.stringify(spec) === JSON.stringify(this.getSpec(specId))) {
          //
        } else {
          // TODO
          mapSpecId[specId] = nextSpecId

          this.specs_.set(specId, spec)
        }
      } else {
        this.specs_.set(specId, spec)
      }

      // this.specs_.set(nextSpecId, spec) // TODO
    }

    for (const specId in newSpecs) {
      const spec = newSpecs[specId]

      _set(specId, spec)
    }

    return mapSpecId
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

      if (!isSystemSpecId(this.specs, id)) {
        this.deleteSpec(id)
      }
    }
  }

  deleteSpec(id: string): void {
    // console.log('deleteSpec', id)

    this.specs_.delete(id)
  }
}
