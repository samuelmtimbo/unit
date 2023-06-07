import assocPath from '../../system/core/object/AssocPath/f'
import pathGet from '../../system/core/object/DeepGet/f'
import dissocPath from '../../system/core/object/DeletePath/f'
import forEachValueKey from '../../system/core/object/ForEachKeyValue/f'
import deepMerge from '../../system/f/object/DeepMerge/f'
import _dissoc from '../../system/f/object/Delete/f'
import merge from '../../system/f/object/Merge/f'
import _set from '../../system/f/object/Set/f'
import {
  GraphMergeSpec,
  GraphMergesSpec,
  GraphPinSpec,
  GraphSubPinSpec,
  GraphUnitSpec,
  GraphUnitsSpec,
} from '../../types'
import { GraphSpec } from '../../types/GraphSpec'
import { IO } from '../../types/IO'
import { forEach } from '../../util/array'
import {
  clone,
  getObjSingleKey,
  isEmptyObject,
  mapObjVK,
  pathOrDefault,
} from '../../util/object'
import { emptyGraphSpec } from '../emptySpec'
import { forEachPinOnMerges, getMergePinCount } from '../util'

export type State = GraphSpec

export const defaultState: State = emptyGraphSpec()

export const setSpec = ({ spec }: { spec: State }) => spec

export const setName = ({ name }: { name: string }, state: State): State =>
  _set(state, 'name', name) as State

export const addUnit = (
  { id, unit }: { id: string; unit: GraphUnitSpec },
  state: State
): State => assocPath(state, ['units', id], unit)

export const addUnits = (
  { units }: { units: GraphUnitsSpec },
  state: State
): State => _set(state, 'units', merge(state.units, units)) as State

export const removeUnits = (
  { ids }: { ids: string[] },
  state: State
): State => {
  forEach(ids, (unitId) => {
    state = removeUnit({ unitId }, state)
  })
  return state
}

export const mergeUnits = (
  { units }: { units: GraphUnitsSpec },
  state: State
): State => _set(state, 'units', merge(state.units, units)) as State

export const expandUnit = (
  { unitId, spec }: { unitId: string; spec: GraphSpec },
  state: State
): State => {
  // unplug unit
  state = removeUnit({ unitId }, state)

  // add new units and merges
  // TODO possible id conflict
  state = mergeUnits({ units: spec.units || {} }, state)
  state = addMerges({ merges: spec.merges || {} }, state)

  // add interface merges
  forEachValueKey(
    state.merges || {},
    (merge: GraphMergeSpec, mergeId: string) => {
      if (merge[unitId]) {
        const { input = {}, output = {} } = merge[unitId]
        forEachValueKey(input, (_, inputId) => {
          const inputSpec = spec.inputs[inputId]
          const { plug } = inputSpec
          forEachValueKey(plug, (subInputSpec, subInputId) => {
            if (subInputSpec.mergeId) {
              state = mergeMerges(
                { a: mergeId, b: subInputSpec.mergeId },
                state
              )
            } else {
              state = addPinToMerge(
                {
                  mergeId: mergeId,
                  type: 'input',
                  unitId: subInputSpec.unitId!,
                  pinId: subInputSpec.pinId!,
                },
                state
              )
            }
          })
        })
        forEachValueKey(output, (_, outputId) => {
          const outputSpec = spec.outputs[outputId]
          const { plug } = outputSpec
          forEachValueKey(plug, (subOutputSpec) => {
            if (subOutputSpec.mergeId) {
              state = mergeMerges(
                { a: mergeId, b: subOutputSpec.mergeId },
                state
              )
            } else {
              state = addPinToMerge(
                {
                  mergeId: mergeId,
                  type: 'output',
                  unitId: subOutputSpec.unitId!,
                  pinId: subOutputSpec.pinId!,
                },
                state
              )
            }
          })
        })
      }
    }
  )

  return state
}

// TODO
export const collapseUnits = (unitIds: string[], state: State): State => {
  return state
}

export const removeUnitExposedTypePins = (
  { id, type }: { id: string; type: IO },
  state: State
): State => {
  const nextState = clone(state)
  for (const pinId in state[`${type}s`]) {
    const pin = state[`${type}s`][pinId]
    const { plug } = pin
    for (let subPinId in plug) {
      const subPin = plug[subPinId]
      const { unitId } = subPin
      if (unitId === id) {
        nextState[`${type}s`][pinId]['plug'][subPinId] = {}
      }
    }
  }
  return nextState
}

export const removeUnitExposedPins = (
  { id }: { id: string },
  state: State
): State => {
  state = removeUnitExposedTypePins({ id, type: 'input' }, state)
  state = removeUnitExposedTypePins({ id, type: 'output' }, state)
  return state
}

export const removeUnitMerges = (
  { id }: { id: string },
  state: State
): State => {
  const { merges = {} } = state

  let nextState = clone(state)

  const removedMergeIds: { [id: string]: true } = {}
  forEachValueKey(merges, (merge, mergeId: string) => {
    if (merge[id]) {
      delete nextState.merges![mergeId][id]

      if (getMergePinCount(nextState.merges![mergeId]) < 2) {
        delete nextState.merges![mergeId]
        removedMergeIds[mergeId] = true
      }
    }
  })

  const reasignExposedPins = (type: IO): void => {
    const pins = state[`${type}s`] || {}

    for (const exposedPinId in pins) {
      const pinSpec = pins[exposedPinId] as GraphPinSpec

      const { plug } = pinSpec

      for (let subPinId in plug) {
        const subPin = plug[subPinId]

        const { mergeId } = subPin

        if (mergeId && removedMergeIds[mergeId]) {
          for (const unitId in merges[mergeId]) {
            if (unitId !== id) {
              const pinId = getObjSingleKey(
                pathOrDefault(merges, [mergeId, unitId, type], {})
              )

              if (pinId) {
                nextState[`${type}s`][exposedPinId]['plug'][subPinId] = {
                  unitId,
                  pinId,
                }

                break
              } else {
                nextState[`${type}s`][exposedPinId]['plug'][subPinId] = {}

                break
              }
            }
          }
        }
      }
    }
  }

  reasignExposedPins('input')
  reasignExposedPins('output')

  return nextState
}

export const removeUnit = (
  { unitId }: { unitId: string },
  state: State
): State => {
  state = removeUnitMerges({ id: unitId }, state)
  state = removeUnitExposedPins({ id: unitId }, state)
  state = dissocPath(state, ['units', unitId]) as State
  return state
}

export const addMerge = (
  { mergeId, merge }: { mergeId: string; merge: GraphMergeSpec },
  state: State
): State => {
  const { inputs = {}, outputs = {} } = state

  forEachValueKey(inputs, ({ plug }, inputId) => {
    forEachValueKey(plug, ({ unitId, pinId }, subPinId) => {
      if (unitId && pinId && merge[unitId]?.['input']?.[pinId]) {
        state = coverInput({ id: inputId, subPinId }, state)
        state = exposeInput(
          { id: inputId, subPinId, input: { mergeId } },
          state
        )
      }
    })
  })

  // reassign exposed outputs that have just been merged
  forEachValueKey(outputs, ({ plug }, outputId) => {
    forEachValueKey(plug, ({ unitId, pinId }, subPinId) => {
      if (
        unitId &&
        pinId &&
        merge[unitId] &&
        merge[unitId]['output'] &&
        merge[unitId]['output']![pinId]
      ) {
        state = coverOutput({ id: outputId, subPinId }, state)
        state = exposeOutput(
          { id: outputId, subPinId, output: { mergeId } },
          state
        )
      }
    })
  })

  return assocPath(state, ['merges', mergeId], merge)
}

export const addPinToMerge = (
  {
    mergeId,
    unitId,
    type,
    pinId,
  }: { mergeId: string; type: IO; unitId: string; pinId: string },
  state: State
): State => {
  // reassign exposed pin if it has just been merged
  forEachValueKey(state[`${type}s`], ({ name, plug = {} }, exposedPinId) => {
    for (const subPinId in plug) {
      const subPin = plug[subPinId]
      
      const { unitId: _unitId, pinId: _pinId } = subPin
      
      if (_unitId === unitId && _pinId === pinId) {
        state = coverPinSet({ pinId: exposedPinId, type }, state)
        state = exposePinSet(
          {
            pinId: exposedPinId,
            pin: { name, plug: { 0: { mergeId } } },
            type,
          },
          state
        )
      }
    }
  })

  return assocPath(state, ['merges', mergeId, unitId, type, pinId], true)
}

export const addMerges = (
  { merges }: { merges: GraphMergesSpec },
  state: State
): State => {
  // TODO update exposed inputs/outputs
  return _set(state, 'merges', deepMerge(merges, state.merges!)) as State
}

export const removeMerge = ({ id }: { id: string }, state: State): State => {
  const nextState = clone(state)

  const nextMerges = _dissoc(state.merges!, id)
  nextState.merges = nextMerges

  nextState.inputs = mapObjVK<GraphPinSpec, GraphPinSpec>(
    state.inputs,
    (input: GraphPinSpec) => ({
      ...input,
      plug: mapObjVK(input.plug, (plug) => {
        const { mergeId } = plug

        return !mergeId || mergeId !== id ? plug : {}
      }),
    })
  )

  nextState.outputs = mapObjVK<GraphPinSpec, GraphPinSpec>(
    state.outputs,
    (output: GraphPinSpec) => ({
      ...output,
      plug: mapObjVK(output.plug, (plug) => {
        const { mergeId } = plug

        return !mergeId || mergeId !== id ? plug : {}
      }),
    })
  )

  if (
    nextState.metadata &&
    nextState.metadata.position &&
    nextState.metadata.position.merge
  ) {
    delete nextState.metadata.position.merge[id]
  }

  return nextState
}

export const mergeMerges = (
  { a, b }: { a: string; b: string },
  state: State
): State => {
  const aMerge = state.merges![a]
  const bMerge = state.merges![b]
  state = dissocPath(state, ['merges', b]) as State
  state = assocPath(state, ['merges', a], deepMerge(aMerge, bMerge))
  return state
}

export const _removePinFromMerge = (
  {
    id,
    unitId,
    type,
    pinId,
  }: { id: string; type: IO; unitId: string; pinId: string },
  state: State
): State => {
  state = dissocPath(state, ['merges', id, unitId, type, pinId]) as State

  // remove type from unit if there are no more pins involved
  if (isEmptyObject(pathGet(state, ['merges', id, unitId, type]))) {
    state = dissocPath(state, ['merges', id, unitId, type]) as State
  }

  // remove unit from merge if there are no more pins involved
  if (isEmptyObject(pathGet(state, ['merges', id, unitId]))) {
    state = dissocPath(state, ['merges', id, unitId]) as State
  }

  return state
}

export const removePinFromMerge = (
  {
    id,
    unitId,
    type,
    pinId,
  }: { id: string; type: IO; unitId: string; pinId: string },
  state: State
): State => {
  state = _removePinFromMerge({ id, unitId, type, pinId }, state)

  return state
}

export const isPinMerged = (
  state: State,
  id,
  unitId: string,
  type: IO,
  pinId: string
): boolean => {
  return !!(
    state.merges![id] &&
    state.merges![id][unitId] &&
    state.merges![id][unitId][type] &&
    state.merges![id][unitId][type]![pinId]
  )
}

export const coverPinSet = (
  { pinId, type }: { pinId: string; type: IO },
  state: State
): State => dissocPath(state, [`${type}s`, pinId]) as State

export const coverPin = (
  {
    id,
    type,
    subPinId,
  }: {
    id: string
    type: IO
    subPinId: string
  },
  state: State
): State => {
  return dissocPath(state, [`${type}s`, id, 'plug', subPinId]) as State
}

export const exposePinSet = (
  { pinId, type, pin }: { pinId: string; type: IO; pin: GraphPinSpec },
  state: State
): State => assocPath(state, [`${type}s`, pinId], pin)

export const exposePin = (
  {
    pinId,
    type,
    subPinId,
    subPin,
  }: {
    pinId: string
    type: IO
    subPinId: string
    subPin: GraphSubPinSpec
  },
  state: State
): State => {
  return assocPath(state, [`${type}s`, pinId, 'plug', subPinId], subPin)
}

export const exposeInputSet = (
  { id, input }: { id: string; input: GraphPinSpec },
  state: State
): State => exposePinSet({ pinId: id, pin: input, type: 'input' }, state)

export const exposeInput = (
  {
    id,
    subPinId,
    input,
  }: { id: string; subPinId: string; input: GraphSubPinSpec },
  state: State
): State => {
  return exposePin({ pinId: id, subPinId, subPin: input, type: 'input' }, state)
}

export const plugPin = (
  {
    type,
    pinId,
    subPinId,
    subPinSpec,
  }: {
    type: IO
    pinId: string
    subPinId: string
    subPinSpec: GraphSubPinSpec
  },
  state: State
): State => {
  return assocPath(state, [`${type}s`, pinId, 'plug', subPinId], subPinSpec)
}

export const unplugInput = (
  {
    pinId,
    subPinId,
  }: {
    pinId: string
    subPinId: string
  },
  state: State
): State => {
  return unplugPin({ type: 'input', pinId: pinId, subPinId }, state)
}

export const unplugOutput = (
  {
    id,
    subPinId,
  }: {
    id: string
    subPinId: string
  },
  state: State
): State => {
  return unplugPin({ type: 'output', pinId: id, subPinId }, state)
}

export const unplugPin = (
  {
    type,
    pinId,
    subPinId,
  }: {
    type: IO
    pinId: string
    subPinId: string
  },
  state: State
): State => {
  return assocPath(state, [`${type}s`, pinId, 'plug', subPinId], {})
}

export const coverInputSet = ({ id }: { id: string }, state: State): State =>
  coverPinSet({ pinId: id, type: 'input' }, state)

export const coverInput = (
  {
    id,
    subPinId,
  }: {
    id: string
    subPinId: string
  },
  state: State
): State => {
  return coverPin({ id, type: 'input', subPinId }, state)
}

export const exposeOutputSet = (
  { id, output }: { id: string; output: GraphPinSpec },
  state: State
): State => exposePinSet({ pinId: id, pin: output, type: 'output' }, state)

export const exposeOutput = (
  {
    id,
    subPinId,
    output,
  }: { id: string; subPinId: string; output: GraphSubPinSpec },
  state: State
): State => {
  return exposePin(
    { pinId: id, subPinId, subPin: output, type: 'output' },
    state
  )
}

export const coverOutputSet = ({ id }: { id: string }, state: State): State =>
  coverPinSet({ pinId: id, type: 'output' }, state)

export const coverOutput = (
  {
    id,
    subPinId,
  }: {
    id: string
    subPinId: string
  },
  state: State
): State => {
  return coverPin({ id, type: 'output', subPinId }, state)
}

export const setUnitErr = (
  { unitId, err }: { unitId: string; err: string | null },
  state: State
): State => {
  if (err !== null) {
    return assocPath(state, ['units', unitId, 'err'], err)
  } else {
    return dissocPath(state, ['units', unitId, 'err']) as State
  }
}

export const setPinSetName = (
  { type, id, name }: { type: IO; id: string; name: string },
  state: State
): State => {
  return assocPath(state, [`${type}s`, id, 'name'], name)
}

export const setPinSetId = (
  { type, id, newId }: { type: IO; id: string; newId: string },
  state: State
): State => {
  return assocPath(
    dissocPath(state, [`${type}s`, id]),
    [`${type}s`, newId],
    pathGet(state, [`${type}s`, id])
  )
}

export const setPinSetFunctional = (
  { type, pinId, functional }: { type: IO; pinId: string; functional: boolean },
  state: State
): State => {
  return assocPath(state, [`${type}s`, pinId, 'functional'], functional)
}

export const setPinSetRef = (
  { type, pinId, ref }: { type: IO; pinId: string; ref: boolean },
  state: State
): State => {
  return assocPath(state, [`${type}s`, pinId, 'ref'], ref)
}

export const setUnitInput = (
  { id, name, data }: { id: string; name: string; data: string },
  state: State
): State => {
  return assocPath(state, ['units', id, 'input', name], data)
}

export const setUnitOutput = (
  { id, name, data }: { id: string; name: string; data: string },
  state: State
): State => {
  return assocPath(state, ['units', id, 'output', name], data)
}

export const setUnitPinData = (
  {
    unitId,
    type,
    pinId,
    data,
  }: { unitId: string; type: IO; pinId: string; data: any },
  state: State
): State => {
  return assocPath(state, ['units', unitId, type, pinId, 'data'], data)
}

export const setUnitInputConstant = (
  {
    unitId,
    pinId,
    constant,
  }: { unitId: string; pinId: string; constant: boolean },
  state: State
): State => {
  return assocPath(
    state,
    ['units', unitId, 'input', pinId, 'constant'],
    constant
  )
}

export const setUnitOutputConstant = (
  {
    unitId,
    pinId,
    constant,
  }: { unitId: string; pinId: string; constant: boolean },
  state: State
): State => {
  return assocPath(
    state,
    ['units', unitId, 'output', pinId, 'constant'],
    constant
  )
}

export const setUnitPinIgnored = (
  {
    unitId,
    type,
    pinId,
    ignored,
  }: {
    unitId: string
    type: IO
    pinId: string
    ignored: boolean
  },
  state: State
) => {
  if (ignored) {
    forEachPinOnMerges(state.merges!, (id, _unitId, _type, _pinId) => {
      if (_unitId === unitId && _type === type && _pinId === pinId) {
        state = removePinFromMerge({ id, unitId, type, pinId }, state)
      }
    })

    if (type === 'input') {
      forEachValueKey(state.inputs, ({ plug }, id) => {
        forEachValueKey(plug, (input, subPinId) => {
          if (input.unitId === unitId && input.pinId === pinId) {
            state = unplugInput({ pinId: id, subPinId }, state)
          }
        })
      })
    }

    if (type === 'output') {
      forEachValueKey(state.outputs, ({ plug }, id) => {
        forEachValueKey(plug, (output, subPinId) => {
          if (output.unitId === unitId && output.pinId === pinId) {
            state = unplugOutput({ id, subPinId }, state)
          }
        })
      })
    }
  }

  state = assocPath(state, ['units', unitId, type, pinId, 'ignored'], ignored)

  return state
}

export const setUnitOutputIgnored = (
  {
    unitId,
    pinId,
    ignored,
  }: { unitId: string; pinId: string; ignored: boolean },
  state: State
): State => {
  return setUnitPinIgnored({ unitId, type: 'output', pinId, ignored }, state)
}

export const setUnitInputIgnored = (
  {
    unitId,
    pinId,
    ignored,
  }: { unitId: string; pinId: string; ignored: boolean },
  state: State
): State => {
  return setUnitPinIgnored({ unitId, type: 'input', pinId, ignored }, state)
}

export const removeUnitPinData = (
  { unitId, type, pinId }: { unitId: string; type: IO; pinId: string },
  state: State
): State => {
  state = dissocPath(state, ['units', unitId, type, pinId, 'data']) as State
  return state
}

export const setMetadata = (
  { path, value }: { path: string[]; value: any },
  state: State
): State => {
  return assocPath(state, path, value)
}

export const setUnitMetadata = (
  { id, path, value }: { id: string; path: string[]; value: any },
  state: State
): State => {
  return assocPath(state, ['units', id, 'metadata', ...path], value)
}
