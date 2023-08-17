import { GraphMergeSpec } from '../types'
import { getMergePinCount } from './util'

export function isEmptyMerge(mergeSpec: GraphMergeSpec) {
  return getMergePinCount(mergeSpec) === 0
}
