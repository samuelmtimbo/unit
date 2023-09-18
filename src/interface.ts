export const CLASS_TYPE_BLOB = 'B' // Blob
export const CLASS_TYPE_IMAGE_BITMAP = 'IB' // ImageBitmap
export const CLASS_TYPE_CANVAS = 'CA' // CAnvas
export const CLASS_TYPE_CANVAS_CONTEXT = 'CC' // CAnvas
export const CLASS_TYPE_COMPONENT = 'C' // Component
export const CLASS_TYPE_CAPTURE_STREAM = 'CS' // CaptureStream
export const CLASS_TYPE_CONTEXT = 'CO' // COntext
export const CLASS_TYPE_GRAPH = 'G' // Graph
export const CLASS_TYPE_GAMEPAD = 'GP' // GamePad
export const CLASS_TYPE_MEDIA = 'M' // Media
export const CLASS_TYPE_EMITTER = 'E' // Emitter
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
export const CLASS_TYPE_CHANNEL = 'CH' // CHannel
export const CLASS_TYPE_MEDIA_STREAM = 'MS' // MediaStream
export const CLASS_TYPE_SYSTEM = 'S' // System
export const CLASS_TYPE_UNIT = 'U' // Unit
export const CLASS_TYPE_VALUE = 'V' // Value
export const CLASS_TYPE_TRASMITTER = 'TR' // TRansmitter
export const CLASS_TYPE_RECEIVER = 'RE' // REceiver
export const CLASS_TYPE_PIN = 'PI' // PIn
export const CLASS_TYPE_FILE = 'F' // File
export const CLASS_TYPE_LOCATION = 'L' // Location
export const CLASS_TYPE_REGISTRY = 'R' // Registry
export const CLASS_TYPE_AUDIO_CONTEXT = 'AC' // AudioContext
export const CLASS_TYPE_AUDIO_OSCILLATOR_NODE = 'ON' // OscillatorNode
export const CLASS_TYPE_AUDIO_NODE = 'ON' // AudioNode
export const CLASS_TYPE_DATE = 'D' // Date

export const INHERITANCE = {
  U: ['EE'],
  G: ['U'],
  V: ['EE'],
  CH: ['EE'],
}

export type AllTypes<T> = {
  B: T
  IB: T
  CA: T
  CC: T
  C: T
  CS: T
  CO: T
  G: T
  GP: T
  M: T
  E: T
  EE: T
  BD: T
  BS: T
  BSE: T
  BC: T
  NO: T
  J: T
  A: T
  PP: T
  PS: T
  CH: T
  MS: T
  S: T
  U: T
  V: T
  TR: T
  RE: T
  F: T
  L: T
  AC: T
  D: T
}

export const ALL_TYPES_MAP: AllTypes<true> = {
  B: true,
  IB: true,
  CA: true,
  CC: true,
  C: true,
  CS: true,
  CO: true,
  G: true,
  GP: true,
  M: true,
  E: true,
  EE: true,
  BD: true,
  BS: true,
  BSE: true,
  BC: true,
  NO: true,
  J: true,
  A: true,
  PP: true,
  PS: true,
  CH: true,
  MS: true,
  S: true,
  U: true,
  V: true,
  TR: true,
  RE: true,
  F: true,
  L: true,
  AC: true,
  D: true,
}

export const ALL_TYPES = Object.keys(ALL_TYPES_MAP)
