import { Callback } from '../../Callback'

export const CA_METHOD_GET = ['toBlob']
export const CA_METHOD_CALL = [
  'draw',
  'drawImage',
  'clear',
  'strokePath',
  'scale',
  'fillPath',
]
export const CA_METHOD_WATCH = []
export const CA_METHOD_REF = []

export interface $CA_G {
  $toBlob(
    data: { type: string; quality: number },
    callback: Callback<Blob>
  ): void
}

export interface $CA_C {
  $draw(data: { step: any[] }): void
  $drawImage(data: {
    imageBitmap: ImageBitmap
    x: number
    y: number
    width: number
    height: number
  }): void
  $clear(data: {}): Promise<void>
  $strokePath(data: { d: string }): void
  $scale(data: { sx: number; sy: number }): void
  $fillPath(data: { d: string; fillRule: string }): void
}

export interface $CA_W {}

export interface $CA_R {}

export interface $CA extends $CA_G, $CA_C, $CA_W, $CA_R {}
