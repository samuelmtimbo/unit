import { IOElement } from './client/IOElement'
import { LayoutNode } from './client/LayoutNode'
import { Theme } from './client/theme'
import { Rect, Size } from './client/util/geometry/types'
import { Style } from './system/platform/Props'
import { Dict } from './types/Dict'
import { Unlisten } from './types/Unlisten'
import {
  IBluetoothDevice,
  IBluetoothDeviceOpt,
} from './types/global/IBluetoothDevice'
import { IChannel, IChannelOpt } from './types/global/IChannel'
import { IDeviceInfo } from './types/global/IDeviceInfo'
import { IDisplayMediaOpt } from './types/global/IDisplayMedia'
import { IDownloadDataOpt as IDownloadTextOpt } from './types/global/IDownloadData'
import { IDownloadURLOpt } from './types/global/IDownloadURL'
import { IGeoPosition } from './types/global/IGeoPosition'
import { IIntersectionObserverConstructor } from './types/global/IIntersectionObserver'
import { IMutationObserverConstructor } from './types/global/IMutationObserver'
import { IPositionObserverCostructor } from './types/global/IPositionObserver'
import { IResizeObserverConstructor } from './types/global/IResizeObserver'
import {
  ISpeechGrammarList,
  ISpeechGrammarListOpt,
} from './types/global/ISpeechGrammarList'
import {
  ISpeechRecognition,
  ISpeechRecognitionOpt,
} from './types/global/ISpeechRecognition'
import {
  ISpeechSynthesis,
  ISpeechSynthesisOpt,
} from './types/global/ISpeechSynthesis'
import {
  ISpeechSynthesisUtterance,
  ISpeechSynthesisUtteranceOpt,
} from './types/global/ISpeechSynthesisUtterance'
import { IUserMediaOpt } from './types/global/IUserMedia'
import { IWakeLock, IWakeLockOpt } from './types/global/IWakeLock'
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
  channel: { local: (opt: IChannelOpt) => IChannel }
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
    SpeechGrammarList: (opt: ISpeechGrammarListOpt) => ISpeechGrammarList
    SpeechRecognition: (opt: ISpeechRecognitionOpt) => ISpeechRecognition
    SpeechSynthesis: (opt: ISpeechSynthesis) => ISpeechSynthesisOpt
    SpeechSynthesisUtterance: (
      opt: ISpeechSynthesisUtteranceOpt
    ) => ISpeechSynthesisUtterance
  }
  file: {
    isSaveFilePickerSupported: () => boolean
    isOpenFilePickerSupported: () => boolean
    showSaveFilePicker: (opt: IFilePickerOpt) => Promise<FileSystemFileHandle>
    showOpenFilePicker: (opt: IFilePickerOpt) => Promise<FileSystemFileHandle[]>
    fallbackShowOpenFilePicker: (opt: IFilePickerOpt) => Promise<File[]>
    downloadURL: (opt: IDownloadURLOpt) => Promise<void>
    downloadText: (opt: IDownloadTextOpt) => Promise<void>
  }
  screen: {
    devicePixelRatio?: number
    requestWakeLock: (type: IWakeLockOpt) => Promise<IWakeLock>
  }
  bluetooth: {
    requestDevice: (type: IBluetoothDeviceOpt) => Promise<IBluetoothDevice>
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
    getCurrentPosition: () => Promise<IGeoPosition>
  }
  location: {
    toString: () => Promise<string>
  }
  history: {
    pushState: (data: any, title: string, url: string) => void
    replaceState: (data: any, title: string, url: string) => void
  }
  media: {
    getUserMedia: (opt: IUserMediaOpt) => Promise<MediaStream>
    getDisplayMedia: (opt: IDisplayMediaOpt) => Promise<MediaStream>
    enumerateDevices: () => Promise<IDeviceInfo[]>
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
    MutationObserver: IMutationObserverConstructor
    PositionObserver: IPositionObserverCostructor
    ResizeObserver: IResizeObserverConstructor
    IntersectionObserver: IIntersectionObserverConstructor
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
