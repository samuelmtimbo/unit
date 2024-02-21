import { IOElement } from './client/IOElement'
import { LayoutNode } from './client/LayoutNode'
import { Theme } from './client/theme'
import { Rect, Size } from './client/util/geometry/types'
import { Style } from './system/platform/Style'
import { Dict } from './types/Dict'
import { Unlisten } from './types/Unlisten'
import {
  BluetoothDevice,
  BluetoothDeviceOpt,
} from './types/global/BluetoothDevice'
import { Channel, ChannelOpt } from './types/global/Channel'
import { DownloadDataOpt as IDownloadTextOpt } from './types/global/DownloadData'
import { DownloadURLOpt } from './types/global/DownloadURL'
import { PositionObserverCostructor } from './types/global/PositionObserver'
import {
  SpeechGrammarList,
  SpeechGrammarListOpt,
} from './types/global/SpeechGrammarList'
import {
  SpeechRecognition,
  SpeechRecognitionOpt,
} from './types/global/SpeechRecognition'
import { J } from './types/interface/J'

export type ImageCapture = any

export type BasicHTTPResponse = {
  status: number
  headers: Dict<string>
  body: string
}

export type BasicHTTPRequest = {
  headers: Dict<string>
  method: string
  path: string
  body: string
}

export type BasicHTTPHandler = (
  req: BasicHTTPRequest
) => Promise<BasicHTTPResponse>

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

export type API = {
  animation: {
    requestAnimationFrame: (callback: FrameRequestCallback) => number
    cancelAnimationFrame: (frame: number) => void
  }
  storage: { local: () => J }
  db: IDBFactory
  http: {
    fetch: (url: string, opt: RequestInit) => Promise<Response>
    listen: (port: number, handler: BasicHTTPHandler) => Unlisten
    EventSource: typeof EventSource
  }
  channel: { local: (opt: ChannelOpt) => Channel }
  alert: {
    alert: (message: string) => void
    prompt: (message: string) => string
  }
  navigator: {
    share: (data: ShareData) => Promise<void>
  }
  input: {
    keyboard: {}
    gamepad: {
      getGamepad: (i: number) => Gamepad
      addEventListener: (
        type: 'gamepadconnected' | 'gamepaddisconnected',
        listener: (ev: GamepadEvent) => any,
        options?: boolean | AddEventListenerOptions
      ) => Unlisten
    }
    pointer: {
      getPointerPosition: (pointerId: number) => {
        screenX: number
        screenY: number
      }
      setPointerCapture: (
        element: HTMLElement | SVGElement,
        pointerId: number
      ) => Unlisten
    }
  }
  url: {
    createObjectURL: (obj) => Promise<string>
  }
  uri: {
    encodeURI?: (str: string) => string
    encodeURIComponent?: (str: string) => string
  }
  layout: {
    reflectChildrenTrait(
      parentTrait: LayoutNode,
      parentStyle: Style,
      children: Style[],
      path?: number[],
      expandChild?: (path: number[]) => Style[]
    ): LayoutNode[]
  }
  speech: {
    SpeechGrammarList: (opt: SpeechGrammarListOpt) => SpeechGrammarList
    SpeechRecognition: (opt: SpeechRecognitionOpt) => SpeechRecognition
    SpeechSynthesis: SpeechSynthesis
    SpeechSynthesisUtterance: { new (text?: string): SpeechSynthesisUtterance }
  }
  file: {
    isSaveFilePickerSupported: () => boolean
    isOpenFilePickerSupported: () => boolean
    showSaveFilePicker: (opt: IFilePickerOpt) => Promise<FileSystemFileHandle>
    showOpenFilePicker: (opt: IFilePickerOpt) => Promise<FileSystemFileHandle[]>
    fallbackShowOpenFilePicker: (opt: IFilePickerOpt) => Promise<File[]>
    downloadURL: (opt: DownloadURLOpt) => Promise<void>
    downloadText: (opt: IDownloadTextOpt) => Promise<void>
  }
  screen: {
    devicePixelRatio?: number
    wakeLock: {
      request: (type?: 'screen') => Promise<WakeLockSentinel>
    }
  }
  bluetooth: {
    requestDevice: (type: BluetoothDeviceOpt) => Promise<BluetoothDevice>
  }
  device: {
    vibrate: (opt: VibratePattern) => Promise<void>
  }
  clipboard: {
    read: () => Promise<any>
    readText: () => Promise<string>
    writeText: (text: string) => Promise<void>
  }
  geolocation: {
    getCurrentPosition: () => Promise<GeolocationCoordinates>
  }
  location: {
    toString: () => Promise<string>
  }
  history: {
    pushState: (data: any, title: string, url: string) => void
    replaceState: (data: any, title: string, url: string) => void
  }
  media: {
    getUserMedia: (opt: MediaStreamConstraints) => Promise<MediaStream>
    getDisplayMedia: (opt: DisplayMediaStreamOptions) => Promise<MediaStream>
    enumerateDevices: () => Promise<MediaDeviceInfo[]>
    image: {
      createImageBitmap: (
        image: ImageBitmapSource,
        rect: Partial<Rect>,
        opt: {}
      ) => Promise<ImageBitmap>
    }
  }
  selection: {
    containsSelection: (element: IOElement) => boolean
    removeSelection: () => void
  }
  window: {
    AudioContext: AudioContext
    OscillatorNode: OscillatorNode
    MediaStreamAudioSourceNode: MediaStreamAudioSourceNode
    AnalyserNode: AnalyserNode
    GainNode: GainNode
    DelayNode: DelayNode
    ImageCapture: ImageCapture
    CompressionStream: { new (format: CompressionFormat): CompressionStream }
    DecompressionStream: {
      new (format: CompressionFormat): DecompressionStream
    }
    ReadableStream: ReadableStream
    open: (url: string, target: string, features: string) => Window
    getComputedStyle: (element: Element) => CSSStyleDeclaration
  }
  document: {
    createElement<K extends keyof HTMLElementTagNameMap>(
      tagName: K
    ): HTMLElementTagNameMap[K]
    createElementNS<K extends keyof SVGElementTagNameMap>(
      namespaceURI: 'http://www.w3.org/2000/svg',
      qualifiedName: K
    ): SVGElementTagNameMap[K]
    createTextNode(text: string): Text
    elementsFromPoint(x: number, y: number): Element[]
    elementFromPoint(x: number, y: number): Element
    exitPictureInPicture(): Promise<void>
    getSelection(): Selection
    createRange(): Range
    exitPictureInPicture(): Promise<void>
    MutationObserver: { new (callback: MutationCallback): MutationObserver }
    PositionObserver: PositionObserverCostructor
    ResizeObserver: { new (callback: ResizeObserverCallback): ResizeObserver }
    IntersectionObserver: {
      new (
        callback: IntersectionObserverCallback,
        options?: IntersectionObserverInit
      ): IntersectionObserver
    }
  }
  querystring: {
    stringify: (obj: Dict<any>) => string
    parse: (str: string) => Dict<any>
  }
  text: {
    measureText: (text: string, fontSize: number) => Size
  }
  worker: {
    start(): Worker
  }
  theme: {
    setTheme(theme: Theme): Promise<void>
  }
}
