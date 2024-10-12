export const ME_METHOD_GET = []
export const ME_METHOD_CALL = ['mediaPlay', 'mediaPause']
export const ME_METHOD_WATCH = []
export const ME_METHOD_REF = []

export interface $ME_G {}

export interface $ME_C {
  $mediaPlay(data: {}): void
  $mediaPause(data: {}): void
}

export interface $ME_W {}

export interface $ME_R {}

export interface $ME extends $ME_G, $ME_C, $ME_W, $ME_R {}
