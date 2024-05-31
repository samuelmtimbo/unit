import { API } from '../API'
import { EventEmitter_ } from '../EventEmitter'
import { NOOP } from '../NOOP'
import { Object_ } from '../Object'
import { Registry } from '../Registry'
import { Component } from '../client/component'
import { unmount } from '../client/context'
import icons from '../client/icons'
import { styleToCSS } from '../client/id/styleToCSS'
import { appendRootStyle, removeRootStyle } from '../client/render/attachStyle'
import { fromBundle } from '../spec/fromBundle'
import { stringifyBundleSpecData } from '../spec/stringifySpec'
import { BootOpt, System } from '../system'
import { Style } from '../system/platform/Style'
import { BundleSpec } from '../types/BundleSpec'
import { Dict } from '../types/Dict'
import { GraphBundle } from '../types/GraphClass'
import { Unlisten } from '../types/Unlisten'
import { KeyboardState } from '../types/global/KeyboardState'
import { PointerState } from '../types/global/PointerState'
import { randomIdNotIn } from '../util/id'
import { weakMerge } from '../weakMerge'

export function boot(
  parent: System | null = null,
  api: API,
  opt: BootOpt
): System {
  const {
    path = '',
    specs = {},
    classes = {},
    components = {},
    flags = {},
  } = opt

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

  const componentLocalToRemote: Dict<string> = {}
  const componentLocal: Dict<Component> = {}
  const componentRemoteToLocal: Dict<Set<string>> = {}

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
          ref_: {},
          component: componentLocal,
          data: new Object_({}),
          scope: {},
        },
    api,
    flags: {
      defaultInputModeNone: false,
      tick: 'sync',
      ...flags,
    },
    tick:
      flags.tick === 'sync'
        ? (callback: () => void) => {
            callback()
          }
        : (callback) => system.api.animation.requestAnimationFrame(callback),
    boot: (opt: BootOpt) => boot(system, api, opt),
    stringifyBundleData: (bundle: BundleSpec) => {
      return stringifyBundleSpecData(bundle)
    },
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
    getLocalComponents: function (remoteGlobalId: string): Component[] {
      const localIds = componentRemoteToLocal[remoteGlobalId]

      return localIds ? [...localIds].map((id) => componentLocal[id]) : []
    },
    registerLocalComponent: function (
      component: Component,
      remoteGlobalId: string
    ): string {
      const localId = randomIdNotIn(componentLocalToRemote)

      componentLocal[localId] = component

      componentLocalToRemote[localId] = remoteGlobalId

      componentRemoteToLocal[remoteGlobalId] =
        componentRemoteToLocal[remoteGlobalId] ?? new Set()
      componentRemoteToLocal[remoteGlobalId].add(localId)

      emitter.emit(remoteGlobalId, component)

      return localId
    },
    unregisterLocalComponent: function (localId: string): void {
      const remoteGlobalId = componentLocalToRemote[localId]

      if (!remoteGlobalId) {
        throw new Error('local component not found')
      }

      const localIds = componentRemoteToLocal[remoteGlobalId]

      localIds.delete(localId)

      if (localIds.size === 0) {
        delete componentRemoteToLocal[remoteGlobalId]
      }

      delete componentLocalToRemote[localId]
    },
    destroy: function (): void {
      for (const graph of system.graphs) {
        graph.destroy()
      }
    },
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
