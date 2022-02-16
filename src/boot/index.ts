import { noHost } from '../host/none'
import { BootOpt, System } from '../system'
import _classes from '../system/_classes'
import _components from '../system/_components'
import _specs from '../system/_specs'
import { IGamepad } from '../types/global/IGamepad'
import { IKeyboard } from '../types/global/IKeyboard'

export function boot(opt: BootOpt = {}): System {
  let { api = noHost() } = opt

  const keyboard: IKeyboard = {
    pressed: [],
    repeat: false,
  }

  const gamepads: IGamepad[] = []

  const customEvent = new Set<string>()
  const context = []
  const input = {
    keyboard,
    gamepads,
  }

  const flag = {
    dragAndDrop: {},
    pointerCapture: {},
    spriteSheetMap: {},
  }

  const feature = {}

  const $system: System = {
    mounted: false,
    root: null,
    customEvent,
    input,
    context,
    specs: _specs,
    classes: _classes,
    components: _components,
    pods: [],
    cache: flag,
    feature,
    foreground: {
      svg: undefined,
      canvas: undefined,
      app: undefined,
    },
    method: {
      showLongPress: undefined,
      captureGesture: undefined,
    },
    global: {
      ref: {},
      component: {},
    },
    id: {
      user: null,
      token: null,
      pbkey: [],
      pvkey: {},
    },
    api,
  }

  return $system
}
