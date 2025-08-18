export const BSN_METHOD_GET = []
export const BSN_METHOD_CALL = ['start']
export const BSN_METHOD_WATCH = []
export const BSN_METHOD_REF = []

export interface $BSN_G {}

export interface $BSN_C {
  $start(data: { start?: number; offset?: number; duration?: number }): void
}

export interface $BSN_W {}

export interface $BSN_R {}

export interface $BSN extends $BSN_G, $BSN_C, $BSN_W, $BSN_R {}
