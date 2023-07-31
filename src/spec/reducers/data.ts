import dissocAll from '../../system/core/object/DeleteAll/f'
import dissocPath from '../../system/core/object/DeletePath/f'
import merge from '../../system/f/object/Merge/f'
import _set from '../../system/f/object/Set/f'
import { Action, DatumSpec, GraphDataSpec } from '../../types'
import { REMOVE_DATA, REMOVE_DATUM, SET_DATA, SET_DATUM } from '../actions/D'

export const defaultState: GraphDataSpec = {}

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

export const setDatum = (
  { id, value }: { id: string; value: DatumSpec },
  state: GraphDataSpec
): GraphDataSpec => {
  return _set(state, id, value)
}

export default function (
  state: GraphDataSpec = defaultState,
  { type, data }: Action
): GraphDataSpec {
  switch (type) {
    case SET_DATUM:
      return setDatum(data, state)
    case SET_DATA:
      return setData(data, state)
    case REMOVE_DATUM:
      return removeDatum(data, state)
    case REMOVE_DATA:
      return removeData(data, state)
    default:
      return state
  }
}
