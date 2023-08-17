import { GraphMergeSpec } from '.'
import { IOOf } from './IOOf'

export type ReconnectMergeOpt = IOOf<{
  mergeId: string
  merge: GraphMergeSpec
  data: string | null
}>
