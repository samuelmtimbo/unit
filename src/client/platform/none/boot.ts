import {
  API,
  Server,
  ServerOpt,
  ServerRequest,
  ServerResponse,
  ServerSocket,
} from '../../../API'
import { Waiter } from '../../../Waiter'
import { APINotSupportedError } from '../../../exception/APINotImplementedError'
import { DisplayMediaAPINotSupported } from '../../../exception/DisplayMediaAPINotSupported'
import { MediaDevicesAPINotSupported } from '../../../exception/MediaDeviceAPINotSupported'
import { MethodNotImplementedError } from '../../../exception/MethodNotImplementedError'
import { Style, Tag } from '../../../system/platform/Style'
import { WebSocketShape } from '../../../system/platform/api/network/WebSocket'
import { Dict } from '../../../types/Dict'
import { DownloadDataOpt } from '../../../types/global/DownloadData'
import { DownloadURLOpt } from '../../../types/global/DownloadURL'
import { LayoutNode } from '../../LayoutNode'
import { Theme } from '../../theme'

export function noneApi(): API {
  const api: API = {
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
      downloadText: (opt: DownloadDataOpt): Promise<void> => {
        throw new APINotSupportedError('Download')
      },
      downloadURL: (opt: DownloadURLOpt): Promise<void> => {
        throw new APINotSupportedError('Download')
      },
      FileReader: undefined,
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
      wakeLock: {
        request: () => {
          throw new APINotSupportedError('Screen Wake Lock')
        },
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
      createServer: function (opt: ServerOpt, servers?: Dict<any>): Server {
        throw new APINotSupportedError('Server')
      },
      handleUpgrade: function (
        request: ServerRequest,
        response: Waiter<ServerResponse>,
        ws: Dict<WebSocketShape>,
        wss: Dict<ServerSocket>
      ): Promise<ServerSocket> {
        throw new APINotSupportedError('Server')
      },
    },
    speech: {
      SpeechGrammarList: undefined,
      SpeechRecognition: undefined,
      SpeechSynthesis: undefined,
      SpeechSynthesisUtterance: undefined,
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
      canSelectShadowDom: function (): boolean {
        return false
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
      pictureInPictureElement: undefined,
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
      TextEncoder: undefined,
      TextDecoder: undefined,
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
      HTMLElement: undefined,
      SVGElement: undefined,
      SVGSVGElement: undefined,
      Text: undefined,
      BroadcastChannel: undefined,
      documentPictureInPicture: undefined,
      localStorage: undefined,
      sessionStorage: undefined,
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
      Notification: undefined,
      Image: undefined,
      Audio: undefined,
      OffscreenCanvas: undefined,
      WebSocket: undefined,
      open: function (url: string, target: string, features: string): Window {
        throw new MethodNotImplementedError()
      },
      getComputedStyle: function (element: Element): CSSStyleDeclaration {
        throw new MethodNotImplementedError()
      },
      setTimeout: function (callback: () => any, ms: number) {
        throw new MethodNotImplementedError()
      },
      setInterval: function (callback: () => any, ms: number) {
        throw new MethodNotImplementedError()
      },
      clearTimeout: function (timer: any): void {
        throw new MethodNotImplementedError()
      },
      clearInterval: function (timer: any): void {
        throw new MethodNotImplementedError()
      },
      nextTick: function (callback: () => any) {
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
        children: Tag[],
        expandChild?: (path: number[]) => Tag[]
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
    crypto: {
      generateKey: function (
        algorithm: AlgorithmIdentifier,
        extractable: boolean,
        keyUsages: string[]
      ): Promise<CryptoKey | CryptoKeyPair> {
        throw new MethodNotImplementedError()
      },
      exportKey: function <T extends KeyFormat>(
        format: T,
        key: CryptoKey
      ): Promise<ArrayBuffer | JsonWebKey> {
        throw new MethodNotImplementedError()
      },
      importKey: function <T extends KeyFormat>(
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
      ): Promise<CryptoKey> {
        throw new MethodNotImplementedError()
      },
      encrypt: function (
        algorithm: AlgorithmIdentifier,
        key: CryptoKey,
        data: ArrayBuffer
      ): Promise<ArrayBuffer> {
        throw new MethodNotImplementedError()
      },
      decrypt: function (
        algorithm: AlgorithmIdentifier,
        key: CryptoKey,
        data: ArrayBuffer
      ): Promise<ArrayBuffer> {
        throw new MethodNotImplementedError()
      },
      sign: function (
        algorithm: AlgorithmIdentifier,
        key: CryptoKey,
        data: ArrayBuffer
      ): Promise<ArrayBuffer> {
        throw new MethodNotImplementedError()
      },
      verify: function (
        algorithm: AlgorithmIdentifier,
        key: CryptoKey,
        signature: BufferSource,
        data: BufferSource
      ): Promise<boolean> {
        throw new MethodNotImplementedError()
      },
    },
  }

  return api
}
