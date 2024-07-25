import { Callback } from '../../Callback'

export const AB_METHOD_CALL = ['arrayBuffer']
export const AB_METHOD_WATCH = []
export const AB_METHOD_REF = []

export interface $AB_C {
  $arrayBuffer(data: {}, callback: Callback<ArrayBuffer>): void
}

export interface $AB_W {}

export interface $AB_R {}

export interface $AB extends $AB_C, $AB_W, $AB_R {}
