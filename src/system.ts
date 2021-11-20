import { Callback } from './Callback'
import { Component } from './client/component'
import { Context } from './client/context'
import { IOPointerEvent } from './client/event/pointer'
import {
  ISpeechGrammarList,
  ISpeechGrammarListOpt,
  ISpeechRecognition,
  ISpeechRecognitionOpt,
} from './api/speech'
import { Gamepad } from './client/gamepad'
import { Keyboard } from './client/keyboard'
import { Point } from './client/util/geometry'
import { C } from './interface/C'
import { G } from './interface/G'
import { J } from './interface/J'
import { PO } from './interface/PO'
import { U } from './interface/U'
import NOOP from './NOOP'
import {
  IHTTPServer,
  IHTTPServerOpt,
} from './system/platform/api/http/HTTPServer'
import { IChannel, IChannelOpt } from './system/platform/api/local/LocalChannel'
import { IPod, IPodOpt } from './system/platform/method/process/Pod'
import { Classes, GraphSpecs, Specs } from './types'
import { Dict } from './types/Dict'
import { Unlisten } from './Unlisten'
import { randomId } from './util/id'
import { EventEmitter2 } from 'eventemitter2'

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

export interface System {
  hostname: string
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
  global: {
    ref: Dict<any>
    component: Dict<Component>
  }
  api: {
    storage: IOStorage
    http: IOHTTP
    channel: IOChannel
    pod: IOPod
    speech: {
      SpeechGrammarList: IOINIT<ISpeechGrammarList, ISpeechGrammarListOpt>
      SpeechRecognition: IOINIT<ISpeechRecognition, ISpeechRecognitionOpt>
    }
  }
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
    showSaveFilePicker?: (opt: {
      suggestedName?: string
      startIn?: string
      id?: string
      excludeAcceptAllOption?: boolean
      types?: {
        description: string
        accept: Dict<string[]>
      }[]
    }) => Promise<any> // TODO
    showOpenFilePicker?: (opt: {
      suggestedName?: string
      startIn?: string
      id?: string
      excludeAcceptAllOption?: boolean
      types?: {
        description: string
        accept: Dict<string[]>
      }[]
      multiple?: boolean
    }) => Promise<any> // TODO
  }
}

export interface Host {
  tabStorage?: Storage
  localStorage?: Storage
  sessionStorage?: Storage
  cloudStorage?: Storage
  location?: Location
}

export type ComponentClass = {
  id: string
  new ($props: any, $system: System): Component
}

export type ComponentClasses = Dict<ComponentClass>

export interface BootOpt {
  host?: Host
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

export const SpeechRecognition = (
  opt: ISpeechRecognitionOpt
): ISpeechRecognition => {
  return {
    start() {},
    stop() {},
    addListener(event: string, callback: Callback): Unlisten {
      return NOOP
    },
  }
}

export const SpeechGrammarList = (
  opt: ISpeechGrammarListOpt
): ISpeechGrammarList => {
  return {
    addFromString(str: string, weight: number): void {},
  }
}

export const LocalPod = (opt: IPodOpt): IPod => {
  return {
    refUnit(id: string): void {},

    refGraph(id: string): U & C & G {
      return
    },

    addGraph(): string {
      return randomId() //
    },

    getSpecs(): GraphSpecs {
      return {} // TODO
    },
  }
}
