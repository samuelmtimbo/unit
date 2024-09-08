import { Callback } from '../../Callback'

export const AB_METHOD_GET = ['arrayBuffer']
export const AB_METHOD_CALL = []
export const AB_METHOD_WATCH = []
export const AB_METHOD_REF = []

export interface $AB_G {
  $arrayBuffer(data: {}, callback: Callback<ArrayBuffer>): void
}

export interface $AB_C {}

export interface $AB_W {}

export interface $AB_R {}

export interface $AB extends $AB_G, $AB_C, $AB_W, $AB_R {}
