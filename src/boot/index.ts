import { Component } from '../client/component'
import { styleToCSS } from '../client/id/styleToCSS'
import { IOElement } from '../client/IOElement'
import { appendRootStyle, removeRootStyle } from '../client/render/attachStyle'
import { emptySpec, newSpecId } from '../client/spec'
import { LocalStore } from '../client/store'
import { EventEmitter } from '../EventEmitter'
import { noHost } from '../host/none'
import { NOOP } from '../NOOP'
import { Object_ } from '../Object'
import { SharedObject } from '../SharedObject'
import { API, BootOpt, System } from '../system'
import { Style } from '../system/platform/Props'
import classes from '../system/_classes'
import components from '../system/_components'
import specs from '../system/_specs'
import { GraphSpec, GraphSpecs } from '../types'
import { Dict } from '../types/Dict'
import { IGamepad } from '../types/global/IGamepad'
import { IKeyboard } from '../types/global/IKeyboard'
import { IPointer } from '../types/global/IPointer'
import { $Component } from '../types/interface/async/$Component'
import { Unlisten } from '../types/Unlisten'
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

  const emitter = parent ? parent.emitter : new EventEmitter()

  const componentLocalToRemote: Dict<string> = {}
  const componentRemoteToLocal: Dict<string> = {}

  const system: System = {
    path,
    parent,
    emitter,
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
    global: parent
      ? parent.global
      : {
          ref: {},
          component: {},
        },
    api,
    boot: (opt: BootOpt) => boot(system, api, opt),
    graph: (system, opt) => new SharedObject(new LocalStore(system, 'local')),
    registerComponent: function (
      component: Component<IOElement, {}, $Component>
    ): string {
      const id = uuidNotIn(system.global.component)

      system.global.component[id] = component

      return id
    },
    registerUnit: (id: string) => {
      system.specsCount[id] = system.specsCount[id] ?? 0
      system.specsCount[id]++

      if (system.parent) {
        system.parent.registerUnit(id)
      }
    },
    unregisterUnit: function (id: string): void {
      system.specsCount[id]--

      if (system.parent) {
        system.parent.unregisterUnit(id)
      }
    },
    forkSpec: (spec: GraphSpec) => {
      if (system.specsCount[spec.id] > 0) {
        const clonedSpec = clone(spec)

        const { id: newSpecId } = system.newSpec(clonedSpec)

        delete clonedSpec.system

        return [newSpecId, clonedSpec]
      } else {
        system.setSpec(spec.id, spec)

        return [spec.id, spec]
      }
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
      // console.log('injectSpecs', { newSpecs })
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

          if (system.hasSpec(unit.id) && !!specs[unit.id]) {
            //
          } else {
            const spec = newSpecs[unit.id]

            _set(unit.id, spec)
          }
        }

        visited.add(spec_id)

        if (hasSpec) {
          if (
            JSON.stringify(spec) === JSON.stringify(system.getSpec(spec_id))
          ) {
            //
          } else {
            // TODO
            map_spec_id[spec_id] = nextSpecId

            specs_.set(spec_id, spec)
          }
        } else {
          specs_.set(spec_id, spec)
        }

        // specs_.set(nextSpecId, spec) // TODO
      }

      for (const spec_id in newSpecs) {
        const spec = newSpecs[spec_id]

        _set(spec_id, spec)
      }

      return map_spec_id
    },
    injectPrivateCSSClass: function (
      globalId: string,
      className: string,
      style: Style
    ): Unlisten {
      if (system.root) {
        if (!system.global.component[globalId]) {
          throw new Error('Component not found.')
        }

        const css = `${styleToCSS(style)}`

        appendRootStyle(system, css)

        return () => {
          removeRootStyle(system, css)
        }
      } else {
        return NOOP
      }
    },
    registerRemoteComponent: function (
      globalId: string,
      remoteGlobalId: string
    ): void {
      const component = system.global.component[globalId]

      if (!component) {
        throw new Error('Component not found.')
      }

      componentLocalToRemote[globalId] = remoteGlobalId
      componentRemoteToLocal[remoteGlobalId] = globalId

      emitter.emit(remoteGlobalId, component)
    },
    getRemoteComponent: function (remoteId: string): Component {
      const localId = componentRemoteToLocal[remoteId]

      if (!localId) {
        return undefined
      }

      return system.global.component[localId]
    },
  }

  return system
}

export function destroy(system: System) {
  const { graphs } = system

  for (const graph of graphs) {
    graph.destroy()
  }
  // TODO
}
