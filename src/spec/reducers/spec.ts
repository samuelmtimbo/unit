import pathGet from '../../system/core/object/DeepGet/f'
import deepSet from '../../system/core/object/DeepSet/f'
import dissocPath from '../../system/core/object/DeletePath/f'
import forEachValueKey from '../../system/core/object/ForEachKeyValue/f'
import deepMerge from '../../system/f/object/DeepMerge/f'
import _dissoc from '../../system/f/object/Delete/f'
import merge from '../../system/f/object/Merge/f'
import _set from '../../system/f/object/Set/f'
import { GraphPinSpec, GraphSubPinSpec } from '../../types'
import { GraphMergeSpec } from '../../types/GraphMergeSpec'
import { GraphMergesSpec } from '../../types/GraphMergesSpec'
import { GraphSpec } from '../../types/GraphSpec'
import { GraphUnitSpec } from '../../types/GraphUnitSpec'
import { GraphUnitsSpec } from '../../types/GraphUnitsSpec'
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

export const defaultState: GraphSpec = emptyGraphSpec()

export const setSpec = ({ spec }: { spec: GraphSpec }) => spec

export const setName = (
  { name }: { name: string },
  state: GraphSpec
): GraphSpec => _set(state, 'name', name) as GraphSpec

export const addUnit = (
  { id, unit }: { id: string; unit: GraphUnitSpec },
  state: GraphSpec
): GraphSpec => deepSet(state, ['units', id], unit)

export const addUnits = (
  { units }: { units: GraphUnitsSpec },
  state: GraphSpec
): GraphSpec => _set(state, 'units', merge(state.units, units)) as GraphSpec

export const removeUnits = (
  { ids }: { ids: string[] },
  state: GraphSpec
): GraphSpec => {
  forEach(ids, (unitId) => {
    state = removeUnit({ unitId }, state)
  })
  return state
}

export const mergeUnits = (
  { units }: { units: GraphUnitsSpec },
  state: GraphSpec
): GraphSpec => _set(state, 'units', merge(state.units, units)) as GraphSpec

export const expandUnit = (
  { unitId, spec }: { unitId: string; spec: GraphSpec },
  state: GraphSpec
): GraphSpec => {
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
                  mergeId,
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
export const collapseUnits = (
  unitIds: string[],
  state: GraphSpec
): GraphSpec => {
  return state
}

export const removeUnitExposedTypePins = (
  { id, type }: { id: string; type: IO },
  state: GraphSpec
): GraphSpec => {
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
  state: GraphSpec
): GraphSpec => {
  state = removeUnitExposedTypePins({ id, type: 'input' }, state)
  state = removeUnitExposedTypePins({ id, type: 'output' }, state)
  return state
}

export const removeUnitMerges = (
  { id }: { id: string },
  state: GraphSpec
): GraphSpec => {
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
  state: GraphSpec
): GraphSpec => {
  state = removeUnitMerges({ id: unitId }, state)
  state = removeUnitExposedPins({ id: unitId }, state)
  state = dissocPath(state, ['units', unitId]) as GraphSpec
  return state
}

export const addMerge = (
  { mergeId, merge }: { mergeId: string; merge: GraphMergeSpec },
  state: GraphSpec
): GraphSpec => {
  const { inputs = {}, outputs = {} } = state

  forEachValueKey(inputs, ({ plug }, inputId) => {
    forEachValueKey(plug, ({ unitId, pinId }, subPinId) => {
      if (unitId && pinId && merge[unitId]?.['input']?.[pinId]) {
        state = coverInput({ pinId: inputId, subPinId }, state)
        state = exposeInput(
          { pinId: inputId, subPinId, input: { mergeId } },
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
        state = coverOutput({ pinId: outputId, subPinId }, state)
        state = exposeOutput(
          { pinId: outputId, subPinId, output: { mergeId } },
          state
        )
      }
    })
  })

  return deepSet(state, ['merges', mergeId], merge)
}

export const addPinToMerge = (
  {
    mergeId,
    unitId,
    type,
    pinId,
  }: { mergeId: string; type: IO; unitId: string; pinId: string },
  state: GraphSpec
): GraphSpec => {
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

  return deepSet(state, ['merges', mergeId, unitId, type, pinId], true)
}

export const addMerges = (
  { merges }: { merges: GraphMergesSpec },
  state: GraphSpec
): GraphSpec => {
  // TODO update exposed inputs/outputs
  return _set(state, 'merges', deepMerge(merges, state.merges!)) as GraphSpec
}

export const removeMerge = (
  { id }: { id: string },
  state: GraphSpec
): GraphSpec => {
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
  state: GraphSpec
): GraphSpec => {
  const aMerge = state.merges![a]
  const bMerge = state.merges![b]
  state = dissocPath(state, ['merges', b]) as GraphSpec
  state = deepSet(state, ['merges', a], deepMerge(aMerge, bMerge))
  return state
}

export const _removePinFromMerge = (
  {
    id,
    unitId,
    type,
    pinId,
  }: { id: string; type: IO; unitId: string; pinId: string },
  state: GraphSpec
): GraphSpec => {
  state = dissocPath(state, ['merges', id, unitId, type, pinId]) as GraphSpec

  // remove type from unit if there are no more pins involved
  if (isEmptyObject(pathGet(state, ['merges', id, unitId, type]))) {
    state = dissocPath(state, ['merges', id, unitId, type]) as GraphSpec
  }

  // remove unit from merge if there are no more pins involved
  if (isEmptyObject(pathGet(state, ['merges', id, unitId]))) {
    state = dissocPath(state, ['merges', id, unitId]) as GraphSpec
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
  state: GraphSpec
): GraphSpec => {
  state = _removePinFromMerge({ id, unitId, type, pinId }, state)

  return state
}

export const isPinMerged = (
  state: GraphSpec,
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
  state: GraphSpec
): GraphSpec => dissocPath(state, [`${type}s`, pinId]) as GraphSpec

export const coverPin = (
  {
    pinId,
    type,
    subPinId,
  }: {
    pinId: string
    type: IO
    subPinId: string
  },
  state: GraphSpec
): GraphSpec => {
  return dissocPath(state, [`${type}s`, pinId, 'plug', subPinId]) as GraphSpec
}

export const exposePinSet = (
  { pinId, type, pin }: { pinId: string; type: IO; pin: GraphPinSpec },
  state: GraphSpec
): GraphSpec => deepSet(state, [`${type}s`, pinId], pin)

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
  state: GraphSpec
): GraphSpec => {
  return deepSet(state, [`${type}s`, pinId, 'plug', subPinId], subPin)
}

export const exposeInputSet = (
  { pinId, input }: { pinId: string; input: GraphPinSpec },
  state: GraphSpec
): GraphSpec => exposePinSet({ pinId, pin: input, type: 'input' }, state)

export const exposeInput = (
  {
    pinId,
    subPinId,
    input,
  }: { pinId: string; subPinId: string; input: GraphSubPinSpec },
  state: GraphSpec
): GraphSpec => {
  return exposePin({ pinId, subPinId, subPin: input, type: 'input' }, state)
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
  state: GraphSpec
): GraphSpec => {
  return deepSet(state, [`${type}s`, pinId, 'plug', subPinId], subPinSpec)
}

export const unplugInput = (
  {
    pinId,
    subPinId,
  }: {
    pinId: string
    subPinId: string
  },
  state: GraphSpec
): GraphSpec => {
  return unplugPin({ type: 'input', pinId, subPinId }, state)
}

export const unplugOutput = (
  {
    pinId,
    subPinId,
  }: {
    pinId: string
    subPinId: string
  },
  state: GraphSpec
): GraphSpec => {
  return unplugPin({ type: 'output', pinId, subPinId }, state)
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
  state: GraphSpec
): GraphSpec => {
  return deepSet(state, [`${type}s`, pinId, 'plug', subPinId], {})
}

export const coverInputSet = (
  { pinId }: { pinId: string },
  state: GraphSpec
): GraphSpec => coverPinSet({ pinId, type: 'input' }, state)

export const coverInput = (
  {
    pinId,
    subPinId,
  }: {
    pinId: string
    subPinId: string
  },
  state: GraphSpec
): GraphSpec => {
  return coverPin({ pinId, type: 'input', subPinId }, state)
}

export const exposeOutputSet = (
  { pinId, output }: { pinId: string; output: GraphPinSpec },
  state: GraphSpec
): GraphSpec => exposePinSet({ pinId, pin: output, type: 'output' }, state)

export const exposeOutput = (
  {
    pinId,
    subPinId,
    output,
  }: { pinId: string; subPinId: string; output: GraphSubPinSpec },
  state: GraphSpec
): GraphSpec => {
  return exposePin({ pinId, subPinId, subPin: output, type: 'output' }, state)
}

export const coverOutputSet = (
  { pinId }: { pinId: string },
  state: GraphSpec
): GraphSpec => coverPinSet({ pinId, type: 'output' }, state)

export const coverOutput = (
  {
    pinId,
    subPinId,
  }: {
    pinId: string
    subPinId: string
  },
  state: GraphSpec
): GraphSpec => {
  return coverPin({ pinId, type: 'output', subPinId }, state)
}

export const setUnitErr = (
  { unitId, err }: { unitId: string; err: string | null },
  state: GraphSpec
): GraphSpec => {
  if (err !== null) {
    return deepSet(state, ['units', unitId, 'err'], err)
  } else {
    return dissocPath(state, ['units', unitId, 'err']) as GraphSpec
  }
}

export const setPinSetName = (
  { type, id, name }: { type: IO; id: string; name: string },
  state: GraphSpec
): GraphSpec => {
  return deepSet(state, [`${type}s`, id, 'name'], name)
}

export const setPinSetId = (
  { type, id, newId }: { type: IO; id: string; newId: string },
  state: GraphSpec
): GraphSpec => {
  return deepSet(
    dissocPath(state, [`${type}s`, id]),
    [`${type}s`, newId],
    pathGet(state, [`${type}s`, id])
  )
}

export const setPinSetFunctional = (
  { type, pinId, functional }: { type: IO; pinId: string; functional: boolean },
  state: GraphSpec
): GraphSpec => {
  return deepSet(state, [`${type}s`, pinId, 'functional'], functional)
}

export const setPinSetRef = (
  { type, pinId, ref }: { type: IO; pinId: string; ref: boolean },
  state: GraphSpec
): GraphSpec => {
  return deepSet(state, [`${type}s`, pinId, 'ref'], ref)
}

export const setUnitInput = (
  { id, name, data }: { id: string; name: string; data: string },
  state: GraphSpec
): GraphSpec => {
  return deepSet(state, ['units', id, 'input', name], data)
}

export const setUnitOutput = (
  { id, name, data }: { id: string; name: string; data: string },
  state: GraphSpec
): GraphSpec => {
  return deepSet(state, ['units', id, 'output', name], data)
}

export const setUnitPinData = (
  {
    unitId,
    type,
    pinId,
    data,
  }: { unitId: string; type: IO; pinId: string; data: any },
  state: GraphSpec
): GraphSpec => {
  return deepSet(state, ['units', unitId, type, pinId, 'data'], data)
}

export const setUnitInputConstant = (
  {
    unitId,
    pinId,
    constant,
  }: { unitId: string; pinId: string; constant: boolean },
  state: GraphSpec
): GraphSpec => {
  return deepSet(state, ['units', unitId, 'input', pinId, 'constant'], constant)
}

export const setUnitOutputConstant = (
  {
    unitId,
    pinId,
    constant,
  }: { unitId: string; pinId: string; constant: boolean },
  state: GraphSpec
): GraphSpec => {
  return deepSet(
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
  state: GraphSpec
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
            state = unplugOutput({ pinId: id, subPinId }, state)
          }
        })
      })
    }
  }

  state = deepSet(state, ['units', unitId, type, pinId, 'ignored'], ignored)

  return state
}

export const setUnitOutputIgnored = (
  {
    unitId,
    pinId,
    ignored,
  }: { unitId: string; pinId: string; ignored: boolean },
  state: GraphSpec
): GraphSpec => {
  return setUnitPinIgnored({ unitId, type: 'output', pinId, ignored }, state)
}

export const setUnitInputIgnored = (
  {
    unitId,
    pinId,
    ignored,
  }: { unitId: string; pinId: string; ignored: boolean },
  state: GraphSpec
): GraphSpec => {
  return setUnitPinIgnored({ unitId, type: 'input', pinId, ignored }, state)
}

export const removeUnitPinData = (
  { unitId, type, pinId }: { unitId: string; type: IO; pinId: string },
  state: GraphSpec
): GraphSpec => {
  state = dissocPath(state, ['units', unitId, type, pinId, 'data']) as GraphSpec
  return state
}

export const setMetadata = (
  { path, value }: { path: string[]; value: any },
  state: GraphSpec
): GraphSpec => {
  return deepSet(state, path, value)
}

export const setUnitMetadata = (
  { id, path, value }: { id: string; path: string[]; value: any },
  state: GraphSpec
): GraphSpec => {
  return deepSet(state, ['units', id, 'metadata', ...path], value)
}

export const renameUnitInMerges = (
  unitId: string,
  unitMerges: GraphMergesSpec,
  newUnitId: string
): GraphMergesSpec => {
  const newUnitMerges: GraphMergesSpec = {}

  forEachValueKey(unitMerges, (merge, mergeId) => {
    newUnitMerges[mergeId] = {}

    forEachValueKey(merge, (pins, _unitId) => {
      newUnitMerges[mergeId][unitId === _unitId ? newUnitId : _unitId] = pins
    })
  })

  return newUnitMerges
}
