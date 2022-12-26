import { Unit } from '../Class/Unit'
import { Component } from '../client/component'
import { IOElement } from '../client/IOElement'
import { emptySpec, isSystemSpecId, newSpecId } from '../client/spec'
import { LocalStore } from '../client/store'
import { MethodNotImplementedError } from '../exception/MethodNotImplementedError'
import { noHost } from '../host/none'
import { Object_ } from '../Object'
import { SharedObject } from '../SharedObject'
import { API, BootOpt, System } from '../system'
import classes from '../system/_classes'
import components from '../system/_components'
import specs from '../system/_specs'
import { GraphSpec, GraphSpecs } from '../types'
import { Dict } from '../types/Dict'
import { IGamepad } from '../types/global/IGamepad'
import { IKeyboard } from '../types/global/IKeyboard'
import { IPointer } from '../types/global/IPointer'
import { $Component } from '../types/interface/async/$Component'
import { weakMerge } from '../types/weakMerge'
import { uuidNotIn } from '../util/id'
import { clone } from '../util/object'

export function boot(
  parent: System | null = null,
  api: API = noHost(),
  opt: BootOpt = {}
): System {
  const { path = '', specs: _specs = {} } = opt

  const keyboard: IKeyboard = {
    pressed: [],
    repeat: false,
  }
  const gamepads: IGamepad[] = []
  const pointers: Dict<IPointer> = {}

  const customEvent = new Set<string>()
  const context = []
  const input = {
    keyboard,
    gamepads,
    pointers,
  }

  const flag = {
    dragAndDrop: {},
    pointerCapture: {},
    spriteSheetMap: {},
  }

  const feature = {}

  const merged_specs = weakMerge(specs, _specs)

  const specs_ = new Object_(merged_specs)

  const system: System = {
    path,
    parent: null,
    mounted: false,
    animated: true,
    root: null,
    theme: 'dark',
    customEvent,
    input,
    context,
    specs_,
    specs: merged_specs,
    classes,
    components,
    graphs: [],
    specsCount: {},
    cache: flag,
    feature,
    foreground: {
      svg: undefined,
      canvas: undefined,
      app: undefined,
    },
    showLongPress: undefined,
    captureGesture: undefined,
    global: {
      ref: {},
      component: {},
    },
    api,
    boot: (opt: BootOpt) =>
      boot(system, api, {
        ...opt,
        specs: weakMerge(merged_specs, opt.specs ?? {}),
      }),
    graph: (system, opt) => new SharedObject(new LocalStore(system, 'local')),
    registerComponent: function (
      component: Component<IOElement, {}, $Component>
    ): string {
      throw new MethodNotImplementedError('registerComponent')
    },
    registerUnit: (unit: Unit) => {
      const { id } = unit

      system.specsCount[id] = system.specsCount[id] ?? 0
      system.specsCount[id]++

      if (system.parent) {
        system.parent.registerUnit(unit)
      }
    },
    forkSpec: (spec: GraphSpec) => {
      const clonedSpec = clone(spec)

      const { id: newSpecId } = system.newSpec(clonedSpec)

      delete clonedSpec.system

      return [newSpecId, clonedSpec]
    },
    getSpec: (id: string): GraphSpec => {
      return merged_specs[id]
    },
    hasSpec: (id: string) => {
      return !!merged_specs[id]
    },
    newSpecId: () => {
      return uuidNotIn(merged_specs)
    },
    emptySpec: () => {
      const id = newSpecId(merged_specs)

      const spec = emptySpec({ id })

      system.newSpec(spec)

      return spec
    },
    newSpec: (spec: GraphSpec) => {
      const specId = newSpecId(merged_specs)

      spec.id = specId

      // console.log('newSpec', { specId, spec })

      specs_.set(specId, spec)

      return spec
    },
    setSpec: (specId: string, spec: GraphSpec) => {
      // console.log('setSpec', { specId, spec })

      specs_.set(specId, spec)
    },
    injectSpecs: (newSpecs: GraphSpecs): Dict<string> => {
      const map_spec_id: Dict<string> = {}

      const visited: Set<string> = new Set()

      const _set = (spec_id, spec) => {
        if (visited.has(spec_id)) {
          return
        }

        if (map_spec_id[spec_id]) {
          return
        }

        let nextSpecId = spec_id
        let hasSpec = false

        while (system.hasSpec(nextSpecId)) {
          nextSpecId = system.newSpecId()

          hasSpec = true
        }

        const { units } = spec

        for (const unitId in units) {
          const unit = units[unitId]

          if (system.hasSpec(unit.id) && isSystemSpecId(specs, unit.id)) {
            //
          } else {
            const spec = newSpecs[unit.id]

            _set(unit.id, spec)
          }
        }

        visited.add(spec_id)

        if (hasSpec) {
          map_spec_id[spec_id] = nextSpecId
        }

        specs_.set(nextSpecId, spec)
      }

      for (const spec_id in newSpecs) {
        const spec = newSpecs[spec_id]

        _set(spec_id, spec)
      }

      return map_spec_id
    },
  }

  return system
}

export function destroy(system: System) {
  // TODO
}
