import { Context } from './client/context'
import { IOPointerEvent } from './client/event/pointer'
import { Gamepad } from './client/gamepad'
import { Keyboard } from './client/keyboard'
import { Point } from './client/util/geometry'
import { PO } from './interface/PO'
import { spawn } from './Pod'
import { GraphSpec, Specs } from './types'
import { Dict } from './types/Dict'

export interface System {
  $mounted: boolean
  $root: HTMLElement
  $input: {
    $keyboard: Keyboard
    $gamepad: Gamepad[]
  }
  $customEvent: Set<string>
  $context: Context[]
  $pod: PO
  $flag: {
    __DRAG__AND__DROP__: Dict<any>
    __POINTER__CAPTURE__: Dict<any>
    __SYSTEM__SPRITESHEET__MAP__: Dict<boolean>
  }
  $feature: Dict<boolean>
  $foreground: {
    $sprite?: SVGSVGElement
    $app?: HTMLElement
    $svg?: SVGSVGElement
    $canvas?: HTMLCanvasElement
  }
  $method: {
    showLongPress?: (
      event: IOPointerEvent,
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
  $deps: {
    $script: Dict<HTMLScriptElement>
    $style: Dict<HTMLStyleElement>
  }
}

export interface BootOpt {
  specs?: Specs
  components?: any // TODO
  classes?: any // TODO
}

export function boot(graph: GraphSpec, opt: BootOpt): System {
  const { specs, components, classes } = opt

  globalThis.__specs = specs
  globalThis.__components = components
  globalThis.__classes = classes

  const $keyboard: Keyboard = {
    $pressed: [],
    $repeat: false,
  }

  const $gamepad: Gamepad[] = []

  const $pod = spawn(graph)

  const $customEvent = new Set<string>()
  const $context = []
  const $input = {
    $keyboard,
    $gamepad,
  }

  const $flag = {
    __DRAG__AND__DROP__: {},
    __POINTER__CAPTURE__: {},
    __SYSTEM__SPRITESHEET__MAP__: {},
  }

  const $feature = {}

  const $system: System = {
    $mounted: false,
    $root: null,
    $pod,
    $customEvent,
    $input,
    $context,
    $flag,
    $feature,
    $foreground: {
      $svg: undefined,
      $canvas: undefined,
      $app: undefined,
    },
    $method: {
      showLongPress: undefined,
      captureGesture: undefined,
    },
    $deps: {
      $script: {},
      $style: {},
    },
  }

  return $system
}
