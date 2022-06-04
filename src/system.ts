import { Graph } from './Class/Graph'
import { Component } from './client/component'
import { Context } from './client/context'
import { IOPointerEvent } from './client/event/pointer'
import { IOElement } from './client/IOElement'
import { Store } from './client/store'
import { Theme } from './client/theme'
import { Point, Rect, Size } from './client/util/geometry'
import { NOOP } from './NOOP'
import { Pod } from './pod'
import { SharedObject } from './SharedObject'
import { IPod, IPodOpt } from './system/platform/method/process/Start'
import { Classes, GraphSpecs, Specs } from './types'
import { BundleSpec } from './types/BundleSpec'
import { Callback } from './types/Callback'
import { Dict } from './types/Dict'
import {
  IBluetoothDevice,
  IBluetoothDeviceOpt,
} from './types/global/IBluetoothDevice'
import { IChannel, IChannelOpt } from './types/global/IChannel'
import { IDeviceInfo } from './types/global/IDeviceInfo'
import { IDisplayMediaOpt } from './types/global/IDisplayMedia'
import { IDownloadDataOpt } from './types/global/IDownloadData'
import { IDownloadURLOpt } from './types/global/IDownloadURL'
import { IFileHandler } from './types/global/IFileHandler'
import { IGamepad } from './types/global/IGamepad'
import { IGeoPosition } from './types/global/IGeoPosition'
import { IHTTPServer, IHTTPServerOpt } from './types/global/IHTTPServer'
import { IKeyboard } from './types/global/IKeyboard'
import { IMutationObserverConstructor } from './types/global/IMutationObserver'
import { IPointer } from './types/global/IPointer'
import { IPositionObserverCostructor } from './types/global/IPositionObserver'
import { IResizeObserverConstructor } from './types/global/IResizeObserver'
import {
  ISpeechGrammarList,
  ISpeechGrammarListOpt,
} from './types/global/ISpeechGrammarList'
import {
  ISpeechRecognition,
  ISpeechRecognitionOpt,
} from './types/global/ISpeechRecognition'
import {
  ISpeechSynthesis,
  ISpeechSynthesisOpt,
} from './types/global/ISpeechSynthesis'
import {
  ISpeechSynthesisUtterance,
  ISpeechSynthesisUtteranceOpt,
} from './types/global/ISpeechSynthesisUtterance'
import { IUserMediaOpt } from './types/global/IUserMedia'
import { IWakeLock, IWakeLockOpt } from './types/global/IWakeLock'
import { J } from './types/interface/J'
import { U } from './types/interface/U'
import { Unlisten } from './types/Unlisten'

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
}
export type APIChannel = IO_STORAGE_API_INIT<IChannel, IChannelOpt>
export type APIPod = IO_STORAGE_API_INIT<IPod, IPodOpt>

export type API = {
  init: {
    boot: (root: HTMLElement) => System
  }
  animation: {
    requestAnimationFrame: (callback: FrameRequestCallback) => number
    cancelAnimationFrame: (frame: number) => void
  }
  storage: APIStorage
  db: IDBFactory
  http: APIHTTP
  channel: APIChannel
  input: {
    keyboard: {}
    gamepad: {
      getGamepad: (i: number) => Gamepad
      addEventListener: (
        type: 'gamepadconnected' | 'gamepadisconnected',
        listener: (ev: GamepadEvent) => any,
        options?: boolean | AddEventListenerOptions
      ) => Unlisten
    }
    pointer: {
      getPointerPosition: (pointerId: number) => {
        screenX: number
        screenY: number
      }
      setPointerCapture: (
        element: HTMLElement | SVGElement,
        pointerId: number
      ) => Unlisten
    }
  }
  url: {
    createObjectURL: (obj) => Promise<string>
  }
  uri: {
    encodeURI?: (str: string) => string
  }
  speech: {
    SpeechGrammarList: IO_INIT<ISpeechGrammarList, ISpeechGrammarListOpt>
    SpeechRecognition: IO_INIT<ISpeechRecognition, ISpeechRecognitionOpt>
    SpeechSynthesis: IO_INIT<ISpeechSynthesis, ISpeechSynthesisOpt>
    SpeechSynthesisUtterance: IO_INIT<
      ISpeechSynthesisUtterance,
      ISpeechSynthesisUtteranceOpt
    >
  }
  file: {
    showSaveFilePicker?: (opt: IFilePickerOpt) => Promise<IFileHandler[]>
    showOpenFilePicker?: (opt: IFilePickerOpt) => Promise<IFileHandler[]>
    downloadURL: (opt: IDownloadURLOpt) => Promise<void>
    downloadData: (opt: IDownloadDataOpt) => Promise<void>
  }
  screen: {
    devicePixelRatio?: number
    requestWakeLock: (type: IWakeLockOpt) => Promise<IWakeLock>
  }
  bluetooth: {
    requestDevice: (type: IBluetoothDeviceOpt) => Promise<IBluetoothDevice>
  }
  device: {
    vibrate: (opt: VibratePattern) => Promise<void>
  }
  clipboard: {
    readText: () => Promise<string>
    writeText: (text: string) => Promise<void>
  }
  geolocation: {
    getCurrentPosition: () => Promise<IGeoPosition>
  }
  media: {
    getUserMedia: (opt: IUserMediaOpt) => Promise<MediaStream>
    getDisplayMedia: (opt: IDisplayMediaOpt) => Promise<MediaStream>
    enumerateDevices: () => Promise<IDeviceInfo[]>
    image: {
      createImageBitmap: (
        image: ImageBitmapSource,
        rect: Partial<Rect>,
        opt: {}
      ) => Promise<ImageBitmap>
    }
  }
  selection: {
    containsSelection: (element: IOElement) => boolean
    removeSelection: () => void
  }
  document: {
    createElement<K extends keyof HTMLElementTagNameMap>(
      tagName: K
    ): HTMLElementTagNameMap[K]
    createElementNS<K extends keyof SVGElementTagNameMap>(
      namespaceURI: 'http://www.w3.org/2000/svg',
      qualifiedName: K
    ): SVGElementTagNameMap[K]
    createTextNode(text: string): Text
    elementsFromPoint(x: number, y: number): Element[]
    elementFromPoint(x: number, y: number): Element
    MutationObserver: IMutationObserverConstructor
    PositionObserver: IPositionObserverCostructor
    ResizeObserver: IResizeObserverConstructor
  }
  querystring: {
    stringify: (obj: Dict<any>) => string
    parse: (str: string) => Dict<any>
  }
  text: {
    measureText: (text: string, fontSize: number) => Size
  }
  worker: {
    start(): Worker
  }
}

export interface System {
  mounted: boolean
  parent: HTMLElement | null
  root: HTMLElement | null
  customEvent: Set<string>
  context: Context[]
  theme: Theme
  animated: boolean
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
  specs: Specs
  classes: Classes
  components: ComponentClasses
  pods: Pod[]
  global: {
    ref: Dict<any>
    component: Dict<Component>
  }
  graph: IO_SYSTEM_INIT<SharedObject<Store<BundleSpec>, {}>, {}>
  api: API
  method: {
    registerComponent?: (component: Component) => string
    createSlot?: () => [string, HTMLSlotElement]
    showLongPress?: (
      screenX: number,
      screenY: number,
      opt: {
        stroke?: string
        direction?: 'in' | 'out'
      }
    ) => void
    captureGesture?: (
      event: IOPointerEvent,
      opt: {
        lineWidth?: number
        strokeStyle?: string
      },
      callback: (event: PointerEvent, track: Point[]) => void
    ) => void
  }
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
}

export type ComponentClass = {
  id: string
  new ($props: any, $system: System, $pod: Pod): Component
}

export type ComponentClasses = Dict<ComponentClass>

export interface BootOpt {
  api?: API
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

export const LocalPod = (opt: IPodOpt): IPod => {
  return {
    refUnit(id: string): U {
      return // TODO
    },

    newGraph(bundle: BundleSpec): [Dict<string>, Graph, Unlisten] {
      return // TODO
    },

    getSpecs(): GraphSpecs {
      return {} // TODO
    },
  }
}
