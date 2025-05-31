import { Callback } from '../../Callback'

export const $_METHOD_GET = ['getInterface', 'getGlobalId']
export const $_METHOD_CALL = []
export const $_METHOD_WATCH = []
export const $_METHOD_REF = []

export interface $$_G {
  $getInterface(data: {}, callback: Callback<string[]>): void
  $getGlobalId(data: {}, callback: Callback<string>): void
}

export interface $$_C {}

export interface $$_W {}

export interface $$_R {}

export interface $$ extends $$_G, $$_C, $$_W, $$_R {}
