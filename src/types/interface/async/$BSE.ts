import { $BC } from './$BC'

export const BSE_METHOD_GET = []
export const BSE_METHOD_CALL = []
export const BSE_METHOD_WATCH = []
export const BSE_METHOD_REF = []

export interface $BSE_G {}

export interface $BSE_C {}

export interface $BSE_W {}

export interface $BSE_R {
  $getCharacteristic(data: { name: string }): $BC
}

export interface $BSE extends $BSE_G, $BSE_C, $BSE_W, $BSE_R {}
