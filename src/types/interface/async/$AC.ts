import { $AN } from './$AN'

export const AC_METHOD_CALL = []
export const AC_METHOD_WATCH = []
export const AC_METHOD_REF = [
  'get',
  'getDestination',
  'createOscillator',
  'createAnalyser',
]

export interface $AC_C {}

export interface $AC_W {}

export interface $AC_R {
  $get(data: {}): $AC
  $getDestination(data: {}): $AN
  createOscillator(data: OscillatorOptions): $AN
  createAnalyser(data: AnalyserOptions): $AN
}

export interface $AC extends $AC_C, $AC_W, $AC_R {}
