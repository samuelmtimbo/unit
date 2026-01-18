import { Callback } from '../../Callback'

export const BC_METHOD_GET = ['readValue']
export const BC_METHOD_CALL = ['writeValue']
export const BC_METHOD_WATCH = []
export const BC_METHOD_REF = []

export interface $BC_G {
  $readValue({}, callback: Callback<string>): void
}

export interface $BC_C {
  $writeValue({ value }: { value: string }, callback: Callback<void>): void
}

export interface $BC_W {}

export interface $BC_R {}

export interface $BC extends $BC_G, $BC_C, $BC_W, $BC_R {}
