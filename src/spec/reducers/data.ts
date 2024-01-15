import dissocAll from '../../system/core/object/DeleteAll/f'
import dissocPath from '../../system/core/object/DeletePath/f'
import merge from '../../system/f/object/Merge/f'
import _set from '../../system/f/object/Set/f'
import { DatumSpec, GraphDataSpec } from '../../types'
import { GraphSpec } from '../../types/GraphSpec'
import { pathSet } from '../../util/object'

export const removeData = (
  { ids }: { ids: string[] },
  state: GraphDataSpec
): GraphDataSpec => {
  return dissocAll(state, ids)
}

export const setData = (
  { data }: { data: GraphDataSpec },
  state: GraphDataSpec
): GraphDataSpec => {
  return merge(state, data)
}

export const removeDatum = (
  { id }: { id: string },
  state: GraphDataSpec
): GraphDataSpec => {
  return dissocPath(state, [id])
}

export const $setDatum = (
  { id, datumSpec: value }: { id: string; datumSpec: DatumSpec },
  state: GraphDataSpec
): GraphDataSpec => {
  return _set(state, id, value)
}

export const _setSpecDatum = (
  spec: GraphSpec,
  datumId: string,
  datumSpec: DatumSpec
): void => {
  return pathSet(spec, ['data', datumId], datumSpec)
}
