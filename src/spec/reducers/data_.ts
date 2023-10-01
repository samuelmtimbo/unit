import { DatumSpec, GraphDataSpec } from '../../types'
import { set } from '../../util/object'

export const setDatum = (
  { id, value }: { id: string; value: DatumSpec },
  state: GraphDataSpec
): void => {
  return set(state, id, value)
}
