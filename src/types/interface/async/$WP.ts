import { $Component } from './$Component'

export const WP_METHOD_GET = []
export const WP_METHOD_CALL = []
export const WP_METHOD_WATCH = []
export const WP_METHOD_REF = [
  'refChildContainer',
  'refParentRootContainer',
  'refParentChildContainer',
]

export interface $WP_G {}

export interface $WP_C {}

export interface $WP_W {}

export interface $WP_R {
  $refChildContainer(data: { at: number; _: string[] }): $Component
  $refParentRootContainer(data: { at: number; _: string[] }): $Component
  $refParentChildContainer(data: { at: number; _: string[] }): $Component
}

export interface $WP extends $WP_G, $WP_C, $WP_W, $WP_R {}
