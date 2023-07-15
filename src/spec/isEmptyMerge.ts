import { getMergePinCount } from './util'
import { GraphMergeSpec } from '../types'

export function isEmptyMerge(mergeSpec: GraphMergeSpec) {
  return getMergePinCount(mergeSpec) === 0
}
