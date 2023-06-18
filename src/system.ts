import { API } from './API'
import { $ } from './Class/$'
import { Graph } from './Class/Graph'
import { Component } from './client/component'
import { Context } from './client/context'
import { UnitPointerEvent } from './client/event/pointer'
import { Store } from './client/store'
import { Theme } from './client/theme'
import { Point } from './client/util/geometry'
import { EventEmitter_ } from './EventEmitter'
import { NOOP } from './NOOP'
import { Object_ } from './Object'
import { SharedObject } from './SharedObject'
import { Style } from './system/platform/Props'
import { Classes, GraphSpecs, Specs } from './types'
import { BundleSpec } from './types/BundleSpec'
import { Callback } from './types/Callback'
import { Dict } from './types/Dict'
import { IChannel, IChannelOpt } from './types/global/IChannel'
import { IGamepad } from './types/global/IGamepad'
import { IHTTPServer, IHTTPServerOpt } from './types/global/IHTTPServer'
import { IKeyboard } from './types/global/IKeyboard'
import { IPointer } from './types/global/IPointer'
import { J } from './types/interface/J'
import { R } from './types/interface/R'
import { S } from './types/interface/S'
import { Unlisten } from './types/Unlisten'

declare global {
  interface FileSystemFileHandle {
    name: string
    getFile(): any
  }
}

export type IO_INIT<T, K> = (opt: K) => T

export type IO_SYSTEM_INIT<T, K> = (system: System, opt: K) => T

export type IO_HTTP_API<T> = {
  local: T
  cloud: T
}
export type IO_STORAGE_API<T> = {
  session: T
  local: T
}
export type IO_SERVICE_API<T> = {
  local: T
  cloud: T
  shared: T
}

export type IO_HTTP_API_INIT<T, K> = IO_HTTP_API<IO_INIT<T, K>>
export type IO_STORAGE_API_INIT<T, K> = IO_STORAGE_API<IO_INIT<T, K>>

export type IO_SERVICE_API_INIT<T, K> = IO_SYSTEM_INIT<IO_SERVICE_API<T>, K>

export type IOInput = {
  keyboard: IKeyboard
  gamepad: Gamepad[]
}

export type IOMethod = Dict<Function>

export type APIStorage = IO_STORAGE_API_INIT<J, undefined>
export type APIHTTP = {
  server: IO_HTTP_API_INIT<IHTTPServer, IHTTPServerOpt>
  fetch: (url: string, opt: RequestInit) => any
  EventSource: typeof EventSource
}
export type APIChannel = IO_STORAGE_API_INIT<IChannel, IChannelOpt>

export type APIAlert = {
  alert: (message: string) => void
  prompt: (message: string) => string
}

export interface System extends S, R {
  parent: System | null
  path: string
  emitter: EventEmitter_
  root: HTMLElement | null
  customEvent: Set<string>
  context: Context[]
  theme: Theme
  animated: boolean
  graphs: Graph[]
  cache: {
    dragAndDrop: Dict<any>
    pointerCapture: Dict<any>
    spriteSheetMap: Dict<boolean>
  }
  feature: Dict<boolean>
  foreground: {
    sprite?: SVGSVGElement
    app?: HTMLElement
    svg?: SVGSVGElement
    canvas?: HTMLCanvasElement
  }
  input: {
    keyboard: IKeyboard
    gamepads: IGamepad[]
    pointers: Dict<IPointer>
  }
  specs_: Object_<Specs>
  specs: Specs
  specsCount: Dict<number>
  classes: Classes
  components: ComponentClasses
  global: {
    ref: Dict<$>
    component: Dict<Component>
  }
  api: API
  boot: (opt: BootOpt) => System
  injectPrivateCSSClass: (
    globalId: string,
    className: string,
    style: Style
  ) => Unlisten
  graph: IO_SYSTEM_INIT<SharedObject<Store<BundleSpec>, {}>, {}>
  getRemoteComponent: (id: string) => Component
  registerComponent: (component: Component) => string
  registerRemoteComponent: (globalId: string, remoteGlobalId: string) => void
  registerUnit(id: string): void
  stringifyBundleData(bundle: BundleSpec): void
  unregisterUnit(id: string): void
  showLongPress?: (
    screenX: number,
    screenY: number,
    opt: {
      stroke?: string
      direction?: 'in' | 'out'
    }
  ) => void
  captureGesture?: (
    event: UnitPointerEvent,
    opt: {
      lineWidth?: number
      strokeStyle?: string
    },
    callback: (event: PointerEvent, track: Point[]) => void
  ) => Unlisten
}

export type IFilePickerOpt = {
  suggestedName?: string
  startIn?: string
  id?: string
  excludeAcceptAllOption?: boolean
  types?: {
    description: string
    accept: Dict<string[]>
  }[]
  multiple?: boolean
  capture?: string
  accept?: string
}

export type ComponentClass<T = any> = {
  id: string
  new ($props: T, $system: System): Component
}

export type ComponentClasses = Dict<ComponentClass>

export interface BootOpt {
  path?: string
  specs?: GraphSpecs
  classes?: Classes
  components?: ComponentClasses
}

export const HTTPServer = (opt: IHTTPServerOpt): IHTTPServer => {
  return {
    listen(port: number): Unlisten {
      return NOOP
    },
  }
}

export const LocalChannel = (opt: IChannelOpt): IChannel => {
  return {
    close(): void {},
    postMessage(message: any): void {},
    addListener(event: string, callback: Callback): Unlisten {
      return NOOP
    },
  }
}
