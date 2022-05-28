import {
  $C,
  $C_METHOD,
  $C_METHOD_CALL,
  $C_METHOD_REF,
  $C_METHOD_WATCH,
} from './$C'
import { $EE } from './$EE'
import {
  $G,
  $G_METHOD,
  $G_METHOD_CALL,
  $G_METHOD_REF,
  $G_METHOD_WATCH,
} from './$G'
import {
  $U,
  $U_METHOD,
  $U_METHOD_CALL,
  $U_METHOD_REF,
  $U_METHOD_WATCH,
} from './$U'

export const $GRAPH_METHOD_CALL = [
  ...$U_METHOD_CALL,
  ...$C_METHOD_CALL,
  ...$G_METHOD_CALL,
]

export const $GRAPH_METHOD_WATCH = [
  ...$U_METHOD_WATCH,
  ...$C_METHOD_WATCH,
  ...$G_METHOD_WATCH,
]

export const $GRAPH_METHOD_REF = [
  ...$U_METHOD_REF,
  ...$C_METHOD_REF,
  ...$G_METHOD_REF,
]

export const $GRAPH_METHOD = [...$U_METHOD, ...$C_METHOD, ...$G_METHOD]

export interface $Graph extends $U, $C, $G, $EE {}
