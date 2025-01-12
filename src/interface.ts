export const CLASS_TYPE_BLOB = 'B' // Blob
export const CLASS_TYPE_IMAGE_BITMAP = 'IB' // ImageBitmap
export const CLASS_TYPE_CANVAS = 'CA' // CAnvas
export const CLASS_TYPE_COMPONENT = 'C' // Component
export const CLASS_TYPE_CAPTURE_STREAM = 'CS' // CaptureStream
export const CLASS_TYPE_GRAPH = 'G' // Graph
export const CLASS_TYPE_GAMEPAD = 'GP' // GamePad
export const CLASS_TYPE_EVENT_EMITTER = 'EE' // EventEmitter
export const CLASS_TYPE_BLUETOOTH_DEVICE = 'BD' // BluetoothDevice
export const CLASS_TYPE_BLUETOOTH_SERVER = 'BS' // BluetoothServer
export const CLASS_TYPE_BLUETOOTH_SERVICE = 'BSE' // BluetoothSErvice
export const CLASS_TYPE_BLUETOOTH_CHARACTERISTIC = 'BC' // BluetoothCharacteristic
export const CLASS_TYPE_NOTIFICATION = 'NO' // NOtification
export const CLASS_TYPE_OBJECT = 'J' // obJect
export const CLASS_TYPE_ARRAY = 'A' // Array
export const CLASS_TYPE_PICTURE_IN_PICTURE = 'PP' // PictureInPicture
export const CLASS_TYPE_PICTURE_IN_PICTURE_SOURCE = 'PS' // PictureInPictureSource
export const CLASS_TYPE_PICTURE_IN_PICTURE_WINDOW = 'PSW' // PictureInPictureWindow
export const CLASS_TYPE_CHANNEL = 'CH' // CHannel
export const CLASS_TYPE_MEDIA_STREAM = 'MS' // MediaStream
export const CLASS_TYPE_SYSTEM = 'S' // System
export const CLASS_TYPE_UNIT = 'U' // Unit
export const CLASS_TYPE_VALUE = 'V' // Value
export const CLASS_TYPE_PIN = 'PI' // PIn
export const CLASS_TYPE_FILE = 'F' // File
export const CLASS_TYPE_FILE_READER = 'FR' // FileReader
export const CLASS_TYPE_LOCATION = 'L' // Location
export const CLASS_TYPE_REGISTRY = 'R' // Registry
export const CLASS_TYPE_AUDIO_CONTEXT = 'AC' // AudioContext
export const CLASS_TYPE_AUDIO_OSCILLATOR_NODE = 'ON' // OscillatorNode
export const CLASS_TYPE_AUDIO_NODE = 'ON' // AudioNode
export const CLASS_TYPE_DATE = 'D' // Date
export const CLASS_TYPE_IMAGE_CAPTURE = 'IC' // ImageCapture
export const CLASS_TYPE_IMAGE_BITMAP_RENDERING_CONTEXT = 'IBRC' // ImageBitmapRenderingContext
export const CLASS_TYPE_IMAGE = 'IM' // IMage
export const CLASS_TYPE_IMAGE_DATA = 'ID' // ImageData
export const CLASS_TYPE_WRAPPER = 'WP' // WraPper
export const CLASS_TYPE_WINDOW = 'W' // Window
export const CLASS_TYPE_MEDIA_ELEMENT = 'ME' // MediaElement
export const CLASS_TYPE_OBSERVER = 'OB' // OBserver
export const CLASS_TYPE_RESPONSE = 'RES' // RESponse
export const CLASS_TYPE_BODY = 'BO' // BOdy
export const CLASS_TYPE_CRYPTO_KEY = 'CK' // CryptoKey
export const CLASS_TYPE_ARRAY_BUFFER = 'AB' // ArrayBuffer
export const CLASS_TYPE_TEXT_ENCODER = 'TE' // TextEncoder
export const CLASS_TYPE_TEXT_DECODER = 'TD' // TextDecoder
export const CLASS_TYPE_READABLE_STREAM = 'RS' // ReadableStream

export type AllTypes<T> = {
  B: T
  IB: T
  CA: T
  C: T
  CS: T
  G: T
  GP: T
  EE: T
  BD: T
  BS: T
  BSE: T
  BC: T
  NO: T
  J: T
  A: T
  PS: T
  CH: T
  MS: T
  S: T
  U: T
  V: T
  F: T
  AC: T
  D: T
  CK: T
  AB: T
  TE: T
  TD: T
  WP: T
  ME: T
  IM: T
  RS: T
}

export const ALL_TYPES_MAP: AllTypes<true> = {
  B: true,
  IB: true,
  CA: true,
  C: true,
  CS: true,
  G: true,
  GP: true,
  EE: true,
  BD: true,
  BS: true,
  BSE: true,
  BC: true,
  NO: true,
  J: true,
  A: true,
  PS: true,
  CH: true,
  MS: true,
  S: true,
  U: true,
  V: true,
  F: true,
  AC: true,
  D: true,
  CK: true,
  AB: true,
  TE: true,
  TD: true,
  WP: true,
  ME: true,
  IM: true,
  RS: true,
}

export const ALL_TYPES = Object.keys(ALL_TYPES_MAP)
