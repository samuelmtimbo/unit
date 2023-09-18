import { Callback } from '../../Callback'

export const MS_METHOD_CALL = ['stream']
export const MS_METHOD_WATCH = []
export const MS_METHOD_REF = []

export interface $MS_C {
  $get({}: {}, callback: Callback<MediaStream>): void
}

export interface $MS_W {}

export interface $MS_R {}

export interface $MS extends $MS_C, $MS_W, $MS_R {}
