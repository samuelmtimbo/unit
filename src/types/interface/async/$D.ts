import { Callback } from '../../Callback'

export const D_METHOD_GET = ['getTime', 'getDate']
export const D_METHOD_CALL = ['setHours', 'setDate']
export const D_METHOD_WATCH = []
export const D_METHOD_REF = []

export interface $D_G {
  $getTime(data: {}, callback: Callback<number>): void
  $getDate(data: {}, callback: Callback<number>): void
}

export interface $D_C {
  $setDate(data: { day: number }): void
  $setHours(data: { hours: number; min: number; sec: number; ms: number }): void
}

export interface $D_W {}

export interface $D_R {}

export interface $D extends $D_G, $D_C, $D_W, $D_R {}
