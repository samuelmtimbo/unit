import deepGet from '../../deepGet'
import forEachValueKey from '../../system/core/object/ForEachKeyValue/f'
import deepMerge from '../../system/f/object/DeepMerge/f'
import merge from '../../system/f/object/Merge/f'
import _set from '../../system/f/object/Set/f'
import { GraphPinSpec, GraphSubPinSpec } from '../../types'
import { GraphMergeSpec } from '../../types/GraphMergeSpec'
import { GraphSpec } from '../../types/GraphSpec'
import { GraphUnitSpec } from '../../types/GraphUnitSpec'
import { GraphUnitsSpec } from '../../types/GraphUnitsSpec'
import { IO } from '../../types/IO'
import { forIOObjKV, io } from '../../types/IOOf'
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
import { getSubComponentParentId } from '../util/component'
import {
  forEachPinOnMerges,
  getMergePinCount,
  getUnitMergesSpec,
  getUnitPlugs,
} from '../util/spec'
import {
  insertChild,
  insertSubComponentChild,
  removeChild,
  removeSubComponent,
  removeSubComponentChild,
  setSubComponent,
} from './component_'

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
  const { merges = {} } = clone(spec)

  const removedMergeIdSet: Set<string> = new Set()

  forEachValueKey(merges, (merge, mergeId: string) => {
    if (merge[unitId]) {
      pathDelete(spec, ['merges', mergeId, unitId])

      if (getMergePinCount(spec.merges![mergeId]) < 2) {
        pathDelete(spec, ['merges', mergeId])

        removedMergeIdSet.add(mergeId)
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

        if (mergeId && removedMergeIdSet.has(mergeId)) {
          const mergeSpec = clone(merges[mergeId])

          delete mergeSpec[unitId]

          const mergePinCount = getMergePinCount(mergeSpec)

          if (mergePinCount > 1) {
            continue
          } else if (mergePinCount === 1) {
            const otherMergeUnitId = getObjSingleKey(mergeSpec)
            const otherMergeUnitType = getObjSingleKey(
              mergeSpec?.[otherMergeUnitId] ?? {}
            )
            const otherMergeUnitPinId = getObjSingleKey(
              mergeSpec?.[otherMergeUnitId]?.[otherMergeUnitType] ?? {}
            )

            pathSet(spec, [`${type}s`, exposedPinId, 'plug', subPinId], {
              unitId: otherMergeUnitId,
              pinId: otherMergeUnitPinId,
            })
          } else {
            //
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
  { mergeId, mergeSpec }: { mergeId: string; mergeSpec: GraphMergeSpec },
  spec: GraphSpec
): void => {
  io((type) => {
    const pins = spec[`${type}s`] || {}

    forEachValueKey(pins, ({ plug }, pinId) => {
      forEachValueKey(plug, (subPinSpec, subPinId) => {
        if (
          subPinSpec.unitId &&
          subPinSpec.pinId &&
          pathOrDefault(
            mergeSpec,
            [subPinSpec.unitId, type, subPinSpec.pinId],
            null
          )
        ) {
          coverPin({ type, pinId, subPinId }, spec)
          exposePin({ type, pinId, subPinId, subPinSpec: { mergeId } }, spec)
        }
      })
    })
  })

  return pathSet(spec, ['merges', mergeId], mergeSpec)
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
  const subComponent = pathOrDefault(
    spec,
    ['component', 'subComponents', unitId],
    undefined
  )
  const parentId =
    (subComponent && getSubComponentParentId(spec, unitId)) || null

  const specClone = clone(spec)

  const unitPlugs = getUnitPlugs(specClone, unitId)
  const unitMerges = getUnitMergesSpec(specClone, unitId)

  removeUnit({ unitId }, spec)
  addUnit({ unitId: newUnitId, unit }, spec)

  if (subComponent) {
    removeSubComponent({ unitId }, spec.component)
    setSubComponent({ unitId: newUnitId, subComponent }, spec.component)

    if (parentId) {
      const at = spec.component.subComponents[parentId].children.indexOf(unitId)

      removeSubComponentChild(
        { subComponentId: parentId, childId: unitId },
        spec.component
      )
      insertSubComponentChild(
        { parentId, childId: newUnitId, at },
        spec.component
      )
    } else {
      const at = spec.component.children.indexOf(unitId)

      removeChild({ childId: unitId }, spec.component)
      insertChild({ childId: newUnitId, at }, spec.component)
    }
  }

  for (const mergeId in unitMerges) {
    const mergeSpec = unitMerges[mergeId]

    for (const _unitId in mergeSpec) {
      if (_unitId === unitId) {
        mergeSpec[newUnitId] = mergeSpec[_unitId]

        delete mergeSpec[_unitId]
      }
    }

    addMerge({ mergeId, mergeSpec }, spec)
  }

  forIOObjKV(
    unitPlugs,
    (type, pinId, { type: _type, pinId: _pinId, subPinId: _subPinId }) => {
      const subPinSpec = deepGet(specClone, [
        `${_type ?? type}s`,
        _pinId,
        'plug',
        _subPinId,
      ])

      if (subPinSpec.unitId === unitId) {
        subPinSpec.unitId = newUnitId
      }

      pathSet(
        spec,
        [`${_type ?? type}s`, _pinId, 'plug', _subPinId],
        subPinSpec
      )
    }
  )
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
  { pinId, input }: { pinId: string; input: GraphPinSpec },
  spec: GraphSpec
): void => exposePinSet({ pinId, pinSpec: input, type: 'input' }, spec)

export const exposeInput = (
  {
    pinId,
    subPinId,
    input,
  }: { pinId: string; subPinId: string; input: GraphSubPinSpec },
  spec: GraphSpec
): void => {
  return exposePin({ pinId, subPinId, subPinSpec: input, type: 'input' }, spec)
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
    pinId,
    subPinId,
  }: {
    pinId: string
    subPinId: string
  },
  spec: GraphSpec
): void => {
  return unplugPin({ type: 'input', pinId, subPinId }, spec)
}

export const unplugOutput = (
  {
    pinId,
    subPinId,
  }: {
    pinId: string
    subPinId: string
  },
  spec: GraphSpec
): void => {
  return unplugPin({ type: 'output', pinId, subPinId }, spec)
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

export const coverInputSet = (
  { pinId }: { pinId: string },
  spec: GraphSpec
): void => coverPinSet({ pinId, type: 'input' }, spec)

export const coverInput = (
  {
    pinId,
    subPinId,
  }: {
    pinId: string
    subPinId: string
  },
  spec: GraphSpec
): void => {
  return coverPin({ pinId, type: 'input', subPinId }, spec)
}

export const exposeOutputSet = (
  { pinId, output }: { pinId: string; output: GraphPinSpec },
  spec: GraphSpec
): void => exposePinSet({ pinId, pinSpec: output, type: 'output' }, spec)

export const exposeOutput = (
  {
    pinId,
    subPinId,
    output,
  }: { pinId: string; subPinId: string; output: GraphSubPinSpec },
  spec: GraphSpec
): void => {
  return exposePin(
    { pinId, subPinId, subPinSpec: output, type: 'output' },
    spec
  )
}

export const coverOutputSet = (
  { pinId }: { pinId: string },
  spec: GraphSpec
): void => coverPinSet({ pinId, type: 'output' }, spec)

export const coverOutput = (
  {
    pinId,
    subPinId,
  }: {
    pinId: string
    subPinId: string
  },
  spec: GraphSpec
): void => {
  return coverPin({ pinId, type: 'output', subPinId }, spec)
}

export const setPinSetId = (
  { type, pinId, newId }: { type: IO; pinId: string; newId: string },
  spec: GraphSpec
): void => {
  const pinSpec = deepGet(spec, [`${type}s`, pinId])

  pathDelete(spec, [`${type}s`, pinId])
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
      forEachValueKey(spec.inputs ?? {}, ({ plug }, _pinId) => {
        forEachValueKey(plug, (input, subPinId) => {
          if (input.unitId === unitId && input.pinId === pinId) {
            unplugInput({ pinId: _pinId, subPinId }, spec)
          }
        })
      })
    }

    if (type === 'output') {
      forEachValueKey(spec.outputs ?? {}, ({ plug }, _pinId) => {
        forEachValueKey(plug, (output, subPinId) => {
          if (output.unitId === unitId && output.pinId === pinId) {
            unplugOutput({ pinId: _pinId, subPinId }, spec)
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
  pathMerge(spec, ['units', unitId, 'metadata', 'component'], { width, height })
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
    width,
    height,
  })
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
