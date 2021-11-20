import { $tabStorage } from '../api/storage/tab'
import { Gamepad } from '../client/gamepad'
import { Keyboard } from '../client/keyboard'
import { J } from '../interface/J'
import { spawn } from '../spawn'
import { Storage_ } from '../system/platform/api/storage/Storage_'
import { BundleSpec } from '../system/platform/method/process/BundleSpec'
import { BootOpt, System, IOStorage, HTTPServer } from '../system'

export function boot(bundle: BundleSpec, opt: BootOpt): System {
  const { specs, components, classes, host = {} } = opt

  const { tabStorage, localStorage, sessionStorage, cloudStorage, location } =
    host

  globalThis.__specs = specs
  globalThis.__components = components
  globalThis.__classes = classes

  const keyboard: Keyboard = {
    $pressed: [],
    $repeat: false,
  }

  const gamepad: Gamepad[] = []

  const pod = spawn(bundle)

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

  // setup storage
  let tab_storage: J
  let session_storage: J
  let local_storage: J
  let cloud_storage: J

  const $storage: IOStorage = {
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

  let hostname = ''

  if (location) {
    hostname = location.hostname
  }

  const $system: System = {
    hostname,
    mounted: false,
    root: null,
    pod: pod,
    customEvent,
    input,
    context,
    specs,
    flag,
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
    deps: {
      script: {},
      style: {},
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
      storage: $storage,
      http: {
        tab: HTTPServer,
        session: HTTPServer,
        local: HTTPServer,
        cloud: HTTPServer,
      },
    },
  }

  pod.attach($system)

  return $system
}
