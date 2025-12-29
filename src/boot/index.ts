import { API, InterceptOpt, ServerHandler, ServerInterceptor } from '../API'
import { Graph } from '../Class/Graph'
import { EventEmitter_ } from '../EventEmitter'
import { NOOP } from '../NOOP'
import { Object_ } from '../Object'
import { Registry } from '../Registry'
import { Component } from '../client/component'
import { icons } from '../client/icons'
import { themeColor } from '../client/theme'
import { InvalidStateError } from '../exception/InvalidStateError'
import { start } from '../start'
import { BootOpt, System } from '../system'
import { BundleSpec } from '../types/BundleSpec'
import { Dict } from '../types/Dict'
import { Listener } from '../types/Listener'
import { Unlisten } from '../types/Unlisten'
import { KeyboardState } from '../types/global/KeyboardState'
import { PointerState } from '../types/global/PointerState'
import { ASYNC } from '../types/interface/async/wrapper'
import { remove } from '../util/array'
import { clone } from '../util/clone'
import { weakMerge } from '../weakMerge'
import { style } from './style'

const SYSTEM_USER_VISIBLE_EVENTS = ['hashchange']

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

  const cache: System['cache'] = {
    dragAndDrop: {},
    pointerCapture: {},
    servers: {},
    events: {},
    requests: {},
    responses: {},
    ws: {},
    wss: {},
    interceptors: [],
  }

  const feature = {}

  const specs__ = weakMerge(specs, {})

  const registry = new Registry(specs__)

  const { specs_ } = registry

  const {
    specsCount,
    lock: specsLock,
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
    lockSpec,
    unlockSpec,
  } = registry

  for (const specId in specs) {
    specsLock[specId] = true
  }

  const emitter = parent ? parent.emitter : new EventEmitter_()

  const componentRemoteToLocal: Dict<Component[]> = {}

  const theme = 'dark'
  const color = themeColor(theme)

  const system: System = {
    path,
    parent,
    emitter,
    root: (parent && parent.root) || null,
    color,
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
    specsCount,
    lock: specsLock,
    cache,
    feature,
    foreground: clone(parent?.foreground ?? {}),
    style,
    showLongPress: undefined,
    captureGesture: undefined,
    global: {
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
    boot: (opt_: BootOpt = {}) => {
      return boot(system, api, weakMerge(opt, opt_))
    },
    start: (bundle: BundleSpec): Graph => {
      return start(system, bundle)
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
    lockSpec: lockSpec.bind(registry),
    unlockSpec: unlockSpec.bind(registry),
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
    intercept: function (opt: InterceptOpt, handler: ServerHandler): Unlisten {
      const interceptor: ServerInterceptor = {
        opt,
        handler,
      }

      cache.interceptors.push(interceptor)

      return () => {
        remove(cache.interceptors, interceptor)
      }
    },
    addListener: function (event: any, listener: Listener<any>): Unlisten {
      if (SYSTEM_USER_VISIBLE_EVENTS.includes('hashchange')) {
        return emitter.addListener(event, listener)
      }

      return NOOP
    },
    prependListener: function <K extends string | number | symbol>(
      event: K,
      listener: Listener<any>
    ): Unlisten {
      throw new InvalidStateError()
    },
    removeListener: function <K extends string | number | symbol>(
      event: K,
      listener: Listener<any>
    ): void {
      throw new InvalidStateError()
    },
    eventNames: function (): string[] {
      return SYSTEM_USER_VISIBLE_EVENTS
    },
    emit: function <K extends string | number | symbol>(
      event: K,
      ...args: any
    ): void {
      throw new InvalidStateError()
    },
    listenerCount: function (name: string): number {
      if (SYSTEM_USER_VISIBLE_EVENTS.includes('hashchange')) {
        return emitter.listenerCount(name)
      }

      return 0
    },
  }

  return system
}
