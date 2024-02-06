import { API, BasicHTTPHandler } from '../API'
import { LayoutNode } from '../client/LayoutNode'
import { Theme } from '../client/theme'
import { APINotSupportedError } from '../exception/APINotImplementedError'
import { DisplayMediaAPINotSupported } from '../exception/DisplayMediaAPINotSupported'
import { MediaDevicesAPINotSupported } from '../exception/MediaDeviceAPINotSupported'
import { MethodNotImplementedError } from '../exception/MethodNotImplementedError'
import { Style } from '../system/platform/Props'
import { Storage_ } from '../system/platform/api/storage/Storage_'
import { Dict } from '../types/Dict'
import { Unlisten } from '../types/Unlisten'
import { IDownloadDataOpt } from '../types/global/IDownloadData'
import { IDownloadURLOpt } from '../types/global/IDownloadURL'
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
  const api: API = {
    storage: {
      local: () => new Storage_(noStorage('Local Storage')),
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
      isSaveFilePickerSupported: () => false,
      isOpenFilePickerSupported: () => false,
      showOpenFilePicker: () => {
        throw new APINotSupportedError('File System')
      },
      showSaveFilePicker: () => {
        throw new APINotSupportedError('File System')
      },
      fallbackShowOpenFilePicker: () => {
        throw new APINotSupportedError('File System')
      },
      downloadText: (opt: IDownloadDataOpt): Promise<void> => {
        throw new APINotSupportedError('Download')
      },
      downloadURL: (opt: IDownloadURLOpt): Promise<void> => {
        throw new APINotSupportedError('Download')
      },
    },
    animation: {
      requestAnimationFrame: () => {
        throw new APINotSupportedError('Animation Frame')
      },
      cancelAnimationFrame: () => {
        throw new APINotSupportedError('Animation Frame')
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
    input: {
      keyboard: {},
      gamepad: {
        getGamepad: () => {
          throw new APINotSupportedError('Gamepad')
        },
        addEventListener: (
          type: 'gamepadconnected' | 'gamepaddisconnected',
          listener: (ev: GamepadEvent) => any,
          options?: boolean | AddEventListenerOptions
        ) => {
          throw new APINotSupportedError('Gamepad')
        },
      },
      pointer: {
        getPointerPosition(pointerId: number) {
          throw new APINotSupportedError('Pointer')
        },
        setPointerCapture(
          element: HTMLElement | SVGElement,
          pointerId: number
        ) {
          throw new APINotSupportedError('Pointer Capture')
        },
      },
    },
    media: {
      getUserMedia: () => {
        throw new MediaDevicesAPINotSupported()
      },
      getDisplayMedia: () => {
        throw new DisplayMediaAPINotSupported()
      },
      enumerateDevices: () => {
        throw new APINotSupportedError('Enumerate Media Devices')
      },
      image: {
        createImageBitmap: () => {
          throw new APINotSupportedError('Image Bitmap')
        },
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
      read: () => {
        throw new APINotSupportedError('Clipboard')
      },
      readText: () => {
        throw new APINotSupportedError('Clipboard')
      },
      writeText: () => {
        throw new APINotSupportedError('Clipboard')
      },
    },
    http: {
      fetch: () => {
        throw new APINotSupportedError('Fetch')
      },
      EventSource: undefined,
      listen: function (port: number, handler: BasicHTTPHandler): Unlisten {
        throw new APINotSupportedError('HTTP Server')
      },
    },
    channel: {
      local: function (opt): any {
        throw new APINotSupportedError('Local Channel')
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
        throw new MethodNotImplementedError()
      },
      createElementNS<K extends keyof SVGElementTagNameMap>(
        namespaceURI: 'http://www.w3.org/2000/svg',
        qualifiedName: K
      ): SVGElementTagNameMap[K] {
        throw new MethodNotImplementedError()
      },
      createTextNode(text: string): Text {
        throw new MethodNotImplementedError()
      },
      elementFromPoint(x: number, y: number): Element {
        throw new MethodNotImplementedError()
      },
      elementsFromPoint(x: number, y: number): Element[] {
        throw new MethodNotImplementedError()
      },
      getSelection(): Selection {
        // @ts-ignore
        return root.shadowRoot.getSelection() || document.getSelection()
      },
      createRange(): Range {
        return document.createRange()
      },
      exitPictureInPicture() {
        throw new MethodNotImplementedError()
      },
      MutationObserver: null,
      PositionObserver: null,
      ResizeObserver: null,
      IntersectionObserver: null,
    },
    querystring: {
      stringify: function (obj: Dict<any>): string {
        throw new MethodNotImplementedError()
      },
      parse: function (str: string): Dict<any> {
        throw new MethodNotImplementedError()
      },
    },
    text: {
      measureText: (text: string) => {
        throw new APINotSupportedError('Measure Text')
      },
    },
    worker: {
      start: () => {
        throw new APINotSupportedError('Worker')
      },
    },
    db: undefined,
    url: {
      createObjectURL: function (object: any): Promise<string> {
        throw new MethodNotImplementedError()
      },
    },
    uri: {
      encodeURI: function (str: string): string {
        throw new APINotSupportedError('URI')
      },
    },
    alert: {
      alert: function (message: string): void {
        throw new MethodNotImplementedError()
      },
      prompt: function (message: string): string {
        throw new MethodNotImplementedError()
      },
    },
    location: {
      toString: function (): Promise<string> {
        throw new MethodNotImplementedError()
      },
    },
    window: {
      open: function (url: string, target: string, features: string): Window {
        throw new MethodNotImplementedError()
      },
      AudioContext: undefined,
      OscillatorNode: undefined,
      MediaStreamAudioSourceNode: undefined,
      AnalyserNode: undefined,
      GainNode: undefined,
      DelayNode: undefined,
      ImageCapture: undefined,
      CompressionStream: undefined,
      DecompressionStream: undefined,
      ReadableStream: undefined,
      getComputedStyle: function (element: Element): CSSStyleDeclaration {
        throw new MethodNotImplementedError()
      },
    },
    navigator: {
      share: function (data: ShareData): Promise<void> {
        throw new MethodNotImplementedError()
      },
    },
    layout: {
      reflectChildrenTrait: function (
        parentTrait: LayoutNode,
        parentStyle: Style,
        children: Style[],
        path?: number[],
        expandChild?: (path: number[]) => Style[]
      ): LayoutNode[] {
        throw new MethodNotImplementedError()
      },
    },
    history: {
      pushState: function (data: any, title: string, url: string): void {
        throw new MethodNotImplementedError()
      },
      replaceState: function (data: any, title: string, url: string): void {
        throw new MethodNotImplementedError()
      },
    },
    theme: {
      setTheme: function (theme: Theme): Promise<void> {
        throw new MethodNotImplementedError()
      },
    },
  }

  return api
}
