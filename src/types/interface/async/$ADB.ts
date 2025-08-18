import { Callback } from '../../Callback'

export const ADB_METHOD_GET = ['audioBuffer']
export const ADB_METHOD_CALL = []
export const ADB_METHOD_WATCH = []
export const ADB_METHOD_REF = []

export interface $ADB_G {
  $audioBuffer(data: {}, callback: Callback<AudioBuffer>): void
}

export interface $ADB_C {}

export interface $ADB_W {}

export interface $ADB_R {}

export interface $ADB extends $ADB_G, $ADB_C, $ADB_W, $ADB_R {}
