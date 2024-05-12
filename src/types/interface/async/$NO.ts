export const NO_METHOD_CALL = ['show', 'close']
export const NO_METHOD_WATCH = []
export const NO_METHOD_REF = []

export interface $NO_C {
  $show(data: {}): void
  $close(data: {}): void
}

export interface $NO_W {}

export interface $NO_R {}

export interface $NO extends $NO_C, $NO_W, $NO_R {}
