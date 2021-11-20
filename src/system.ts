import { Context } from './client/context'
import { IOPointerEvent } from './client/event/pointer'
import { Gamepad } from './client/gamepad'
import { Keyboard } from './client/keyboard'
import { Point } from './client/util/geometry'
import { J } from './interface/J'
import { PO } from './interface/PO'
import { S } from './interface/S'
import NOOP from './NOOP'
import {
  IHTTPServer,
  IHTTPServerOpt,
} from './system/platform/api/http/HTTPServer'
import { Specs } from './types'
import { Dict } from './types/Dict'
import { Unlisten } from './Unlisten'

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

export type IOStorage = IOAPI<J, undefined>

export type IOMethod = Dict<Function>

export type IOHTTP = IOAPI<IHTTPServer, IHTTPServerOpt>

export type IOURI = IOAPI<IHTTPServer, IHTTPServerOpt>

export interface System extends S {
  hostname: string
  mounted: boolean
  root: HTMLElement
  customEvent: Set<string>
  context: Context[]
  pod: PO
  flag: {
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
  deps: {
    script: Dict<HTMLScriptElement>
    style: Dict<HTMLStyleElement>
  }
  input: {
    keyboard: Keyboard
    gamepad: Gamepad[]
  }
  specs: Specs
  api: {
    storage: IOStorage
    http: IOHTTP
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
  }
}

export interface Host {
  tabStorage?: Storage
  localStorage?: Storage
  sessionStorage?: Storage
  cloudStorage?: Storage
  location?: Location
}

export interface BootOpt {
  host?: Host
  specs?: Specs
  components?: any // TODO
  classes?: any // TODO
}

export const HTTPServer = (opt: IHTTPServerOpt): IHTTPServer => {
  return {
    listen(port: number): Unlisten {
      return NOOP
    },
  }
}
