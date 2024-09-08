import { $BS } from './$BS'

export const BD_METHOD_GET = []
export const BD_METHOD_CALL = []
export const BD_METHOD_WATCH = []
export const BD_METHOD_REF = ['getServer']

export interface $BD_G {}

export interface $BD_C {}

export interface $BD_W {}

export interface $BD_R {
  $getServer(data: {}): $BS
}

export interface $BD extends $BD_G, $BD_C, $BD_W, $BD_R {}
