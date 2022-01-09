import { boot } from '../../../boot'
import { Graph } from '../../../Class/Graph'
import { APINotSupportedError } from '../../../exception/APINotImplementedError'
import { DisplayMediaAPINotSupported } from '../../../exception/DisplayMediaAPINotSupported'
import { AsyncGraph } from '../../../interface/async/AsyncGraph'
import { U } from '../../../interface/U'
import { NOOP } from '../../../NOOP'
import { sleep } from '../../../sleep'
import { spawn, start } from '../../../spawn'
import { API, BootOpt, System } from '../../../system'
import deepMerge from '../../../system/f/object/DeepMerge/f'
import { UserMediaAPINotSupported } from '../../../system/platform/api/media/UserMedia/MediaDeviceAPINotSupported'
import { Storage_ } from '../../../system/platform/api/storage/Storage_'
import { BundleSpec } from '../../../system/platform/method/process/BundleSpec'
import classes from '../../../system/_classes'
import components from '../../../system/_components'
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
import env, { dev, prod } from '../../env'
import { isConnected, send } from '../../host/socket'
import noise from '../../paperBackground'
import { render } from '../../render'
import root from '../../root'
import { showNotification } from '../../showNotification'
import { COLOR_RED } from '../../theme'
import { isPWA } from '../../util/web/isPWA'
import init from './init'

export default function webRender(
  bundle: BundleSpec,
  opt: BootOpt = {}
): System {
  console.log('env', env)

  const { specs } = bundle

  if (env === 'production') {
    console.log = function () {}
  }

  window.addEventListener('error', function (event: ErrorEvent) {
    let message = event.message || event.error

    if (isConnected()) {
      send({
        type: 'client',
        data: {
          type: 'log',
          data: {
            type: 'error',
            data: {
              message,
            },
          },
        },
      })
    }

    // AD HOC
    if (message === 'ResizeObserver loop limit exceeded') {
      return
    }

    if (
      message.startsWith(
        'Uncaught RangeError: Maximum call stack size exceeded'
      )
    ) {
      message = 'Maximum call stack size exceeded.'
    }

    // log('error', message)
    showNotification(message, {
      // showNotification('An exception has ocurred; please refresh.', {
      color: COLOR_RED,
      borderColor: COLOR_RED,
    })

    return false
  })

  window.addEventListener('unhandledrejection', function (event) {
    console.log('unhandledrejection', event)
    // TODO logging
  })

  // Vivaldi

  const TEXT_INPUT_TYPE_SET = new Set([
    'text',
    'password',
    'file',
    'search',
    'email',
    'number',
    'date',
    'color',
    'datetime',
    'datetime-local',
    'month',
    'range',
    'search',
    'tel',
    'time',
    'url',
    'week',
  ])

  window.addEventListener(
    'keydown',
    (event) => {
      const { key, target } = event
      let doPrevent = true
      if (key === 'Backspace') {
        if (target instanceof HTMLElement) {
          const { tagName, isContentEditable } = target
          if (isContentEditable) {
            doPrevent = false
          } else if (tagName === 'TEXTAREA') {
            doPrevent = false
          } else if (tagName === 'INPUT') {
            let { type } = target as HTMLInputElement
            type = type.toLowerCase()
            if (TEXT_INPUT_TYPE_SET.has(type)) {
              doPrevent = false
            }
          }
        }
        if (doPrevent) {
          event.preventDefault()
          return false
        }
      }
    },
    true
  )

  if (prod && isPWA) {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        const { pathname } = location

        const swUrl = `${
          pathname.endsWith('/') ? pathname : `${pathname}/`
        }sw.js`

        navigator.serviceWorker
          .register(swUrl)
          .then((registration) => {
            registration.onupdatefound = () => {
              const installingWorker = registration.installing
              if (installingWorker) {
                installingWorker.onstatechange = () => {
                  if (installingWorker.state === 'installed') {
                    if (navigator.serviceWorker.controller) {
                      !dev &&
                        showNotification(
                          'A new update is available; please refresh.',
                          { color: '#ffcc00', borderColor: '#ffcc00' },
                          3000
                        )
                    } else {
                      !dev &&
                        showNotification(
                          'App is cached for offline use.',
                          { color: '#ffcc00', borderColor: '#ffcc00' },
                          3000
                        )
                    }
                  }
                }
              } else {
                console.log('registration.installing worker was not found')
              }
            }
          })
          .catch((error) => {
            console.error('Error during service worker registration:', error)
          })
      })
    }
  }

  noise(document.body)

  const tabStorage: Storage = {
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
    if (!window.SpeechSynthesis) {
      throw new APINotSupportedError('Speech Synthesis')
    }

    const speechSynthesis = new window.SpeechSynthesis()

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
    if (!window.SpeechSynthesisUtterance) {
      throw new APINotSupportedError('Speech Synthesis')
    }

    const utterance = new window.SpeechSynthesisUtterance(text)
    utterance.voice = voice

    return utterance
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
      navigator.geolocation.getCurrentPosition
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
        throw new UserMediaAPINotSupported()
      }

      if (!navigator.mediaDevices.getUserMedia) {
        throw new UserMediaAPINotSupported()
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
    tab: () => new Storage_(tabStorage),
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
    pod,
    speech,
    document: _document,
  }

  const _opt = deepMerge({ specs, classes, components, host: api }, opt)

  const _system = boot(_opt)

  const _pod = spawn(_system)

  const [mapping, graph] = start(_system, _pod, bundle)

  const $graph = AsyncGraph(graph)

  const unlisten = init(_system, root)

  render(root, _system, _pod, $graph)

  return _system
}
