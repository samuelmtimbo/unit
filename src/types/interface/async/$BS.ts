import { $BSE } from './$BSE'

export const BS_METHOD_CALL = []
export const BS_METHOD_WATCH = []
export const BS_METHOD_REF = ['getPrimaryService']

export interface $BS_C {}

export interface $BS_W {}

export interface $BS_R {
  $getPrimaryService(data: {}): $BSE
}

export interface $BS extends $BS_C, $BS_W, $BS_R {}
