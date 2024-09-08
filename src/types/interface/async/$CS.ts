import { Callback } from '../../Callback'
import { Unlisten } from '../../Unlisten'

export const CS_METHOD_GET = ['captureStream']
export const CS_METHOD_CALL = []
export const CS_METHOD_WATCH = []
export const CS_METHOD_REF = []

export interface $CS_G {
  $captureStream(
    { frameRate }: { frameRate: number },
    callback: Callback<MediaStream>
  ): Unlisten
}

export interface $CS_C {}

export interface $CS_W {}

export interface $CS_R {}

export interface $CS extends $CS_G, $CS_C, $CS_W, $CS_R {}
