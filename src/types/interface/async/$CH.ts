import { Callback } from '../../Callback'

export const CH_METHOD_CALL = ['send']
export const CH_METHOD_WATCH = []
export const CH_METHOD_REF = []

export interface $CH_C {
  send(data: any, callback: Callback<void>): void
}

export interface $CH_W {}

export interface $CH_R {}

export interface $CH extends $CH_C, $CH_W, $CH_R {}
