import { Callback } from '../Callback'
import { Unlisten } from '../Unlisten'

export const $ST_METHOD_CALL = ['stream']

export const $ST_METHOD_WATCH = []

export const $ST_METHOD_REF = []

export interface $ST_C {
  $stream({}: {}, callback: Callback<MediaStream>): Unlisten
}

export interface $ST_W {}

export interface $ST_R {}

export interface $ST extends $ST_C, $ST_W, $ST_R {}
