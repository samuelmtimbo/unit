import { API } from '../API'
import { EventEmitter_ } from '../EventEmitter'
import { Object_ } from '../Object'
import { Registry } from '../Registry'
import { Component } from '../client/component'
import { unmount } from '../client/context'
import icons from '../client/icons'
import { themeColor } from '../client/theme'
import { fromBundle } from '../spec/fromBundle'
import { BootOpt, System } from '../system'
import { BundleSpec } from '../types/BundleSpec'
import { Dict } from '../types/Dict'
import { GraphBundle } from '../types/GraphClass'
import { KeyboardState } from '../types/global/KeyboardState'
import { PointerState } from '../types/global/PointerState'
import { ASYNC } from '../types/interface/async/wrapper'
import { remove } from '../util/array'
import { weakMerge } from '../weakMerge'

export function boot(
  parent: System | null = null,
  api: API,
  opt: BootOpt
): System {
  const { specs = {}, classes = {}, components = {}, flags = {} } = opt

  const path = opt.path || '/'

  const keyboard: KeyboardState = {
    pressed: [],
    repeat: false,
  }
  const gamepads: Gamepad[] = []
  const pointers: Dict<PointerState> = {}

  const customEvent = new Set<string>()
  const context = []
  const input = {
    keyboard,
    gamepads,
    pointers,
  }

  const cache = {
    iframe: [],
    dragAndDrop: {},
    pointerCapture: {},
    spriteSheetMap: {},
    servers: {},
  }

  const feature = {}

  const specs__ = weakMerge(specs, {})

  const registry = new Registry(specs__)

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
    shouldFork,
  } = registry

  const emitter = parent ? parent.emitter : new EventEmitter_()

  const componentRemoteToLocal: Dict<Component[]> = {}

  const theme = 'dark'
  const color = themeColor(theme)

  const system: System = {
    path,
    parent,
    emitter,
    animated: true,
    root: null,
    theme,
    customEvent,
    async: ASYNC,
    input,
    context,
    specs_,
    specs: specs__,
    classes,
    components,
    icons,
    graphs: [],
    specsCount,
    cache,
    feature,
    foreground: {
      svg: undefined,
      app: undefined,
    },
    showLongPress: undefined,
    captureGesture: undefined,
    global: parent
      ? parent.global
      : {
          ref: {},
          graph: {},
          data: new Object_({}),
          scope: {},
        },
    api,
    flags: {
      defaultInputModeNone: false,
      ...flags,
    },
    boot: (opt: BootOpt) => boot(system, api, opt),
    fromBundle: (bundle: BundleSpec) => {
      return fromBundle(bundle, specs, {})
    },
    newGraph: (Bundle: GraphBundle) => {
      const graph = new Bundle(system)

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
    shouldFork: shouldFork.bind(registry),
    getLocalComponents: function (remoteGlobalId: string): Component[] {
      const components = componentRemoteToLocal[remoteGlobalId]

      return components ?? []
    },
    registerLocalComponent: function (
      component: Component,
      remoteGlobalId: string
    ): void {
      componentRemoteToLocal[remoteGlobalId] =
        componentRemoteToLocal[remoteGlobalId] ?? []
      componentRemoteToLocal[remoteGlobalId].push(component)

      emitter.emit(remoteGlobalId, component)
    },
    unregisterLocalComponent: function (
      component: Component,
      remoteGlobalId: string
    ): void {
      const components = componentRemoteToLocal[remoteGlobalId]

      remove(components, component)
    },
    destroy: function (): void {
      for (const graph of system.graphs) {
        graph.destroy()
      }
    },
    color,
  }

  return system
}

export function destroy(system: System) {
  const { graphs, context } = system

  for (const graph of graphs) {
    graph.destroy()
  }

  for (const context_ of context) {
    unmount(context_)
  }
}
