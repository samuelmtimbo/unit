import { Gamepad } from '../client/gamepad'
import { Keyboard } from '../client/keyboard'
import { APINotSupportedError } from '../exception/APINotImplementedError'
import { DisplayMediaAPINotSupported } from '../exception/DisplayMediaAPINotSupported'
import { API, BootOpt, System } from '../system'
import { UserMediaAPINotSupported } from '../system/platform/api/media/UserMedia/MediaDeviceAPINotSupported'
import { Storage_ } from '../system/platform/api/storage/Storage_'
import _specs from '../system/_specs'
import { IDownloadDataOpt } from '../types/global/IDownloadData'
import {
  ISpeechGrammarList,
  ISpeechGrammarListOpt,
} from '../types/global/ISpeechGrammarList'
import {
  ISpeechRecognition,
  ISpeechRecognitionOpt,
} from '../types/global/ISpeechRecognition'
import {
  ISpeechSynthesis,
  ISpeechSynthesisOpt,
} from '../types/global/ISpeechSynthesis'
import {
  ISpeechSynthesisUtterance,
  ISpeechSynthesisUtteranceOpt,
} from '../types/global/ISpeechSynthesisUtterance'
import { IStorage } from '../types/global/IStorage'

export function noStorage(name: string): IStorage {
  return {
    getItem(key: string): string | null {
      throw new APINotSupportedError(name)
    },
    removeItem(key: string): void {
      throw new APINotSupportedError(name)
    },
    setItem(key: string, value: string): void {
      throw new APINotSupportedError(name)
    },
    clear(): void {
      throw new APINotSupportedError(name)
    },
  }
}

export function noHost(): API {
  const host: API = {
    storage: {
      tab: () => new Storage_(noStorage('Tab Storage')),
      local: () => new Storage_(noStorage('Local Storage')),
      session: () => new Storage_(noStorage('Session Storage')),
      cloud: () => new Storage_(noStorage('Cloud Storage')),
    },
    selection: {
      containsSelection: () => {
        throw new APINotSupportedError('Selection')
      },
      removeSelection: () => {
        throw new APINotSupportedError('Selection')
      },
    },
    file: {
      showOpenFilePicker: () => {
        throw new APINotSupportedError('File System')
      },
      showSaveFilePicker: () => {
        throw new APINotSupportedError('File System')
      },
      downloadData: (opt: IDownloadDataOpt): Promise<void> => {
        throw new APINotSupportedError('Download')
      },
    },
    device: {
      vibrate: () => {
        throw new APINotSupportedError('Vibrate')
      },
    },
    geolocation: {
      getCurrentPosition: () => {
        throw new APINotSupportedError('Geolocation')
      },
    },
    media: {
      getUserMedia: () => {
        throw new UserMediaAPINotSupported()
      },
      getDisplayMedia: () => {
        throw new DisplayMediaAPINotSupported()
      },
      enumerateDevices: () => {
        throw new APINotSupportedError('Enumerate Media Devices')
      },
    },
    screen: {
      requestWakeLock: () => {
        throw new APINotSupportedError('Screen Wake Lock')
      },
    },
    bluetooth: {
      requestDevice: () => {
        throw new APINotSupportedError('Bluetooth')
      },
    },
    clipboard: {
      readText: () => {
        throw new APINotSupportedError('Clipboard')
      },
      writeText: () => {
        throw new APINotSupportedError('Clipboard')
      },
    },
    http: {
      tab: function (opt): any {
        throw new APINotSupportedError('Tab HTTP')
      },
      session: function (opt): any {
        throw new APINotSupportedError('Session HTTP')
      },
      local: function (opt): any {
        throw new APINotSupportedError('Local HTTP')
      },
      cloud: function (opt): any {
        throw new APINotSupportedError('Cloud HTTP')
      },
    },
    channel: {
      tab: function (opt): any {
        throw new APINotSupportedError('Tab Channel')
      },
      session: function (opt): any {
        throw new APINotSupportedError('Session Channel')
      },
      local: function (opt): any {
        throw new APINotSupportedError('Local Channel')
      },
      cloud: function (opt): any {
        throw new APINotSupportedError('Cloud Channel')
      },
    },
    pod: {
      tab: function (opt): any {
        throw new APINotSupportedError('Tab Pod')
      },
      session: function (opt): any {
        throw new APINotSupportedError('Session Pod')
      },
      local: function (opt): any {
        throw new APINotSupportedError('Local Pod')
      },
      cloud: function (opt): any {
        throw new APINotSupportedError('Cloud Pod')
      },
    },
    speech: {
      SpeechGrammarList: function (
        opt: ISpeechGrammarListOpt
      ): ISpeechGrammarList {
        throw new APINotSupportedError('Speech Recognition')
      },
      SpeechRecognition: function (
        opt: ISpeechRecognitionOpt
      ): ISpeechRecognition {
        throw new APINotSupportedError('Speech Recognition')
      },
      SpeechSynthesis: function (opt: ISpeechSynthesisOpt): ISpeechSynthesis {
        throw new APINotSupportedError('Speech Synthesis')
      },
      SpeechSynthesisUtterance: function (
        opt: ISpeechSynthesisUtteranceOpt
      ): ISpeechSynthesisUtterance {
        throw new APINotSupportedError('Speech Synthesis')
      },
    },
    document: {
      createElement<K extends keyof HTMLElementTagNameMap>(
        tagName: K,
        options?: ElementCreationOptions
      ): HTMLElementTagNameMap[K] {
        throw new Error() // TODO
      },
      createElementNS<K extends keyof SVGElementTagNameMap>(
        namespaceURI: 'http://www.w3.org/2000/svg',
        qualifiedName: K
      ): SVGElementTagNameMap[K] {
        throw new Error()
      },
      createTextNode(text: string): Text {
        throw new Error()
      },
    },
  }

  return host
}

export function boot(opt: BootOpt = {}): System {
  let { specs, components, classes, host: api = noHost() } = opt

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

  const $system: System = {
    mounted: false,
    root: null,
    customEvent,
    input,
    context,
    specs,
    classes,
    components,
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
      pbkey: {
        tab: {},
        session: {},
        local: {},
        cloud: {},
      },
    },
    api,
  }

  return $system
}
