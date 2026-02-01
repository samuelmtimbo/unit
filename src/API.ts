import { Waiter } from './Waiter'
import { IOElement } from './client/IOElement'
import { LayoutNode } from './client/LayoutNode'
import { Theme } from './client/theme'
import { Rect } from './client/util/geometry/types'
import { System } from './system'
import { Tag } from './system/platform/Style'
import { WebSocketShape } from './system/platform/api/network/WebSocket'
import { MeasureTextFunction } from './text'
import { Tree } from './tree'
import { Callback } from './types/Callback'
import { Dict } from './types/Dict'
import { Unlisten } from './types/Unlisten'
import {
  BluetoothDevice,
  BluetoothDeviceOpt,
} from './types/global/BluetoothDevice'
import { DownloadDataOpt as IDownloadTextOpt } from './types/global/DownloadData'
import { DownloadURLOpt } from './types/global/DownloadURL'
import { PositionObserverConstructor } from './types/global/PositionObserver'
import {
  SpeechGrammarList,
  SpeechGrammarListOpt,
} from './types/global/SpeechGrammarList'
import {
  SpeechRecognition,
  SpeechRecognitionOpt,
} from './types/global/SpeechRecognition'
import { SE } from './types/interface/SE'
import { WSS } from './types/interface/WSS'

export type RequestOpt = {
  headers: Dict<string>
  method: string
  body: BodyInit
  cors: boolean
  duplex?: string
}

export type ServerResponse = {
  status: number
  headers: Dict<string>
  body: string | ReadableStream
  ok: boolean
  statusText: string
  type: ResponseType
  url: string
  redirected: boolean
  bodyUsed: boolean
}

export type ServerRequest = {
  url: string
  protocol: string
  headers: Dict<string>
  method: string
  port: string
  query: Dict<string>
  path: string
  search: string
  hostname: string
  origin: string
  body: ReadableStream
  _?: Dict<any>
}

export type ServerOpt = {}

export type Server = SE

export type ServerListener = {
  opt: ServerOpt
  handler: ServerHandler
}

export type InterceptOpt = {
  urls: string[]
}

export type ServerInterceptor = {
  opt: InterceptOpt
  handler: ServerHandler
}

export type ServerSocket = {
  send: (data: string | ArrayBufferLike | Blob | ArrayBufferView) => void
  onmessage: (data: string | ArrayBufferLike | Blob | ArrayBufferView) => void
  onclose: (code: number, message: string) => void
}

export type ServerHandler = (req: ServerRequest) => Promise<ServerResponse>

export type WebSocketServer = WSS

export type ImageCapture = any

export type BasicHTTPResponse = {
  status: number
  headers: Dict<string>
}

export type BasicHTTPRequest = {
  hostname: string
  headers: Dict<string | string[]>
  method: string
  path: string
  search: string
  query: Dict<string>
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
  db: IDBFactory
  http: {
    fetch: (
      url: string,
      opt: RequestInit,
      interceptors: ServerInterceptor[]
    ) => Promise<Response>
    createServer: (system: System, opt: ServerOpt, onerror: Callback) => Server
    handleUpgrade: (
      request: ServerRequest,
      response: Waiter<ServerResponse>,
      ws: Dict<WebSocketShape>,
      wss: Dict<ServerSocket>
    ) => Promise<ServerSocket>
    EventSource: typeof EventSource
  }
  crypto: {
    generateKey: (
      algorithm: AlgorithmIdentifier,
      extractable: boolean,
      keyUsages: string[]
    ) => Promise<CryptoKey | CryptoKeyPair>
    exportKey: <T extends KeyFormat>(
      format: T,
      key: CryptoKey
    ) => Promise<ArrayBuffer | JsonWebKey>
    encrypt: (
      algorithm: AlgorithmIdentifier,
      key: CryptoKey,
      data: BufferSource
    ) => Promise<ArrayBuffer>
    decrypt: (
      algorithm: AlgorithmIdentifier,
      key: CryptoKey,
      data: BufferSource
    ) => Promise<ArrayBuffer>
    sign: (
      algorithm: AlgorithmIdentifier,
      key: CryptoKey,
      data: ArrayBuffer
    ) => Promise<ArrayBuffer>
    verify: (
      algorithm: AlgorithmIdentifier,
      key: CryptoKey,
      signature: BufferSource,
      data: BufferSource
    ) => Promise<boolean>
    importKey<T extends KeyFormat>(
      format: T,
      keyData: T extends 'jwk' ? JsonWebKey : BufferSource,
      algorithm:
        | AlgorithmIdentifier
        | RsaHashedImportParams
        | EcKeyImportParams
        | HmacImportParams
        | AesKeyAlgorithm,
      extractable: boolean,
      keyUsages: ReadonlyArray<KeyUsage>
    ): Promise<CryptoKey>
  }
  alert: {
    alert: (message: string) => void
    prompt: (message: string, defaultValue: string) => string
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
    reflectTreeTrait(
      system: System,
      parentTrait: LayoutNode,
      tree: Tree<Tag>[],
      expandChild: (path: number[]) => Tag[]
    ): void
  }
  speech: {
    SpeechGrammarList: { new (opt: SpeechGrammarListOpt): SpeechGrammarList }
    SpeechRecognition: { new (opt: SpeechRecognitionOpt): SpeechRecognition }
    SpeechSynthesis: SpeechSynthesis
    SpeechSynthesisUtterance: { new (text?: string): SpeechSynthesisUtterance }
  }
  file: {
    FileReader: { new (): FileReader }
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
    localStorage: Storage
    sessionStorage: Storage
    documentPictureInPicture: any
    HTMLElement: typeof HTMLElement
    SVGElement: typeof SVGElement
    SVGSVGElement: typeof SVGSVGElement
    Text: typeof Text
    Notification: typeof Notification
    AudioContext: typeof AudioContext
    OscillatorNode: typeof OscillatorNode
    MediaStreamAudioSourceNode: typeof MediaStreamAudioSourceNode
    RTCPeerConnection: typeof RTCPeerConnection
    AnalyserNode: typeof AnalyserNode
    GainNode: typeof GainNode
    DelayNode: typeof DelayNode
    ImageCapture: ImageCapture
    Audio: { new (): HTMLAudioElement }
    Image: { new (): HTMLImageElement }
    CompressionStream: { new (format: CompressionFormat): CompressionStream }
    DecompressionStream: {
      new (format: CompressionFormat): DecompressionStream
    }
    ReadableStream: typeof ReadableStream
    OffscreenCanvas: typeof OffscreenCanvas
    BroadcastChannel: typeof BroadcastChannel
    WebSocket: typeof WebSocket
    DOMParser: typeof DOMParser
    open: (url: string, target: string, features: string) => Window
    getComputedStyle: (element: Element) => CSSStyleDeclaration
    setTimeout(callback: () => any, ms: number): any
    setInterval(callback: () => any, ms: number): any
    nextTick(callback: () => any): any
    clearTimeout(timer: any): void
    clearInterval(timer: any): void
    addEventListener: Window['addEventListener']
    removeEventListener: Window['removeEventListener']
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
    canSelectShadowDom(): boolean
    getSelection(): Selection
    createRange(): Range
    exitPictureInPicture(): Promise<void>
    addEventListener: Window['document']['addEventListener']
    removeEventListener: Window['document']['removeEventListener']
    exitFullscreen: Document['exitFullscreen']
    visibilityState: Document['visibilityState']
    pictureInPictureElement: Document['pictureInPictureElement']
    fullscreenElement: Document['fullscreenElement']
    documentElement: Document['documentElement']
    MutationObserver: { new (callback: MutationCallback): MutationObserver }
    PositionObserver: PositionObserverConstructor
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
    TextEncoder: typeof TextEncoder
    TextDecoder: typeof TextDecoder
    measureText: MeasureTextFunction
  }
  worker: {
    start(): Worker
  }
  theme: {
    setTheme(theme: Theme): Promise<void>
  }
}
