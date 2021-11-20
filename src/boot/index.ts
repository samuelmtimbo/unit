import { $tabStorage } from '../api/storage/tab'
import { Gamepad } from '../client/gamepad'
import { Keyboard } from '../client/keyboard'
import { J } from '../interface/J'
import {
  BootOpt,
  HTTPServer,
  IOStorage,
  LocalChannel,
  LocalPod,
  SpeechGrammarList,
  SpeechRecognition,
  System,
} from '../system'
import { Storage_ } from '../system/platform/api/storage/Storage_'
import _specs from '../system/_specs'

export function boot(opt: BootOpt = {}): System {
  let { specs, components, classes, host = {} } = opt

  const { tabStorage, localStorage, sessionStorage, cloudStorage, location } =
    host

  specs = { ...specs, ..._specs }

  const keyboard: Keyboard = {
    $pressed: [],
    $repeat: false,
  }

  const gamepad: Gamepad[] = []

  const customEvent = new Set<string>()
  const context = []
  const input = {
    keyboard,
    gamepad,
  }

  const flag = {
    dragAndDrop: {},
    pointerCapture: {},
    spriteSheetMap: {},
  }

  const feature = {}

  const speech = {
    SpeechRecognition,
    SpeechGrammarList,
  }

  // setup storage
  let tab_storage: J
  let session_storage: J
  let local_storage: J
  let cloud_storage: J

  const storage: IOStorage = {
    tab: function (opt?: undefined): J | null {
      if (tab_storage) {
        return tab_storage
      }

      return $tabStorage
    },
    session: function (opt?: undefined): J {
      if (session_storage) {
        return session_storage
      }
      if (sessionStorage) {
        session_storage = new Storage_(localStorage)
        return session_storage
      } else {
        return null
      }
    },
    local: function (opt?: undefined): J {
      if (local_storage !== undefined) {
        return local_storage
      }
      if (localStorage) {
        session_storage = new Storage_(localStorage)
        return session_storage
      } else {
        return null
      }
    },
    cloud: function (opt?: undefined): J {
      if (cloud_storage) {
        return session_storage
      }
      if (localStorage) {
        cloud_storage = new Storage_(cloudStorage)
        return session_storage
      } else {
        return null
      }
    },
  }

  const http = {
    tab: HTTPServer,
    session: HTTPServer,
    local: HTTPServer,
    cloud: HTTPServer,
  }

  const channel = {
    tab: LocalChannel,
    session: LocalChannel,
    local: LocalChannel,
    cloud: LocalChannel,
  }

  const pod = {
    tab: LocalPod,
    session: LocalPod,
    local: LocalPod,
    cloud: LocalPod,
  }

  let hostname = ''

  if (location) {
    hostname = location.hostname
  }

  const $system: System = {
    hostname,
    mounted: false,
    root: null,
    customEvent,
    input,
    context,
    specs,
    classes,
    components,
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
      pbkey: {
        tab: {},
        session: {},
        local: {},
        cloud: {},
      },
    },
    api: {
      storage,
      http,
      channel,
      pod,
      speech,
    },
  }

  return $system
}
