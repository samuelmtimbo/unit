import pathGet from '../../system/core/object/DeepGet/f'
import forEachValueKey from '../../system/core/object/ForEachKeyValue/f'
import deepMerge from '../../system/f/object/DeepMerge/f'
import merge from '../../system/f/object/Merge/f'
import _set from '../../system/f/object/Set/f'
import {
  GraphMergeSpec,
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
  pathDelete,
  pathMerge,
  pathOrDefault,
  pathSet,
} from '../../util/object'
import { forEachPinOnMerges, getMergePinCount } from '../util'

export const setName = ({ name }: { name: string }, spec: GraphSpec): void => {
  pathSet(spec, ['name'], name)
}

export const addUnit = (
  { unitId, unit }: { unitId: string; unit: GraphUnitSpec },
  spec: GraphSpec
): void => {
  pathSet(spec, ['units', unitId], unit)
}

export const removeUnits = (
  { ids }: { ids: string[] },
  spec: GraphSpec
): void => {
  forEach(ids, (id) => {
    removeUnit({ unitId: id }, spec)
  })
}

export const mergeUnits = (
  { units }: { units: GraphUnitsSpec },
  spec: GraphSpec
): void => {
  _set(spec, 'units', merge(spec.units, units)) as GraphSpec
}

export const removeUnitExposedTypePins = (
  { id, type }: { id: string; type: IO },
  spec: GraphSpec
): void => {
  for (const pinId in spec[`${type}s`]) {
    const pin = spec[`${type}s`][pinId]

    const { plug } = pin

    for (let subPinId in plug) {
      const subPin = plug[subPinId]

      const { unitId } = subPin

      if (unitId === id) {
        pathSet(spec, [`${type}s`, pinId, 'plug', subPinId], {})
      }
    }
  }
}

export const removeUnitExposedPins = (
  { unitId: id }: { unitId: string },
  spec: GraphSpec
): void => {
  removeUnitExposedTypePins({ id, type: 'input' }, spec)
  removeUnitExposedTypePins({ id, type: 'output' }, spec)
}

export const removeUnitMerges = (
  { unitId }: { unitId: string },
  spec: GraphSpec
): void => {
  const { merges = {} } = spec

  const removedMergeIds: { [id: string]: true } = {}

  forEachValueKey(merges, (merge, mergeId: string) => {
    if (merge[unitId]) {
      pathDelete(spec, ['merges', mergeId, unitId])

      if (getMergePinCount(spec.merges![mergeId]) < 2) {
        pathDelete(spec, ['merges', mergeId])

        removedMergeIds[mergeId] = true
      }
    }
  })

  const reasignExposedPins = (type: IO): void => {
    const pins = spec[`${type}s`] || {}

    for (const exposedPinId in pins) {
      const pinSpec = pins[exposedPinId] as GraphPinSpec

      const { plug } = pinSpec

      for (let subPinId in plug) {
        const subPin = plug[subPinId]

        const { mergeId } = subPin

        if (mergeId && removedMergeIds[mergeId]) {
          for (const unitId in merges[mergeId]) {
            if (unitId !== unitId) {
              const pinId = getObjSingleKey(
                pathOrDefault(merges, [mergeId, unitId, type], {})
              )

              if (pinId) {
                pathSet(spec, [`${type}s`, exposedPinId, 'plug', subPinId], {
                  unitId,
                  pinId,
                })

                break
              } else {
                pathSet(spec, [`${type}s`, exposedPinId, 'plug', subPinId], {})

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
}

export const removeUnit = (
  { unitId }: { unitId: string },
  spec: GraphSpec
): void => {
  removeUnitMerges({ unitId }, spec)
  removeUnitExposedPins({ unitId }, spec)

  delete spec['units'][unitId]
}

export const addMerge = (
  { mergeId, merge }: { mergeId: string; merge: GraphMergeSpec },
  spec: GraphSpec
): void => {
  const { inputs = {}, outputs = {} } = spec

  forEachValueKey(inputs, ({ plug }, inputId) => {
    forEachValueKey(plug, ({ unitId, pinId }, subPinId) => {
      if (unitId && pinId && merge[unitId]?.['input']?.[pinId]) {
        coverInput({ id: inputId, subPinId }, spec)
        exposeInput({ id: inputId, subPinId, input: { mergeId } }, spec)
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
        coverOutput({ id: outputId, subPinId }, spec)
        exposeOutput({ id: outputId, subPinId, output: { mergeId } }, spec)
      }
    })
  })

  return pathSet(spec, ['merges', mergeId], merge)
}

export const addPinToMerge = (
  {
    mergeId,
    unitId,
    type,
    pinId,
  }: { mergeId: string; type: IO; unitId: string; pinId: string },
  spec: GraphSpec
): void => {
  // reassign exposed pin if it has just been merged
  forEachValueKey(spec[`${type}s`], ({ name, plug = {} }, exposedPinId) => {
    for (const subPinId in plug) {
      const subPin = plug[subPinId]

      const { unitId: _unitId, pinId: _pinId } = subPin

      if (_unitId === unitId && _pinId === pinId) {
        coverPinSet({ pinId: exposedPinId, type }, spec)
        exposePinSet(
          {
            pinId: exposedPinId,
            pinSpec: { name, plug: { 0: { mergeId } } },
            type,
          },
          spec
        )
      }
    }
  })

  return pathSet(spec, ['merges', mergeId, unitId, type, pinId], true)
}

export const removeMerge = (
  { mergeId }: { mergeId: string },
  spec: GraphSpec
): void => {
  delete spec.merges[mergeId]

  spec.inputs = mapObjVK<GraphPinSpec, GraphPinSpec>(
    spec.inputs,
    (input: GraphPinSpec) => ({
      ...input,
      plug: mapObjVK(input.plug, (plug) => {
        return !plug.mergeId || mergeId !== plug.mergeId ? plug : {}
      }),
    })
  )

  spec.outputs = mapObjVK<GraphPinSpec, GraphPinSpec>(
    spec.outputs,
    (output: GraphPinSpec) => ({
      ...output,
      plug: mapObjVK(output.plug, (plug) => {
        return !plug.mergeId || mergeId !== plug.mergeId ? plug : {}
      }),
    })
  )

  if (spec.metadata && spec.metadata.position && spec.metadata.position.merge) {
    delete spec.metadata.position.merge[mergeId]
  }
}

export const mergeMerges = (
  { a, b }: { a: string; b: string },
  spec: GraphSpec
): void => {
  const aMerge = spec.merges![a]
  const bMerge = spec.merges![b]

  pathDelete(spec, ['merges', b])
  pathSet(spec, ['merges', a], deepMerge(aMerge, bMerge))
}

export const _removePinFromMerge = (
  {
    mergeId,
    unitId,
    type,
    pinId,
  }: { mergeId: string; type: IO; unitId: string; pinId: string },
  spec: GraphSpec
): void => {
  pathDelete(spec, ['merges', mergeId, unitId, type, pinId])

  if (
    isEmptyObject(pathOrDefault(spec, ['merges', mergeId, unitId, type], {}))
  ) {
    pathDelete(spec, ['merges', mergeId, unitId, type])
  }

  if (isEmptyObject(pathOrDefault(spec, ['merges', mergeId, unitId], {}))) {
    pathDelete(spec, ['merges', mergeId, unitId])
  }
}

export const removePinFromMerge = (
  {
    mergeId,
    unitId,
    type,
    pinId,
  }: { mergeId: string; type: IO; unitId: string; pinId: string },
  spec: GraphSpec
): void => {
  _removePinFromMerge({ mergeId, unitId, type, pinId }, spec)
}

export const isPinMerged = (
  spec: GraphSpec,
  id,
  unitId: string,
  type: IO,
  pinId: string
): boolean => {
  return !!(
    spec.merges![id] &&
    spec.merges![id][unitId] &&
    spec.merges![id][unitId][type] &&
    spec.merges![id][unitId][type]![pinId]
  )
}

export const coverPinSet = (
  { pinId, type }: { pinId: string; type: IO },
  spec: GraphSpec
): void => {
  return pathDelete(spec, [`${type}s`, pinId])
}

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
  spec: GraphSpec
): void => {
  pathDelete(spec, [`${type}s`, pinId, 'plug', subPinId])
}

export const exposePinSet = (
  { pinId, type, pinSpec }: { pinId: string; type: IO; pinSpec: GraphPinSpec },
  spec: GraphSpec
): void => {
  return pathSet(spec, [`${type}s`, pinId], pinSpec)
}

export const setUnitId = (
  {
    unitId,
    newUnitId,
    name,
  }: { unitId: string; newUnitId: string; name: string },
  spec: GraphSpec
): void => {
  const unit = spec.units[unitId]

  removeUnit({ unitId }, spec)
  addUnit({ unitId: newUnitId, unit }, spec)
}

export const exposePin = (
  {
    pinId,
    type,
    subPinId,
    subPinSpec,
  }: {
    pinId: string
    type: IO
    subPinId: string
    subPinSpec: GraphSubPinSpec
  },
  spec: GraphSpec
): void => {
  return pathSet(spec, [`${type}s`, pinId, 'plug', subPinId], subPinSpec)
}

export const exposeInputSet = (
  { id, input }: { id: string; input: GraphPinSpec },
  spec: GraphSpec
): void => exposePinSet({ pinId: id, pinSpec: input, type: 'input' }, spec)

export const exposeInput = (
  {
    id,
    subPinId,
    input,
  }: { id: string; subPinId: string; input: GraphSubPinSpec },
  spec: GraphSpec
): void => {
  return exposePin(
    { pinId: id, subPinId, subPinSpec: input, type: 'input' },
    spec
  )
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
  spec: GraphSpec
): void => {
  return pathSet(spec, [`${type}s`, pinId, 'plug', subPinId], subPinSpec)
}

export const unplugInput = (
  {
    id,
    subPinId,
  }: {
    id: string
    subPinId: string
  },
  spec: GraphSpec
): void => {
  return unplugPin({ type: 'input', pinId: id, subPinId }, spec)
}

export const unplugOutput = (
  {
    id,
    subPinId,
  }: {
    id: string
    subPinId: string
  },
  spec: GraphSpec
): void => {
  return unplugPin({ type: 'output', pinId: id, subPinId }, spec)
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
  spec: GraphSpec
): void => {
  return pathSet(spec, [`${type}s`, pinId, 'plug', subPinId], {})
}

export const coverInputSet = ({ id }: { id: string }, spec: GraphSpec): void =>
  coverPinSet({ pinId: id, type: 'input' }, spec)

export const coverInput = (
  {
    id,
    subPinId,
  }: {
    id: string
    subPinId: string
  },
  spec: GraphSpec
): void => {
  return coverPin({ pinId: id, type: 'input', subPinId }, spec)
}

export const exposeOutputSet = (
  { id, output }: { id: string; output: GraphPinSpec },
  spec: GraphSpec
): void => exposePinSet({ pinId: id, pinSpec: output, type: 'output' }, spec)

export const exposeOutput = (
  {
    id,
    subPinId,
    output,
  }: { id: string; subPinId: string; output: GraphSubPinSpec },
  spec: GraphSpec
): void => {
  return exposePin(
    { pinId: id, subPinId, subPinSpec: output, type: 'output' },
    spec
  )
}

export const coverOutputSet = ({ id }: { id: string }, spec: GraphSpec): void =>
  coverPinSet({ pinId: id, type: 'output' }, spec)

export const coverOutput = (
  {
    id,
    subPinId,
  }: {
    id: string
    subPinId: string
  },
  spec: GraphSpec
): void => {
  return coverPin({ pinId: id, type: 'output', subPinId }, spec)
}

export const setPinSetId = (
  { type, id, newId }: { type: IO; id: string; newId: string },
  spec: GraphSpec
): void => {
  const pinSpec = pathGet(spec, [`${type}s`, id])

  pathDelete(spec, [`${type}s`, id])
  pathSet(spec, [`${type}s`, newId], pinSpec)
}

export const setPinSetFunctional = (
  { type, pinId, functional }: { type: IO; pinId: string; functional: boolean },
  spec: GraphSpec
): void => {
  return pathSet(spec, [`${type}s`, pinId, 'functional'], functional)
}

export const setPinSetDataType = (
  { type, pinId, dataType }: { type: IO; pinId: string; dataType: string },
  spec: GraphSpec
): void => {
  return pathSet(spec, [`${type}s`, pinId, 'type'], dataType)
}

export const setPinSetRef = (
  { type, pinId, ref }: { type: IO; pinId: string; ref: boolean },
  spec: GraphSpec
): void => {
  return pathSet(spec, [`${type}s`, pinId, 'ref'], ref)
}

export const setUnitInput = (
  { id, name, data }: { id: string; name: string; data: string },
  spec: GraphSpec
): void => {
  return pathSet(spec, ['units', id, 'input', name], data)
}

export const setUnitOutput = (
  { id, name, data }: { id: string; name: string; data: string },
  spec: GraphSpec
): void => {
  return pathSet(spec, ['units', id, 'output', name], data)
}

export const setUnitPinData = (
  {
    unitId,
    type,
    pinId,
    data,
  }: { unitId: string; type: IO; pinId: string; data: any },
  spec: GraphSpec
): void => {
  return pathSet(spec, ['units', unitId, type, pinId, 'data'], data)
}

export const setUnitPinConstant = (
  {
    unitId,
    type,
    pinId,
    constant,
  }: { unitId: string; type: IO; pinId: string; constant: boolean },
  spec: GraphSpec
): void => {
  return pathSet(spec, ['units', unitId, type, pinId, 'constant'], constant)
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
  spec: GraphSpec
) => {
  if (ignored) {
    forEachPinOnMerges(spec.merges ?? {}, (mergeId, _unitId, _type, _pinId) => {
      if (_unitId === unitId && _type === type && _pinId === pinId) {
        removePinFromMerge({ mergeId, unitId, type, pinId }, spec)
      }
    })

    if (type === 'input') {
      forEachValueKey(spec.inputs ?? {}, ({ plug }, id) => {
        forEachValueKey(plug, (input, subPinId) => {
          if (input.unitId === unitId && input.pinId === pinId) {
            unplugInput({ id, subPinId }, spec)
          }
        })
      })
    }

    if (type === 'output') {
      forEachValueKey(spec.outputs ?? {}, ({ plug }, id) => {
        forEachValueKey(plug, (output, subPinId) => {
          if (output.unitId === unitId && output.pinId === pinId) {
            unplugOutput({ id, subPinId }, spec)
          }
        })
      })
    }
  }

  pathSet(spec, ['units', unitId, type, pinId, 'ignored'], ignored)

  return spec
}

export const setUnitOutputIgnored = (
  {
    unitId,
    pinId,
    ignored,
  }: { unitId: string; pinId: string; ignored: boolean },
  spec: GraphSpec
): void => {
  setUnitPinIgnored({ unitId, type: 'output', pinId, ignored }, spec)
}

export const setUnitInputIgnored = (
  {
    unitId,
    pinId,
    ignored,
  }: { unitId: string; pinId: string; ignored: boolean },
  spec: GraphSpec
): void => {
  setUnitPinIgnored({ unitId, type: 'input', pinId, ignored }, spec)
}

export const removeUnitPinData = (
  { unitId, type, pinId }: { unitId: string; type: IO; pinId: string },
  spec: GraphSpec
): void => {
  pathDelete(spec, ['units', unitId, type, pinId, 'data'])
}

export const setMetadata = (
  { path, value }: { path: string[]; value: any },
  spec: GraphSpec
): void => {
  pathSet(spec, path, value)
}

export const setUnitMetadata = (
  { id, path, value }: { id: string; path: string[]; value: any },
  spec: GraphSpec
): void => {
  pathSet(spec, ['units', id, 'metadata', ...path], value)
}

export const setUnitSize = (
  { unitId, width, height }: { unitId: string; width: number; height: number },
  spec: GraphSpec
): void => {
  pathMerge(spec, ['units', unitId, 'metadata'], { width, height })
}

export const setComponentSize = (
  { width, height }: { width: number; height: number },
  spec: GraphSpec
): void => {
  pathMerge(spec, ['component'], { defaultWidth: width, defaultHeight: height })
}

export const setSubComponentSize = (
  { unitId, width, height }: { unitId: string; width: number; height: number },
  spec: GraphSpec
): void => {
  pathMerge(spec, ['component', 'subComponents', unitId], {
    defaultWidth: width,
    defaultHeight: height,
  })
}

export const isPinRef = (
  { type, pinId }: { type: IO; pinId: string },
  spec: GraphSpec
) => {
  return pathOrDefault(spec, [`${type}s`, pinId, 'ref'], false)
}

export const renameUnitPin = (
  {
    unitId,
    type,
    pinId,
    newPinId,
  }: { unitId: string; type: IO; pinId: string; newPinId: string },
  spec: GraphSpec
) => {
  const { units = {}, merges = {} } = spec

  for (const unitId in units) {
    const unit = units[unitId]

    // TODO
  }

  forEachPinOnMerges(clone(merges), (mergeId, _unitId, _type, _pinId) => {
    if (_unitId === unitId && _type === type && _pinId === pinId) {
      pathDelete(spec, ['merges', mergeId, unitId, type, pinId])
      pathSet(spec, ['merges', mergeId, unitId, type, newPinId], true)
    }
  })
}
