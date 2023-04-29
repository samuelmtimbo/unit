import { IOElement } from './client/IOElement'
import { Rect, Size } from './client/util/geometry'
import {
  APIAlert,
  APIChannel,
  APIHTTP,
  APIStorage,
  IFilePickerOpt,
  IO_INIT,
} from './system'
import { Dict } from './types/Dict'
import {
  IBluetoothDevice,
  IBluetoothDeviceOpt,
} from './types/global/IBluetoothDevice'
import { IDeviceInfo } from './types/global/IDeviceInfo'
import { IDisplayMediaOpt } from './types/global/IDisplayMedia'
import { IDownloadDataOpt as IDownloadTextOpt } from './types/global/IDownloadData'
import { IDownloadURLOpt } from './types/global/IDownloadURL'
import { IGeoPosition } from './types/global/IGeoPosition'
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
import { Unlisten } from './types/Unlisten'

export type API = {
  animation: {
    requestAnimationFrame: (callback: FrameRequestCallback) => number
    cancelAnimationFrame: (frame: number) => void
  }
  storage: APIStorage
  db: IDBFactory
  http: APIHTTP
  channel: APIChannel
  alert: APIAlert
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
  speech: {
    SpeechGrammarList: IO_INIT<ISpeechGrammarList, ISpeechGrammarListOpt>
    SpeechRecognition: IO_INIT<ISpeechRecognition, ISpeechRecognitionOpt>
    SpeechSynthesis: IO_INIT<ISpeechSynthesis, ISpeechSynthesisOpt>
    SpeechSynthesisUtterance: IO_INIT<
      ISpeechSynthesisUtterance,
      ISpeechSynthesisUtteranceOpt
    >
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
    readText: () => Promise<string>
    writeText: (text: string) => Promise<void>
  }
  geolocation: {
    getCurrentPosition: () => Promise<IGeoPosition>
  }
  location: {
    toString: () => Promise<string>
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
    getSelection(): Selection
    createRange(): Range
    MutationObserver: IMutationObserverConstructor
    PositionObserver: IPositionObserverCostructor
    ResizeObserver: IResizeObserverConstructor
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
}
