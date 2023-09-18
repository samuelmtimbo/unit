import { API } from '../API'
import { EventEmitter_ } from '../EventEmitter'
import { NOOP } from '../NOOP'
import { Registry } from '../Registry'
import { SharedObject } from '../SharedObject'
import { styleToCSS } from '../client/id/styleToCSS'
import { appendRootStyle, removeRootStyle } from '../client/render/attachStyle'
import { LocalStore } from '../client/store'
import { noHost } from '../host/none'
import { fromBundle } from '../spec/fromBundle'
import { stringifyBundleSpecData } from '../spec/stringifySpec'
import { BootOpt, System } from '../system'

import specs from '../system/_specs'
import { Style } from '../system/platform/Props'
import { BundleSpec } from '../types/BundleSpec'
import { Dict } from '../types/Dict'
import { GraphBundle } from '../types/GraphClass'
import { Unlisten } from '../types/Unlisten'

import { Object_ } from '../Object'
import { IOElement } from '../client/IOElement'
import { Component } from '../client/component'
import classes from '../system/_classes'
import components from '../system/_components'
import { IGamepad } from '../types/global/IGamepad'
import { IKeyboard } from '../types/global/IKeyboard'
import { IPointer } from '../types/global/IPointer'
import { $Component } from '../types/interface/async/$Component'
import { weakMerge } from '../types/weakMerge'
import { randomIdNotIn } from '../util/id'

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
          data: new Object_({}),
          scope: {},
        },
    api,
    flags: {
      defaultInputModeNone: false,
      ...flags,
    },
    boot: (opt: BootOpt) => boot(system, api, opt),
    graph: (system, opt) => new SharedObject(new LocalStore(system, 'local')),
    stringifyBundleData: (bundle: BundleSpec) => {
      return stringifyBundleSpecData(bundle)
    },
    fromBundle: (bundle: BundleSpec) => {
      return fromBundle(bundle, merged_specs, {})
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
    getLocalComponents: function (
      remoteGlobalId: string
    ): Component<IOElement, {}, $Component>[] {
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
