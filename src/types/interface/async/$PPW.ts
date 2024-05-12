import { $BC } from './$BC'

export const PPW_METHOD_CALL = []
export const PPW_METHOD_WATCH = []
export const PPW_METHOD_REF = []

export interface $PPW_C {}

export interface $PPW_W {}

export interface $PPW_R {
  $getCharacteristic(data: { name: string }): $BC
}

export interface $PPW extends $PPW_C, $PPW_W, $PPW_R {}
