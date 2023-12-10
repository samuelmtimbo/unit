import { GraphMergeSpec } from '../types/GraphMergeSpec'
import { getMergePinCount } from './util/spec'

export function isEmptyMerge(mergeSpec: GraphMergeSpec) {
  return getMergePinCount(mergeSpec) === 0
}
