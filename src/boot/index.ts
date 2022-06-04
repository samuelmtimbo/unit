import { LocalStore } from '../client/store'
import { noHost } from '../host/none'
import { SharedObject } from '../SharedObject'
import { BootOpt, System } from '../system'
import _classes from '../system/_classes'
import _components from '../system/_components'
import _specs from '../system/_specs'
import { Dict } from '../types/Dict'
import { IGamepad } from '../types/global/IGamepad'
import { IKeyboard } from '../types/global/IKeyboard'
import { IPointer } from '../types/global/IPointer'

export function boot(opt: BootOpt = {}): System {
  let { api = noHost() } = opt

  const keyboard: IKeyboard = {
    pressed: [],
    repeat: false,
  }
  const gamepads: IGamepad[] = []
  const pointers: Dict<IPointer> = {}

  const customEvent = new Set<string>()
  const context = []
  const input = {
    keyboard,
    gamepads,
    pointers,
  }

  const flag = {
    dragAndDrop: {},
    pointerCapture: {},
    spriteSheetMap: {},
  }

  const feature = {}

  const system: System = {
    parent: null,
    mounted: false,
    animated: true,
    root: null,
    theme: 'dark',
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
    api,
    graph: (system, opt) => new SharedObject(new LocalStore(system, 'local')),
  }

  return system
}
