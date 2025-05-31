import { Callback } from '../../Callback'
import { Unlisten } from '../../Unlisten'

export const EE_METHOD_GET = ['eventNames']
export const EE_METHOD_CALL = ['emit']
export const EE_METHOD_WATCH = ['addListener']
export const EE_METHOD_REF = []

export interface $EE_G {
  $eventNames(data: {}, callback: Callback<string[]>): void
}

export interface $EE_C {
  $emit(data: { event: string; data: any }, callback: Callback): void
}

export interface $EE_W {
  $addListener(data: { event: string }, callback: Callback): Unlisten
}

export interface $EE_R {}

export interface $EE extends $EE_G, $EE_C, $EE_W, $EE_R {}
