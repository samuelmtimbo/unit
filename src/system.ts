import { Graph } from './Class/Graph'
import { Component } from './client/component'
import { Context } from './client/context'
import { IOPointerEvent } from './client/event/pointer'
import { Gamepad } from './client/gamepad'
import { IOElement } from './client/IOElement'
import { Keyboard } from './client/keyboard'
import { Point } from './client/util/geometry'
import { J } from './interface/J'
import { U } from './interface/U'
import { NOOP } from './NOOP'
import { Pod } from './pod'
import { BundleSpec } from './system/platform/method/process/BundleSpec'
import { IPod, IPodOpt } from './system/platform/method/process/PodGraph'
import { Classes, GraphSpecs, Specs } from './types'
import { Callback } from './types/Callback'
import { Dict } from './types/Dict'
import {
  IBluetoothDevice,
  IBluetoothDeviceOpt,
} from './types/global/IBluetoothDevice'
import { IChannel, IChannelOpt } from './types/global/IChannel'
import { IDeviceInfo } from './types/global/IDeviceInfo'
import { IDisplayMediaOpt } from './types/global/IDisplayMedia'
import { IFileHandler } from './types/global/IFileHandler'
import { IGeoPosition } from './types/global/IGeoPosition'
import { IHTTPServer, IHTTPServerOpt } from './types/global/IHTTPServer'
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
import { Unlisten } from './types/Unlisten'

export type IOINIT<T, K> = (opt: K) => T

export type IOAPI<T, K> = {
  tab: IOINIT<T, K> | null
  session: IOINIT<T, K> | null
  local: IOINIT<T, K> | null
  cloud: IOINIT<T, K> | null
}

export type IOInput = {
  keyboard: Keyboard
  gamepad: Gamepad[]
}

export type IOMethod = Dict<Function>

export type IOStorage = IOAPI<J, undefined>
export type IOHTTP = IOAPI<IHTTPServer, IHTTPServerOpt>
export type IOChannel = IOAPI<IChannel, IChannelOpt>
export type IOPod = IOAPI<IPod, IPodOpt>

export type API = {
  storage: IOStorage
  http: IOHTTP
  channel: IOChannel
  pod: IOPod
  speech: {
    SpeechGrammarList: IOINIT<ISpeechGrammarList, ISpeechGrammarListOpt>
    SpeechRecognition: IOINIT<ISpeechRecognition, ISpeechRecognitionOpt>
    SpeechSynthesis: IOINIT<ISpeechSynthesis, ISpeechSynthesisOpt>
    SpeechSynthesisUtterance: IOINIT<
      ISpeechSynthesisUtterance,
      ISpeechSynthesisUtteranceOpt
    >
  }
  file: {
    showSaveFilePicker?: (opt: IFilePickerOpt) => Promise<IFileHandler[]>
    showOpenFilePicker?: (opt: IFilePickerOpt) => Promise<IFileHandler[]>
    downloadData: (opt: {}) => Promise<void>
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
  }
  selection: {
    containsSelection: (element: IOElement) => boolean
    removeSelection: () => void
  }
  document: {
    createElement<K extends keyof HTMLElementTagNameMap>(
      tagName: K,
      options?: ElementCreationOptions
    ): HTMLElementTagNameMap[K]
    createElementNS<K extends keyof SVGElementTagNameMap>(
      namespaceURI: 'http://www.w3.org/2000/svg',
      qualifiedName: K
    ): SVGElementTagNameMap[K]
    createTextNode(text: string): Text
  }
  querystring: {
    stringify: (obj: Dict<any>) => string,
    parse: (str: string) => Dict<any>
  }
}

export interface System {
  mounted: boolean
  root: HTMLElement
  customEvent: Set<string>
  context: Context[]
  cache: {
    dragAndDrop: Dict<any>
    pointerCapture: Dict<any>
    spriteSheetMap: Dict<boolean>
  }
  id: {
    pbkey: {
      tab: Dict<string>
      session: Dict<string>
      local: Dict<string>
      cloud: Dict<string>
    }
  }
  feature: Dict<boolean>
  foreground: {
    sprite?: SVGSVGElement
    app?: HTMLElement
    svg?: SVGSVGElement
    canvas?: HTMLCanvasElement
  }
  input: {
    keyboard: Keyboard
    gamepad: Gamepad[]
  }
  specs: Specs
  classes: Classes
  components: ComponentClasses
  pods: Pod[]
  global: {
    ref: Dict<any>
    component: Dict<Component>
  }
  api: API

  method: {
    encodeURI?: (str: string) => string
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
  host?: API
  specs?: Specs
  components?: ComponentClasses
  classes?: Classes
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

    refGraph(bundle: BundleSpec): [Dict<string>, Graph] {
      return // TODO
    },

    getSpecs(): GraphSpecs {
      return {} // TODO
    },
  }
}
