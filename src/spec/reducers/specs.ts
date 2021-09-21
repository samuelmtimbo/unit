import assoc from '../../system/f/object/Assoc/f'
import _dissoc from '../../system/f/object/Dissoc/f'
import merge from '../../system/f/object/Merge/f'
import { Action, GraphSpec, Specs } from '../../types'
import { ADD_SPEC, REMOVE_SPEC, SET_SPECS } from '../actions/specs'

export type State = Specs

export const defaultState: State = {}

const addSpec = (
  { name, spec }: { name: string; spec: GraphSpec },
  state: State
): State => assoc(state, name, spec)

const removeSpec = ({ name }: { name: string }, state: State): State =>
  _dissoc(state, name)

const setSpecs = ({ specs }: { specs: Specs }, state): State => {
  return merge(state, specs)
}

export default function (
  state: State = defaultState,
  { type, data }: Action
): State {
  switch (type) {
    case ADD_SPEC:
      return addSpec(data, state)
    case REMOVE_SPEC:
      return removeSpec(data, state)
    case SET_SPECS:
      return setSpecs(data, state)
    default:
      return state
  }
}
