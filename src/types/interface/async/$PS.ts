import { $PPW } from './$PPW'

export const PS_METHOD_GET = []
export const PS_METHOD_CALL = []
export const PS_METHOD_WATCH = []
export const PS_METHOD_REF = ['requestPictureInPicture']

export interface $PS_G {}

export interface $PS_C {}

export interface $PS_W {}

export interface $PS_R {
  $requestPictureInPicture(data: {}): $PPW
}

export interface $PS extends $PS_G, $PS_C, $PS_W, $PS_R {}
