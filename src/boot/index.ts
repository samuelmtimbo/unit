import { API } from '../API'
import { Graph } from '../Class/Graph'
import { Component } from '../client/component'
import { styleToCSS } from '../client/id/styleToCSS'
import { IOElement } from '../client/IOElement'
import { appendRootStyle, removeRootStyle } from '../client/render/attachStyle'
import { LocalStore } from '../client/store'
import { EventEmitter_ } from '../EventEmitter'
import { noHost } from '../host/none'
import { NOOP } from '../NOOP'
import { Registry } from '../Registry'
import { SharedObject } from '../SharedObject'
import { fromBundle } from '../spec/fromBundle'
import { stringifyBundleSpecData } from '../spec/stringifySpec'
import { BootOpt, System } from '../system'
import { Style } from '../system/platform/Props'
import classes from '../system/_classes'
import components from '../system/_components'
import specs from '../system/_specs'
import { BundleSpec } from '../types/BundleSpec'
import { Dict } from '../types/Dict'
import { IGamepad } from '../types/global/IGamepad'
import { IKeyboard } from '../types/global/IKeyboard'
import { IPointer } from '../types/global/IPointer'
import { GraphBundle } from '../types/GraphClass'
import { $Component } from '../types/interface/async/$Component'
import { Unlisten } from '../types/Unlisten'
import { weakMerge } from '../types/weakMerge'
import { uuidNotIn } from '../util/id'

export function boot(
  parent: System | null = null,
  api: API = noHost(),
  opt: BootOpt = {}
): System {
  const { path = '', specs: _specs = {}, flags = {} } = opt

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

  const registry = new Registry(merged_specs)

  const { specs_ } = registry

  const {
    specsCount,
    newSpecId,
    hasSpec,
    emptySpec,
    newSpec,
    getSpec,
    setSpec,
    forkSpec,
    injectSpecs,
    deleteSpec,
    registerUnit,
    unregisterUnit,
  } = registry

  const emitter = parent ? parent.emitter : new EventEmitter_()

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
    specsCount,
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
    flags: {
      defaultInputModeNone: false,
      ...flags,
    },
    boot: (opt: BootOpt) => boot(system, api, opt),
    graph: (system, opt) => new SharedObject(new LocalStore(system, 'local')),
    registerComponent: function (
      component: Component<IOElement, {}, $Component>
    ): string {
      const id = uuidNotIn(system.global.component)

      system.global.component[id] = component

      return id
    },
    stringifyBundleData: (bundle: BundleSpec) => {
      return stringifyBundleSpecData(bundle)
    },
    fromBundle: (bundle: BundleSpec) => {
      return fromBundle(bundle, merged_specs, {})
    },
    newGraph: (bundle: GraphBundle) => {
      const graph = new Graph({}, {}, system)

      return graph
    },
    getSpec: getSpec.bind(registry),
    hasSpec: hasSpec.bind(registry),
    newSpecId: newSpecId.bind(registry),
    emptySpec: emptySpec.bind(registry),
    forkSpec: forkSpec.bind(registry),
    newSpec: newSpec.bind(registry),
    setSpec: setSpec.bind(registry),
    injectSpecs: injectSpecs.bind(registry),
    deleteSpec: deleteSpec.bind(registry),
    registerUnit: registerUnit.bind(registry),
    unregisterUnit: unregisterUnit.bind(registry),
    injectPrivateCSSClass: function (
      globalId: string,
      className: string,
      style: Style
    ): Unlisten {
      if (system.root) {
        if (!system.global.component[globalId]) {
          throw new Error('component not found')
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
        throw new Error('component not found')
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
