import { GraphMergeSpec } from '../types/GraphMergeSpec'
import { getMergePinCount } from './util'

export function isEmptyMerge(mergeSpec: GraphMergeSpec) {
  return getMergePinCount(mergeSpec) === 0
}
