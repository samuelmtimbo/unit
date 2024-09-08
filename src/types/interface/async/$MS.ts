import { Callback } from '../../Callback'

export const MS_METHOD_GET = ['mediaStream']
export const MS_METHOD_CALL = []
export const MS_METHOD_WATCH = []
export const MS_METHOD_REF = []

export interface $MS_G {
  $mediaStream({}: {}, callback: Callback<MediaStream>): void
}

export interface $MS_C {}

export interface $MS_W {}

export interface $MS_R {}

export interface $MS extends $MS_G, $MS_C, $MS_W, $MS_R {}
