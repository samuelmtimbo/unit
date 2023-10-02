import { API } from './API'
import { Graph } from './Class/Graph'
import { EventEmitter_ } from './EventEmitter'
import { NOOP } from './NOOP'
import { Object_ } from './Object'
import { Component } from './client/component'
import { Context } from './client/context'
import { UnitPointerEvent } from './client/event/pointer'
import { Theme } from './client/theme'
import { Point } from './client/util/geometry/types'
import { Style } from './system/platform/Props'
import Iframe from './system/platform/component/Iframe/Component'
import { Classes, Specs } from './types'
import { BundleSpec } from './types/BundleSpec'
import { Callback } from './types/Callback'
import { Dict } from './types/Dict'
import { GraphSpecs } from './types/GraphSpecs'
import { Unlisten } from './types/Unlisten'
import { IChannel, IChannelOpt } from './types/global/IChannel'
import { IGamepad } from './types/global/IGamepad'
import { IKeyboard } from './types/global/IKeyboard'
import { IPointer } from './types/global/IPointer'
import { J } from './types/interface/J'
import { R } from './types/interface/R'
import { S } from './types/interface/S'

declare global {
  interface FileSystemFileHandle {
    name: string
    getFile(): any
  }

  class ImageCapture {
    constructor(track: MediaStreamTrack)

    grabFrame(): Promise<ImageBitmap>
  }
}

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

export type IOMethod = Dict<Function>

export type APIStorage = { local: () => J }
export type APIHTTP = {
  fetch: (url: string, opt: RequestInit) => any
  EventSource: typeof EventSource
}
export type APIChannel = { local: (opt: IChannelOpt) => IChannel }

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
    iframe: Iframe[]
    dragAndDrop: Dict<any>
    pointerCapture: Dict<any>
    spriteSheetMap: Dict<boolean>
  }
  feature: Dict<boolean>
  foreground: {
    sprite?: SVGSVGElement
    app?: HTMLElement
    html?: HTMLDivElement
    svg?: SVGSVGElement
    canvas?: HTMLCanvasElement
    layout?: HTMLDivElement
    void?: HTMLElement
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
    data: Object_<any>
    ref: Dict<any>
    component: Dict<Component>
    scope: Dict<any>
  }
  api: API
  flags: {
    defaultInputModeNone?: boolean
    tick?: 'sync' | 'animation'
  }
  tick: (callback: Callback) => void
  boot: (opt: BootOpt) => System
  injectPrivateCSSClass: (
    globalId: string,
    className: string,
    style: Style
  ) => Unlisten
  getLocalComponents: (remoteGlobalId: string) => Component[]
  registerLocalComponent: (
    component: Component,
    remoteGlobalId: string
  ) => string
  unregisterLocalComponent: (remoteGlobalId: string, localId: string) => void
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
  flags?: System['flags']
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
