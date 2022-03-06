import { boot } from '../../../boot'
import { Graph } from '../../../Class/Graph'
import { APINotSupportedError } from '../../../exception/APINotImplementedError'
import { DisplayMediaAPINotSupported } from '../../../exception/DisplayMediaAPINotSupported'
import { MediaDevicesAPINotSupported } from '../../../exception/MediaDeviceAPINotSupported'
import { U } from '../../../interface/U'
import { NOOP } from '../../../NOOP'
import { sleep } from '../../../sleep'
import { API, System } from '../../../system'
import { Storage_ } from '../../../system/platform/api/storage/Storage_'
import { BundleSpec } from '../../../system/platform/method/process/BundleSpec'
import { GraphSpecs } from '../../../types'
import { Callback } from '../../../types/Callback'
import { Dict } from '../../../types/Dict'
import { IBluetoothDeviceOpt } from '../../../types/global/IBluetoothDevice'
import { IBluetoothServer } from '../../../types/global/IBluetoothServer'
import { IChannel, IChannelOpt } from '../../../types/global/IChannel'
import { IDisplayMediaOpt } from '../../../types/global/IDisplayMedia'
import { IDownloadDataOpt } from '../../../types/global/IDownloadData'
import { IFileHandler } from '../../../types/global/IFileHandler'
import { IGeoPosition } from '../../../types/global/IGeoPosition'
import { IHTTPServer, IHTTPServerOpt } from '../../../types/global/IHTTPServer'
import { IPod, IPodOpt } from '../../../types/global/IPod'
import {
  ISpeechGrammarList,
  ISpeechGrammarListOpt,
} from '../../../types/global/ISpeechGrammarList'
import {
  ISpeechRecognition,
  ISpeechRecognitionOpt,
} from '../../../types/global/ISpeechRecognition'
import {
  ISpeechSynthesis,
  ISpeechSynthesisOpt,
} from '../../../types/global/ISpeechSynthesis'
import {
  ISpeechSynthesisUtterance,
  ISpeechSynthesisUtteranceOpt,
} from '../../../types/global/ISpeechSynthesisUtterance'
import { IUserMediaOpt } from '../../../types/global/IUserMedia'
import { IWakeLock } from '../../../types/global/IWakeLock'
import { Unlisten } from '../../../types/Unlisten'
import { PeerSpec } from '../../host/service/peer'
import { VMSpec } from '../../host/service/vm'
import { WebSpec } from '../../host/service/web'
import { createSharedServiceApi } from '../../host/store'
import { MutationObserver_ } from '../../MutationObserver_'
import { PositionObserver } from '../../PositionObserver'
import { attachApp } from '../../render/attachApp'
import { attachCanvas } from '../../render/attachCanvas'
import { attachGesture } from '../../render/attachGesture'
import { attachLongPress } from '../../render/attachLongPress'
import { attachSprite } from '../../render/attachSprite'
import { attachSVG } from '../../render/attachSVG'
import { ResizeObserver_ } from '../../ResizeObserver_'
import { SYSTEM_ROOT_ID } from '../../SYSTEM_ROOT_ID'
import { Size } from '../../util/geometry'
import { measureText } from '../../util/web/measureText'

export default function webBoot(): System {
  return _webBoot(window)
}

export function _webBoot(window: Window): System {
  const { document, fetch, navigator } = window

  const root = document.getElementById(SYSTEM_ROOT_ID)

  // @ts-ignore
  const MutationObserver = window.MutationObserver || MutationObserver_

  // @ts-ignore
  const ResizeObserver = window.ResizeObserver || ResizeObserver_

  const cloudStorage: Storage = {
    length: 0,

    clear: function (): void {
      throw new Error('Function not implemented.')
    },

    getItem: function (key: string): string {
      throw new Error('Function not implemented.')
    },

    key: function (index: number): string {
      throw new Error('Function not implemented.')
    },

    removeItem: function (key: string): void {
      throw new Error('Function not implemented.')
    },

    setItem: function (key: string, value: string): void {
      throw new Error('Function not implemented.')
    },
  }

  async function requestWakeLock(): Promise<IWakeLock> {
    throw new APINotSupportedError('Screen Wake Lock')
  }

  const HTTPServer = (opt: IHTTPServerOpt): IHTTPServer => {
    return {
      listen(port: number): Unlisten {
        return NOOP
      },
    }
  }

  const LocalChannel = (opt: IChannelOpt): IChannel => {
    return {
      close(): void {},
      postMessage(message: any): void {},
      addListener(event: string, callback: Callback): Unlisten {
        return NOOP
      },
    }
  }

  const LocalPod = (opt: IPodOpt): IPod => {
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

  const SpeechRecognition = ({
    lang,
    grammars,
    continuous,
    interimResults,
    maxAlternatives,
  }: ISpeechRecognitionOpt): ISpeechRecognition => {
    const SpeechRecognition_ =
      // @ts-ignore
      window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition_) {
      throw new APINotSupportedError('Speech')
    }

    const recognition = new SpeechRecognition_()

    if (grammars) {
      recognition.grammars = grammars
    }
    recognition.lang = lang
    recognition.interimResults = interimResults
    recognition.maxAlternatives = maxAlternatives
    recognition.continuous = continuous

    const speechRecognition: ISpeechRecognition = {
      start: function (): void {
        recognition.start()
      },
      stop: function (): void {
        recognition.start()
      },
      addListener: function (event, listener): Unlisten {
        let _listener = listener
        if (event === 'error') {
          _listener = ({ error }) => {
            if (error === 'aborted' || error === 'no-speech') {
              return
            }
            listener(error)
          }
        } else if (event === 'result') {
          _listener = (event) => {
            const results = event.results
            listener(results)
          }
        }
        recognition.addEventListener(event, _listener)
        return () => {
          recognition.removeEventListener(event, _listener)
        }
      },
    }

    return speechRecognition
  }

  const SpeechGrammarList = (
    opt: ISpeechGrammarListOpt
  ): ISpeechGrammarList => {
    const SpeechGrammarList_ =
      // @ts-ignore
      window.SpeechGrammarList || window.webkitSpeechGrammarList
    if (!SpeechGrammarList_) {
      throw new APINotSupportedError('Speech')
    }

    const speechRecognitionList = new SpeechGrammarList_()

    return speechRecognitionList
  }

  const SpeechSynthesis = (opt: ISpeechSynthesisOpt): ISpeechSynthesis => {
    if (!window.speechSynthesis) {
      throw new APINotSupportedError('Speech Synthesis')
    }

    const { speechSynthesis } = window

    return {
      getVoices: () => {
        return speechSynthesis.getVoices()
      },
      speak(utterance: ISpeechSynthesisUtterance): void {
        speechSynthesis.speak(utterance)
      },
    }
  }

  const SpeechSynthesisUtterance = ({
    text,
    voice,
  }: ISpeechSynthesisUtteranceOpt): ISpeechSynthesisUtterance => {
    // @ts-ignore
    if (!window.SpeechSynthesisUtterance) {
      throw new APINotSupportedError('Speech Synthesis')
    }

    // @ts-ignore
    const utterance = new window.SpeechSynthesisUtterance(text)
    utterance.voice = voice

    return utterance
  }

  // TODO
  const http = {
    server: {
      local: HTTPServer,
      cloud: HTTPServer,
    },
    fetch: fetch,
  }

  // TODO
  const channel = {
    tab: LocalChannel,
    session: LocalChannel,
    local: LocalChannel,
    cloud: LocalChannel,
  }

  // TODO
  const pod = {
    session: LocalPod,
    local: LocalPod,
    cloud: LocalPod,
  }

  function showSaveFilePicker(opt: {
    suggestedName?: string
    startIn?: string
    id?: string
    excludeAcceptAllOption?: boolean
    types?: {
      description: string
      accept: Dict<string[]>
    }[]
  }): Promise<IFileHandler[]> {
    if (globalThis.showSaveFilePicker) {
      return globalThis.showSaveFilePicker(opt)
    } else {
      throw new APINotSupportedError('File System')
    }
  }

  function showOpenFilePicker(opt: {
    suggestedName?: string
    startIn?: string
    id?: string
    excludeAcceptAllOption?: boolean
    types?: {
      description: string
      accept: Dict<string[]>
    }[]
    multiple?: boolean
  }): Promise<IFileHandler[]> {
    if (globalThis.showOpenFilePicker) {
      return globalThis.showOpenFilePicker(opt)
    } else {
      throw new APINotSupportedError('File System')
    }
  }

  const downloadData = async ({
    name,
    mimeType,
    charset,
    data,
  }: IDownloadDataOpt) => {
    const dataStr = `data:${mimeType};charset=${charset},${encodeURIComponent(
      data
    )}`
    const a = document.createElement('a')
    document.body.appendChild(a)
    a.download = name
    a.href = dataStr
    a.click()
    document.body.removeChild(a)
  }

  const file = {
    showSaveFilePicker,
    showOpenFilePicker,
    downloadData,
  }

  const screen = {
    requestWakeLock,
  }

  const bluetooth = {
    requestDevice: async (opt: IBluetoothDeviceOpt) => {
      // @ts-ignore
      if (navigator.bluetooth) {
        // show system UI on next tick to prevent possible
        // interference with triggering event propagation
        await sleep()

        try {
          // @ts-ignore
          const device = await navigator.bluetooth.requestDevice(opt)

          return {
            getServer: async () => {
              const { gatt } = device
              if (gatt) {
                try {
                  return (await device.gatt.connect()) as IBluetoothServer
                } catch (err) {
                  throw new Error(err.message)
                }
              } else {
                throw new Error(
                  'cannot find bluetooth device remote GATT server'
                )
              }
            },
          }
        } catch (err) {
          const { message } = err
          if (message === 'User cancelled the requestDevice() chooser.') {
            throw new Error('user cancelled chooser')
          } else if (
            message ===
            "Failed to execute 'requestDevice' on 'Bluetooth': Either 'filters' should be present or 'acceptAllDevices' should be true, but not both."
          ) {
            throw new Error(
              `either 'filters' should be present or 'acceptAllDevices' should be true, but not both.`
            )
          } else {
            throw err
          }
        }
      } else {
        throw new APINotSupportedError('Bluetooth')
      }
    },
  }

  const device = {
    vibrate: async (pattern: VibratePattern) => {
      if (navigator.vibrate) {
        navigator.vibrate(pattern)
      } else {
        throw new APINotSupportedError('Vibrate')
      }
    },
  }

  const getCurrentPosition = async (): Promise<IGeoPosition> => {
    if (
      !navigator ||
      !navigator.geolocation ||
      !navigator.geolocation.getCurrentPosition
    ) {
      throw new APINotSupportedError('Geolocation')
    }

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition((position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
      })
    })
  }

  const geolocation = {
    getCurrentPosition,
  }

  const speech = {
    SpeechRecognition,
    SpeechGrammarList,
    SpeechSynthesis,
    SpeechSynthesisUtterance,
  }

  const media = {
    getUserMedia: async (opt: IUserMediaOpt): Promise<MediaStream> => {
      if (!navigator || !navigator.mediaDevices) {
        throw new MediaDevicesAPINotSupported()
      }

      if (!navigator.mediaDevices.getUserMedia) {
        throw new MediaDevicesAPINotSupported()
      }

      try {
        return await navigator.mediaDevices.getUserMedia(opt)
      } catch (err) {
        const { message } = err

        if (
          message ===
          "Failed to execute 'getUserMedia' on 'MediaDevices': At least one of audio and video must be requested"
        ) {
          throw new Error('at least one of audio or video must be requested')
        }

        throw err
      }
    },
    getDisplayMedia: async (opt: IDisplayMediaOpt): Promise<MediaStream> => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
        throw new DisplayMediaAPINotSupported()
      }

      try {
        return navigator.mediaDevices.getDisplayMedia(opt)
      } catch (err) {
        throw new Error(err.message)
      }
    },
    enumerateDevices: async () => {
      if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
        throw new APINotSupportedError('Enumerate Media Devices')
      }

      return navigator.mediaDevices
        .enumerateDevices()
        .then((ds: MediaDeviceInfo[]) => {
          return ds.map((d) => ({
            deviceId: d.deviceId,
            kind: d.kind,
            groupId: d.groupId,
            label: d.label,
          }))
        })
    },
  }

  const readText = async () => {
    if (navigator.clipboard && navigator.clipboard.readText) {
      const text = await navigator.clipboard.readText()
      return text
    }
  }

  const writeText = async (text: string) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text)
    } else {
      throw new APINotSupportedError('Clipboard')
    }
  }

  const clipboard = {
    readText,
    writeText,
  }

  const containsSelection = (element) => {
    const selection = window.getSelection()

    if (selection) {
      const { anchorNode } = selection

      return element.contains(anchorNode)
    }
  }

  const removeSelection = () => {
    const selection = window.getSelection()

    selection.removeAllRanges()
  }

  const selection = {
    containsSelection,
    removeSelection,
  }

  const storage = {
    local: () => new Storage_(localStorage),
    session: () => new Storage_(sessionStorage),
    cloud: () => new Storage_(cloudStorage),
  }

  const _document = {
    createElement<K extends keyof HTMLElementTagNameMap>(
      tagName: K
    ): HTMLElementTagNameMap[K] {
      return document.createElement(tagName)
    },
    createElementNS<K extends keyof SVGElementTagNameMap>(
      namespaceURI: 'http://www.w3.org/2000/svg',
      qualifiedName: K
    ): SVGElementTagNameMap[K] {
      return document.createElementNS(namespaceURI, qualifiedName)
    },
    createTextNode(text: string): Text {
      return document.createTextNode(text)
    },
    MutationObserver: MutationObserver,
    ResizeObserver: ResizeObserver,
    PositionObserver: PositionObserver,
  }

  const querystring = {
    parse: (str: string): Dict<any> => {
      const urlSearchParams = new URLSearchParams(str)
      const obj = {}
      urlSearchParams.forEach((value, key) => {
        obj[key] = value
      })
      return obj
    },
    stringify: (obj: Dict<any>): string => {
      const urlSearchParams = new URLSearchParams(obj)
      const str = urlSearchParams.toString()
      return str
    },
  }

  const _canvas: HTMLCanvasElement = document.createElement('canvas')
  const _ctx = _canvas.getContext('2d')
  _ctx.textAlign = 'center'

  const text = {
    measureText: (text: string, fontSize: number): Size => {
      return measureText(_ctx, text, fontSize)
    },
  }

  const host = {
    fetch: (opt) => fetch(location.host, opt),
    send: () => {
      // TODO
    },
  }

  const input: API['input'] = {
    keyboard: {},
    gamepad: {
      getGamepads: () => {
        return navigator.getGamepads()
      },
      addEventListener: (
        type: 'gamepadconnected' | 'gamepadisconnected',
        listener: (ev: GamepadEvent) => any,
        options?: boolean | AddEventListenerOptions
      ) => {
        return window.addEventListener(type, listener, options)
      },
      removeEventListener: (
        type: 'gamepadconnected' | 'gamepadisconnected',
        listener: (ev: GamepadEvent) => any,
        options?: boolean | AddEventListenerOptions
      ): void => {
        return window.removeEventListener(type, listener, options)
      },
    },
  }

  const api: API = {
    storage,
    selection,
    file,
    device,
    screen,
    bluetooth,
    clipboard,
    geolocation,
    media,
    http,
    channel,
    input,
    pod,
    speech,
    document: _document,
    querystring,
    text,
    service: {
      graph: (opt: {}) =>
        createSharedServiceApi<BundleSpec>(system, '', 'graph'),
      web: (opt: {}) => createSharedServiceApi<WebSpec>(system, '', 'web'),
      peer: (opt: {}) => createSharedServiceApi<PeerSpec>(system, '', 'web'),
      vm: (opt: {}) => createSharedServiceApi<VMSpec>(system, '', 'web'),
    },
    worker: {
      start() {
        const { href } = location
        const url = `${href}/_worker.js`
        const worker = new Worker(url)
        return worker
      },
    },
    host,
  }

  const system = boot({ api })

  system.root = root
  system.mounted = true

  attachSprite(system)
  attachApp(system)
  attachCanvas(system)
  attachGesture(system)
  attachSVG(system)
  attachLongPress(system)

  return system
}
