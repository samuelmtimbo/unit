import dissocAll from '../../system/core/object/DissocAll/f'
import dissocPath from '../../system/core/object/DissocPath/f'
import assoc from '../../system/f/object/Assoc/f'
import merge from '../../system/f/object/Merge/f'
import { Action, DatumSpec, GraphDataSpec } from '../../types'
import { REMOVE_DATA, REMOVE_DATUM, SET_DATA, SET_DATUM } from '../actions/data'

export type State = GraphDataSpec

export const defaultState: State = {}

export const removeData = ({ ids }: { ids: string[] }, state: State): State => {
  return dissocAll(state, ids)
}

export const setData = (
  { data }: { data: GraphDataSpec },
  state: State
): State => {
  return merge(state, data)
}

export const removeDatum = ({ id }: { id: string }, state: State): State => {
  return dissocPath(state, [id])
}

export const setDatum = (
  { id, value }: { id: string; value: DatumSpec },
  state: State
): State => {
  return assoc(state, id, value)
}

export default function (
  state: State = defaultState,
  { type, data }: Action
): State {
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
