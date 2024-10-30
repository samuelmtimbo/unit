import { API } from './API'
import { Graph } from './Class/Graph'
import { EventEmitter_ } from './EventEmitter'
import { Object_ } from './Object'
import { IOElement } from './client/IOElement'
import { Context } from './client/context'
import { UnitPointerEvent } from './client/event/pointer'
import { Theme } from './client/theme'
import { Point } from './client/util/geometry/types'
import { AllTypes } from './interface'
import { Classes, Specs } from './types'
import { BundleSpec } from './types/BundleSpec'
import { Callback } from './types/Callback'
import { Dict } from './types/Dict'
import { Unlisten } from './types/Unlisten'
import { KeyboardState } from './types/global/KeyboardState'
import { PointerState } from './types/global/PointerState'
import { R } from './types/interface/R'
import { S } from './types/interface/S'

export interface System extends S, R {
  parent: System | null
  path: string
  emitter: EventEmitter_
  root: HTMLElement | null
  customEvent: Set<string>
  context: Context[]
  theme: Theme
  color: string
  animated: boolean
  graphs: Graph[]
  async: AllTypes<(unit: any) => any>
  cache: {
    iframe: any[]
    dragAndDrop: Dict<any>
    pointerCapture: Dict<any>
    spriteSheetMap: Dict<boolean>
    servers: Dict<any>
  }
  feature: Dict<boolean>
  foreground: {
    sprite?: SVGSVGElement
    app?: HTMLElement
    html?: HTMLDivElement
    svg?: SVGSVGElement
    layout?: HTMLDivElement
    void?: HTMLElement
  }
  input: {
    keyboard: KeyboardState
    gamepads: Gamepad[]
    pointers: Dict<PointerState>
  }
  specs_: Object_<Specs>
  specs: Specs
  specsCount: Dict<number>
  classes: Classes
  components: ComponentClasses
  icons: Dict<string>
  global: {
    data: Object_<any>
    ref: Dict<any>
    graph: Dict<Dict<Graph>>
    scope: Dict<any>
  }
  api: API
  flags: {
    defaultInputModeNone?: boolean
    tick?: 'sync' | 'animation'
  }
  tick: (callback: Callback) => void
  boot: (opt: BootOpt) => System
  getLocalComponents: (remoteGlobalId: string) => any[]
  registerLocalComponent: (component: any, remoteGlobalId: string) => void
  unregisterLocalComponent: (component: any, remoteGlobalId: string) => void
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
  destroy: () => void
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
  new ($props: T, $system: System, $element?: IOElement): any
}

export type ComponentClasses = Dict<ComponentClass>

export interface BootOpt {
  path?: string
  specs?: Specs
  classes?: Classes
  components?: ComponentClasses
  flags?: System['flags']
}
