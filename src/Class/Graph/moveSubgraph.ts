import { SELF } from '../../constant/SELF'
import deepGet from '../../deepGet'
import {
  forEachPinOnMerge,
  getMergePinCount,
  getMergeTypePinCount,
  getMergeUnitPinCount,
  isEmptyMerge,
  opposite,
} from '../../spec/util/spec'
import forEachValueKey from '../../system/core/object/ForEachKeyValue/f'
import { keyCount } from '../../system/core/object/KeyCount/f'
import { GraphPinSpec, GraphPlugOuterSpec, GraphSubPinSpec } from '../../types'
import { Dict } from '../../types/Dict'
import { GraphMergeSpec } from '../../types/GraphMergeSpec'
import { GraphMergesSpec } from '../../types/GraphMergesSpec'
import { GraphSpec } from '../../types/GraphSpec'
import { GraphUnitConnect } from '../../types/GraphUnitConnect'
import { IO } from '../../types/IO'
import { IOOf, forIO, forIOObjKV } from '../../types/IOOf'
import { UCG } from '../../types/interface/UCG'
import {
  clone,
  forEachObjKV,
  forEachObjVK,
  getObjSingleKey,
  pathOrDefault,
  pathSet,
} from '../../util/object'
import { GraphMoveSubGraphData } from './interface'

export function moveUnit(
  source: GraphLike,
  target: GraphLike,
  graphId: string,
  unitId: string,
  collapseMap: GraphMoveSubGraphData,
  connectOpt: GraphUnitConnect,
  ignoredUnit: Set<string>,
  unitIgnoredPin: Dict<IOOf<Set<string>>>,
  ignoredMerge: Set<string>,
  pinSpecs: IOOf<Dict<GraphPinSpec>>,
  reverse: boolean
) {
  const {
    nextIdMap,
    nextPinIdMap,
    nextSubComponentParentMap,
    nextSubComponentChildrenMap,
  } = collapseMap

  const unit = source.getUnit(unitId)

  const nextUnitId = nextIdMap.unit?.[unitId] || unitId
  const nextSubComponentParentId = nextSubComponentParentMap[unitId] || null
  const nextSubComponentChildren = nextSubComponentChildrenMap[unitId] || []
  const nextUnitPinMap = nextPinIdMap[unitId] || {}

  const ignoredPin = unitIgnoredPin[unitId] || {
    input: new Set(),
    output: new Set(),
  }

  const spec = source.getSpec() as GraphSpec

  const { units, component = {} } = spec

  const { subComponents = {} } = component

  const unitSpec = units[unitId]
  const subComponent = subComponents[unitId]

  source.removeUnit(unitId, false, false, false)
  target.addUnit(nextUnitId, unit, undefined, false)

  if (nextSubComponentParentId) {
    if (target.hasUnit(nextSubComponentParentId)) {
      const to =
        nextSubComponentChildrenMap[nextSubComponentParentId].indexOf(
          nextUnitId
        )

      target.moveRoot(nextSubComponentParentId, nextUnitId, to, 'default')
    }
  }

  if (nextSubComponentChildren) {
    for (let i = 0; i < nextSubComponentChildren.length; i++) {
      const nextSubComponentChildId = nextSubComponentChildren[i]

      if (target.hasUnit(nextSubComponentChildId)) {
        target.moveRoot(nextUnitId, nextSubComponentChildId, i, 'default')
      }
    }
  }

  if (subComponent) {
    const { metadata: { component } = {} } = unitSpec

    if (
      component &&
      typeof component.width === 'number' &&
      typeof component.height === 'number'
    ) {
      target.setUnitSize(nextUnitId, component.width, component.height)
    }
  }

  const moveUnitPin = (type: IO, pinId: string): void => {
    const {
      pinId: nextPinId,
      subPinId: nextSubPinId,
      plug,
      mergeId,
      merge,
    } = pathOrDefault(nextUnitPinMap, [type, pinId], {
      pinId: undefined,
      subPinId: undefined,
    })

    if (!ignoredPin[type].has(pinId) && !unit.isPinIgnored(type, pinId)) {
      const shouldSwapMergePin =
        mergeId && (!ignoredMerge.has(mergeId) || reverse)

      if (reverse) {
        //
      } else {
        if (target.hasPinNamed(type, nextPinId)) {
          //
        } else {
          forEachObjVK(pinSpecs[type] || {}, ({ plug = {} }, id) => {
            for (const subPinId in plug) {
              const subPinSpec = plug[subPinId]

              if (subPinSpec.unitId === unitId && subPinSpec.pinId === pinId) {
                source.unplugPin(type, id, subPinId, false, false)

                break
              }
            }
          })
        }
      }

      if (nextPinId && nextSubPinId) {
        if (reverse) {
          if (mergeId) {
            if (target.hasMergePin(mergeId, graphId, type, nextPinId)) {
              target.removePinOrMerge(
                mergeId,
                graphId,
                type,
                nextPinId,
                false,
                false
              )
            }
          }

          const { pinId: _pinId, subPinId: _subPinId } =
            connectOpt.plugs?.[type]?.[pinId] || {}

          if (_pinId && _subPinId && _pinId === nextPinId) {
            if (target.hasPinNamed(type, _pinId)) {
              if (target.hasPlug(type, _pinId, _subPinId)) {
                target.unplugPin(type, _pinId, _subPinId, false, false)
              }

              target.plugPin(
                type,
                _pinId,
                _subPinId,
                {
                  unitId: nextUnitId,
                  pinId,
                },
                false,
                false
              )
            } else {
              target.exposePinSet(
                type,
                _pinId,
                {
                  plug: {
                    [_subPinId]: {
                      unitId: nextUnitId,
                      pinId,
                    },
                  },
                },
                undefined,
                false,
                false
              )
            }
          }
        } else {
          if (target.hasPinNamed(type, nextPinId)) {
            target.exposePin(
              type,
              nextPinId,
              nextSubPinId,
              {
                unitId: nextUnitId,
                pinId,
              },
              false,
              false
            )
          } else {
            const ref = unit.isPinRef(type, pinId)
            const data = unit.getPinData(type, pinId)

            target.exposePinSet(
              type,
              nextPinId,
              {
                plug: {
                  '0': {
                    unitId: nextUnitId,
                    pinId,
                  },
                },
                ref,
              },
              data,
              false,
              false
            )

            forEachValueKey(pinSpecs[type] || {}, ({ plug }, id) => {
              for (const subPinId in plug) {
                const subPinSpec = plug[subPinId]

                if (
                  subPinSpec.unitId === unitId &&
                  subPinSpec.pinId === pinId
                ) {
                  source.plugPin(
                    type,
                    id,
                    subPinId,
                    {
                      unitId: graphId,
                      pinId: nextPinId,
                    },
                    false,
                    false
                  )

                  break
                }
              }
            })
          }
        }

        const constant = unit.isPinConstant(type, pinId)

        if (constant) {
          if (reverse) {
            //
          } else {
            target.setUnitPinConstant(unitId, type, pinId, false, false)
            target.setPinConstant(type, nextPinId, true)
          }
        }

        if (shouldSwapMergePin) {
          if (reverse) {
            if (target.hasMergePin(mergeId, graphId, type, pinId)) {
              target.removePinOrMerge(
                mergeId,
                graphId,
                type,
                pinId,
                false,
                false
              )
            }

            if (!target.hasMerge(mergeId)) {
              target.addMerge(merge ?? {}, mergeId, false, false)
            }

            if (!target.hasMergePin(mergeId, nextUnitId, type, pinId)) {
              target.addPinToMerge(
                mergeId,
                nextUnitId,
                type,
                pinId,
                false,
                false
              )
            }
          } else {
            if (!source.hasMerge(mergeId)) {
              source.addMerge(merge ?? {}, mergeId, false, false)
            }

            if (source.hasMergePin(mergeId, unitId, type, pinId)) {
              source.removePinFromMerge(
                mergeId,
                unitId,
                type,
                pinId,
                false,
                false
              )
            }

            if (!source.hasMergePin(mergeId, graphId, type, nextPinId)) {
              source.addPinToMerge(
                mergeId,
                graphId,
                type,
                nextPinId,
                false,
                false
              )
            }
          }
        }
      }
    }

    if (plug) {
      const { type, pinId, subPinId, kind = type } = plug

      if (reverse) {
        //
      } else {
        if (target.hasPlug(type, pinId, subPinId)) {
          target.plugPin(type, pinId, subPinId, {
            unitId: nextUnitId,
            pinId,
            kind,
          })
        } else {
          //
        }
      }
    }
  }

  const inputs = unit.getInputNames()
  for (const input_id of inputs) {
    moveUnitPin('input', input_id)
  }
  const outputs = unit.getOutputNames()
  for (const output_id of outputs) {
    moveUnitPin('output', output_id)
  }
  moveUnitPin('output', SELF)
}

export function moveLinkPinInto(
  source: GraphLike,
  target: GraphLike,
  graphId: string,
  unitId: string,
  type: IO,
  pinId: string,
  data: any,
  collapseMap: GraphMoveSubGraphData,
  oppositeMergeId: string | null,
  oppositePinId: string | null,
  plugPinSpec: { pinId: string; subPinId: string } | null,
  ignoredUnit: Set<string> = new Set(),
  reverse: boolean
): void {
  if (ignoredUnit.has(unitId) && graphId !== unitId) {
    return
  }

  const { nextPinIdMap } = collapseMap

  const { mergeId, merge } = pathOrDefault(nextPinIdMap, [type, pinId], {
    pinId: undefined,
    subPinId: undefined,
  })

  if (graphId === unitId) {
    if (reverse) {
      //
    } else {
      const constant = target.isPinConstant(type, pinId)

      const pinSpec = clone(target.getExposedPinSpec(type, pinId))

      if (mergeId && merge) {
        const mergeUnit = merge[unitId]

        const mergePinCount = getMergePinCount(merge)
        const unitMergePinCount = getMergeUnitPinCount(mergeUnit)

        if (mergePinCount - unitMergePinCount > 0) {
          //
        } else {
          target.coverPinSet(type, pinId, false)
        }
      } else {
        target.coverPinSet(type, pinId, false)
      }

      if (constant) {
        const { plug = {} } = pinSpec

        for (const subPinId in plug) {
          const subPinSpec = plug[subPinId]

          if (subPinSpec.unitId && subPinSpec.pinId) {
            target.setUnitPinConstant(
              subPinSpec.unitId,
              type,
              subPinSpec.pinId,
              true
            )
          } else if (subPinSpec.mergeId) {
            const mergeSpec = target.getMergeSpec(subPinSpec.mergeId)

            forEachPinOnMerge(mergeSpec, (unitId, type, pinId) => {
              target.setUnitPinConstant(unitId, type, pinId, true)
            })
          }
        }
      }
    }
  } else {
    if (oppositeMergeId && oppositePinId) {
      const oppositeType = opposite(type)

      if (reverse) {
        if (source.hasPinNamed(oppositeType, oppositePinId)) {
          source.coverPinSet(oppositeType, oppositePinId, false)
        } else {
          //
        }
      } else {
        if (target.hasPinNamed(oppositeType, oppositePinId)) {
          //
        } else {
          const unit = source.getUnit(unitId)

          data = data ?? source.getUnitPinData(unitId, type, pinId)

          const ref = unit.isPinRef(type, pinId)

          const pinSpec = { plug: { '0': {} }, ref }

          target.exposePinSet(
            oppositeType,
            oppositePinId,
            pinSpec,
            data,
            false,
            false
          )
        }

        if (source.hasMerge(oppositeMergeId)) {
          const merge = source.getMergeSpec(oppositeMergeId)

          if (!merge?.[graphId]?.[oppositeType]?.[oppositePinId]) {
            source.addPinToMerge(
              oppositeMergeId,
              graphId,
              oppositeType,
              oppositePinId,
              false,
              false
            )
          }

          source.addPinToMerge(
            oppositeMergeId,
            unitId,
            type,
            pinId,
            false,
            false
          )
        } else {
          const merge = {
            [unitId]: {
              [type]: {
                [pinId]: true,
              },
            },
            [graphId]: {
              [oppositeType]: {
                [oppositePinId]: true,
              },
            },
          }

          source.addMerge(merge, oppositeMergeId, false, false)
        }
      }
    } else {
      //
    }

    if (plugPinSpec) {
      const nextUnitId = unitId // TODO

      const newPinSpec =
        graphId !== unitId
          ? { plug: { '0': { unitId: nextUnitId, pinId } } }
          : { plug: { '0': {} } }

      target.exposePinSet(
        type,
        plugPinSpec.pinId,
        newPinSpec,
        undefined,
        false,
        false
      )

      source.plugPin(type, plugPinSpec.pinId, plugPinSpec.subPinId, {
        unitId: graphId,
        pinId: plugPinSpec.pinId,
      })
    }
  }
}

export function moveMerge(
  source: GraphLike,
  target: GraphLike,
  graphId: string,
  mergeId: string,
  mergeSpec: GraphMergeSpec,
  collapseMap: GraphMoveSubGraphData,
  connectOpt: GraphUnitConnect,
  ignoredUnit: Set<string> = new Set(),
  pinSpecs: IOOf<Dict<GraphPinSpec>>,
  reverse: boolean
) {
  const { nextIdMap, nextMergePinId } = collapseMap

  const nextMergeId = nextIdMap.merge[mergeId] ?? mergeId

  const { input: nextInput = null, output: nextOutput = null } =
    nextMergePinId[mergeId] || {}

  let pinIntoCount = 0

  const sourceMergeSpec = source.getMergeSpec(mergeId)

  const nextMerge: GraphMergeSpec = {}

  const { merges: graphMerges } = connectOpt

  const mergePinCount = getMergePinCount(mergeSpec)

  const mergeInputCount = getMergeTypePinCount(mergeSpec, 'input')
  const mergeOutputCount = getMergeTypePinCount(mergeSpec, 'output')

  const data = source.getMergeData(mergeId)

  if (source.hasMerge(mergeId)) {
    source.removeMerge(mergeId, false, false)
  }

  const moveMergePin = (unitId: string, type: IO, pinId: string): void => {
    const nextUnitId = nextIdMap.unit?.[unitId] || unitId

    if (unitId === graphId && !ignoredUnit.has(unitId)) {
      const pinSpec = target.getExposedPinSpec(type, pinId)

      const { plug } = pinSpec

      for (const subPinId in plug) {
        const subPin = plug[subPinId]

        if (subPin.unitId && subPin.pinId) {
          pathSet(nextMerge, [subPin.unitId, type, subPin.pinId], true)
        } else if (subPin.mergeId) {
          const mergeSpec = target.getMergeSpec(subPin.mergeId)

          forEachPinOnMerge(mergeSpec, (unitId, type, pinId) => {
            pathSet(nextMerge, [nextUnitId, type, pinId], true)
          })
        }
      }

      pinIntoCount++
    } else if (ignoredUnit.has(unitId)) {
      pathSet(nextMerge, [nextUnitId, type, pinId], true)

      pinIntoCount++
    } else {
      //
    }

    const isInput = type === 'input'

    const pickInput = !isInput && !ignoredUnit.has(unitId)

    const {
      mergeId: nextMergeId,
      pinId: nextPinId,
      subPinSpec: nextSubPinSpec,
    } = (pickInput ? nextInput : nextOutput) ?? {}

    moveLinkPinInto(
      source,
      target,
      graphId,
      unitId,
      type,
      pinId,
      data,
      collapseMap,
      nextMergeId,
      nextPinId,
      null,
      ignoredUnit,
      reverse
    )
  }

  forEachPinOnMerge(mergeSpec, moveMergePin)

  if (reverse) {
    if (mergePinCount === 0 || pinIntoCount > 1) {
      target.addMerge(nextMerge, nextMergeId, false, false)
    }
  } else {
    if (
      (pinIntoCount === 0 &&
        (mergePinCount === 0 ||
          (mergeInputCount > 0 && mergeOutputCount > 0))) ||
      pinIntoCount > 1
    ) {
      let shouldPropagate = false

      if (getMergePinCount(nextMerge) > 0) {
        const sampleMergeUnitId = getObjSingleKey(nextMerge)
        const sampeMergeUnit = nextMerge[sampleMergeUnitId]
        const sampleMergeUnitType = getObjSingleKey(sampeMergeUnit) as IO
        const sampleMergeUnitPinId = getObjSingleKey(
          sampeMergeUnit[sampleMergeUnitType]
        )

        if (target.hasUnit(sampleMergeUnitId)) {
          const unit = target.getUnit(sampleMergeUnitId)

          const ref = unit.isPinRef(sampleMergeUnitType, sampleMergeUnitPinId)

          if (ref) {
            shouldPropagate = true
          }
        }
      }

      target.addMerge(nextMerge, nextMergeId, false, shouldPropagate)

      if (
        keyCount(mergeSpec ?? {}) === 1 &&
        getObjSingleKey(mergeSpec) === graphId
      ) {
        forEachPinOnMerge(mergeSpec, (_graphId, type, pinId) => {
          if (target.hasPinNamed(type, pinId)) {
            target.coverPinSet(type, pinId)
          }
        })
      }
    }
  }

  const processMergePin = (
    type: IO,
    nextPin: {
      mergeId: string
      pinId: string
      subPinSpec: GraphSubPinSpec
      oppositeMerge?: GraphMergeSpec
    }
  ) => {
    const { mergeId: _mergeId, pinId, subPinSpec, oppositeMerge } = nextPin

    if (pinId && subPinSpec) {
      if (reverse) {
        // if (source.hasPinNamed(type, pinId)) {
        //   if (source.getPinPlugCount(type, pinId) > 1) {
        //     source.coverPin(type, pinId, '0', false)
        //   } else {
        //     source.coverPinSet(type, pinId, false)
        //   }
        // }

        if (target.hasMergePin(_mergeId, graphId, type, pinId)) {
          target.removeMerge(_mergeId, false, false)
        }

        for (const graphMergeId in graphMerges) {
          const merge = graphMerges[graphMergeId]

          const graphMerge = merge[graphId]

          if (graphMerge?.output?.[SELF]) {
            return
          }

          for (const graphPinType in graphMerge) {
            const graphMergeTypePins = graphMerge[graphPinType]

            for (const graphPinId in graphMergeTypePins) {
              if (graphPinId !== pinId) {
                continue
              }

              const pinSpec = pinSpecs[graphPinType][graphPinId]

              const { plug } = pinSpec

              for (const subPinId in plug) {
                const subPinSpec = plug[subPinId]

                if (subPinSpec.mergeId) {
                  const newMergeId =
                    nextIdMap.merge?.[subPinSpec.mergeId] || subPinSpec.mergeId

                  const mergeClone = clone(merge)

                  delete mergeClone[graphId]

                  const otherUnitId = getObjSingleKey(mergeClone)
                  const otherUnitPinType = getObjSingleKey(
                    mergeClone[otherUnitId]
                  ) as IO
                  const otherUnitPinId = getObjSingleKey(
                    mergeClone[otherUnitId][otherUnitPinType]
                  )

                  if (target.hasMerge(newMergeId)) {
                    forEachPinOnMerge(
                      mergeClone,
                      (unitId, unitPinType, pinId) => {
                        if (
                          unitPinType !== type &&
                          !target.hasMergePin(
                            newMergeId,
                            unitId,
                            unitPinType,
                            pinId
                          )
                        ) {
                          target.addPinToMerge(
                            newMergeId,
                            unitId,
                            unitPinType,
                            pinId,
                            false
                          )
                        }
                      }
                    )
                  } else {
                    const newMergeSpec = {
                      [otherUnitId]: {
                        [otherUnitPinType]: { [otherUnitPinId]: true },
                      },
                    }

                    if (!target.hasMerge(newMergeId)) {
                      target.addMerge(newMergeSpec, newMergeId, false, false)
                    }
                  }
                } else if (subPinSpec.unitId && subPinSpec.pinId) {
                  const newUnitId =
                    nextIdMap.unit?.[subPinSpec.unitId] || subPinSpec.unitId

                  if (target.hasMerge(graphMergeId)) {
                    target.addPinToMerge(
                      graphMergeId,
                      newUnitId,
                      graphPinType as IO,
                      subPinSpec.pinId,
                      false
                    )
                  } else {
                    if (oppositeMerge) {
                      const mergeClone = clone(oppositeMerge)

                      delete mergeClone[subPinSpec.unitId]

                      const otherUnitId = getObjSingleKey(mergeClone)

                      if (!otherUnitId) {
                        continue
                      }

                      const otherUnitPinType = getObjSingleKey(
                        mergeClone[otherUnitId]
                      )
                      const otherUnitPinId = getObjSingleKey(
                        mergeClone[otherUnitId][otherUnitPinType]
                      )

                      target.addMerge(
                        {
                          [newUnitId]: {
                            [graphPinType]: { [subPinSpec.pinId]: true },
                          },
                          [otherUnitId]: {
                            [otherUnitPinType]: { [otherUnitPinId]: true },
                          },
                        },
                        mergeId,
                        false,
                        false,
                        undefined
                      )
                    }
                  }
                }
              }
            }
          }
        }
      } else {
        if (target.hasPinNamed(type, pinId)) {
          target.exposePin(type, pinId, '0', subPinSpec, false, false)
        } else {
          target.exposePinSet(
            type,
            pinId,
            {
              plug: {
                '0': subPinSpec,
              },
            },
            undefined,
            false,
            false
          )
        }
      }
    }
  }

  nextInput && processMergePin('input', nextInput)
  nextOutput && processMergePin('output', nextOutput)

  forIO(pinSpecs, (type, pinsSpec) => {
    forEachObjKV(pinsSpec, (pinId, pinSpec) => {
      if (
        pathOrDefault(collapseMap, ['nextPlugSpec', type, pinId], undefined)
      ) {
        return
      }

      const { plug } = pinSpec

      for (const subPinId in plug) {
        const subPinSpec = plug[subPinId]

        if (subPinSpec.mergeId === mergeId) {
          const { mergeId: oppositeMergeId, oppositeMerge } =
            (type === 'input' ? nextInput : nextOutput) ?? {}

          if (reverse) {
            // if (target.hasPlug(type, pinId, subPinId)) {
            //   target.unplugPin(type, pinId, subPinId, false, false)
            // }

            if (isEmptyMerge(sourceMergeSpec)) {
              const targetPinSpecs = target.getExposedPinSpecs()

              forEachObjKV(
                targetPinSpecs[type] ?? {},
                (pinId, targetPinSpec) => {
                  const { plug = {} } = targetPinSpec

                  for (const subPinId in plug) {
                    const subPinSpec = plug[subPinId]

                    if (
                      subPinSpec.unitId === graphId &&
                      subPinSpec.pinId === pinId
                    ) {
                      target.unplugPin(type, pinId, subPinId, false, false)
                      target.plugPin(
                        type,
                        pinId,
                        subPinId,
                        {
                          mergeId: oppositeMergeId,
                        },
                        false,
                        false
                      )
                    }
                  }
                }
              )

              if (!oppositeMergeId || !oppositeMerge) {
                continue
              }

              if (target.hasMerge(nextMergeId)) {
                forEachPinOnMerge(oppositeMerge, (unitId, type, pinId) => {
                  if (unitId !== graphId) {
                    if (!target.hasMergePin(nextMergeId, unitId, type, pinId)) {
                      target.addPinToMerge(
                        nextMergeId,
                        unitId,
                        type,
                        pinId,
                        false,
                        false
                      )
                    }
                  }
                })
              } else {
                target.addMerge(oppositeMerge, nextMergeId, false, false)
              }
            }
          } else {
            if (source.hasPlug(type, pinId, subPinId)) {
              const subPinSpec = oppositeMergeId
                ? { mergeId: oppositeMergeId }
                : { unitId: graphId, pinId }

              const hasMerge = target.hasMerge(nextMergeId)

              const data = source.getPinData(type, pinId)

              if (!target.hasPinNamed(type, pinId)) {
                target.exposePinSet(
                  type,
                  pinId,
                  {
                    plug: {
                      [subPinId]: hasMerge ? { mergeId: nextMergeId } : {},
                    },
                  },
                  data,
                  false,
                  false
                )
              } else {
                target.plugPin(
                  type,
                  pinId,
                  subPinId,
                  hasMerge ? { mergeId: nextMergeId } : {},
                  false,
                  false
                )
              }

              if (!source.hasPinNamed(type, pinId)) {
                source.exposePinSet(
                  type,
                  pinId,
                  {
                    plug: {
                      [subPinId]: subPinSpec,
                    },
                  },
                  undefined,
                  false,
                  false
                )
              } else {
                if (source.hasPlug(type, pinId, subPinId)) {
                  source.unplugPin(type, pinId, subPinId, false, false)
                }

                source.plugPin(type, pinId, subPinId, subPinSpec, false, false)
              }
            }
          }
        }
      }
    })
  })
}

export function movePlug(
  source: GraphLike,
  target: GraphLike,
  graphId: string,
  type: IO,
  pinId: string,
  pinSpec: GraphPinSpec,
  subPinId: string,
  subPinSpec: GraphSubPinSpec,
  nextPlugSpec: GraphMoveSubGraphData['nextPlugSpec'],
  nextPinIdMap: GraphMoveSubGraphData['nextPinIdMap'],
  nextMergePinId: GraphMoveSubGraphData['nextMergePinId'],
  nextIdMap: GraphMoveSubGraphData['nextIdMap']
) {
  const currentPinSpec = source.getExposedPinSpec(type, pinId)

  let data: any

  if (currentPinSpec) {
    const plugCount = keyCount(currentPinSpec.plug ?? {})

    data = source.getPinData(type, pinId)

    if (plugCount === 1) {
      source.coverPinSet(type, pinId, false)
    } else {
      source.coverPin(type, pinId, subPinId, false)
    }
  }

  const nextType = pathOrDefault(
    nextIdMap,
    ['plug', type, pinId, subPinId, 'type'],
    type
  )

  const nextSubPinId = pathOrDefault(
    nextIdMap,
    ['plug', type, pinId, subPinId, 'subPinId'],
    subPinId
  )

  const nextSubPinSpec: GraphSubPinSpec = pathOrDefault(
    nextPlugSpec,
    [type, pinId, subPinId],
    undefined
  )

  if (!subPinSpec) {
    source.exposePinSet(
      type,
      pinId,
      { plug: { [subPinId]: {} } },
      undefined,
      false,
      false
    )

    return
  }

  if (!nextSubPinSpec) {
    return
  }

  const { pinId: nextPinId = subPinSpec.pinId } = nextSubPinSpec

  let nextSubPinSpec_ = nextSubPinSpec

  if (
    nextSubPinSpec.unitId &&
    nextSubPinSpec.pinId &&
    target.hasUnit(nextSubPinSpec.unitId)
  ) {
    //
  } else if (
    nextSubPinSpec.mergeId &&
    target.hasMerge(nextSubPinSpec.mergeId)
  ) {
    //
  } else {
    nextSubPinSpec_ = {}
  }

  if (target.hasPinNamed(nextType, pinId)) {
    target.exposePin(
      nextType,
      pinId,
      nextSubPinId,
      nextSubPinSpec_,
      false,
      false
    )
  } else {
    target.exposePinSet(
      nextType,
      pinId,
      {
        plug: {
          [nextSubPinId]: nextSubPinSpec_,
        },
      },
      data,
      false,
      false
    )
  }

  if (!subPinSpec) {
    return
  }

  if (subPinSpec.unitId && subPinSpec.pinId) {
    let nextMergeId = pathOrDefault(
      nextIdMap,
      ['link', subPinSpec.unitId, subPinSpec.type, pinId, 'mergeId'],
      null
    )

    if (nextMergeId) {
      source.addPinToMerge(
        nextMergeId,
        graphId,
        nextType,
        nextPinId,
        false,
        false
      )
    } else {
      nextMergeId = pathOrDefault(
        nextIdMap,
        ['plug', type, pinId, subPinId, 'mergeId'],
        null
      )

      if (nextMergeId) {
        if (source.hasMerge(nextMergeId)) {
          source.addPinToMerge(
            nextMergeId,
            graphId,
            nextType,
            nextPinId,
            false,
            false
          )
        } else {
          source.addMerge(
            {
              [graphId]: {
                [nextType]: {
                  [nextPinId]: true,
                },
              },
              [subPinSpec.unitId]: {
                [type]: {
                  [subPinSpec.pinId]: true,
                },
              },
            },
            nextMergeId,
            false,
            false,
            undefined
          )
        }
      }
    }
  } else if (subPinSpec.mergeId) {
    const nextMergeId = pathOrDefault(
      nextMergePinId,
      ['merge', subPinSpec.mergeId, type],
      null
    )

    if (nextMergeId) {
      source.addPinToMerge(
        nextMergeId,
        graphId,
        nextType,
        nextPinId,
        false,
        false
      )
    } else {
      //
    }
  }
}

export type GraphLike<T extends UCG = UCG> = Pick<
  T,
  | 'getMergeSpec'
  | 'getMergesSpec'
  | 'coverPinSet'
  | 'hasPinNamed'
  | 'hasMergePin'
  | 'getUnit'
  | 'exposePinSet'
  | 'getUnitPinData'
  | 'hasUnit'
  | 'addUnit'
  | 'removeUnit'
  | 'removeMerge'
  | 'moveRoot'
  | 'unplugPin'
  | 'plugPin'
  | 'exposePin'
  | 'setPinData'
  | 'addPinToMerge'
  | 'getPinPlugCount'
  | 'getPinData'
  | 'setPinConstant'
  | 'setUnitPinConstant'
  | 'hasPlug'
  | 'coverPin'
  | 'isUnitPinRef'
  | 'isUnitPinConstant'
  | 'addMerge'
  | 'hasMerge'
  | 'getExposedPinSpec'
  | 'getExposedPinSpecs'
  | 'removePinOrMerge'
  | 'removePinFromMerge'
  | 'isPinConstant'
  | 'getPlugSpecs'
  | 'getSubPinSpec'
  | 'getMergeData'
  | 'getSpec'
  | 'setUnitSize'
  | 'setSubComponentSize'
>

export function moveSubgraph<T extends UCG<any, any, any>>(
  source: GraphLike<T>,
  target: GraphLike<T>,
  graphId: string,
  collapseMap: GraphMoveSubGraphData,
  connectOpt: GraphUnitConnect,
  reverse: boolean = true
) {
  const {
    nodeIds,
    nextIdMap,
    nextPinIdMap,
    nextMergePinId,
    nextPlugSpec,
    nextSubComponentParentMap,
    nextSubComponentChildrenMap,
  } = collapseMap

  const { merge = [], link = [], unit = [], plug = [] } = nodeIds

  const mergeSpecs = clone(source.getMergesSpec())
  const pinSpecs = clone(source.getExposedPinSpecs())

  const ignoredUnitPin: Dict<{ input: Set<string>; output: Set<string> }> = {}
  const ignoredUnit = new Set<string>(unit)
  const ignoredMerge = new Set<string>(merge)

  const setUnitPinIgnored = (unitId: string, type: IO, pinId: string) => {
    // console.log('setUnitPinIgnored', unitId, type, pinId)

    ignoredUnitPin[unitId] = ignoredUnitPin[unitId] || {
      input: new Set(),
      output: new Set(),
    }

    ignoredUnitPin[unitId][type].add(pinId)
  }

  const findUnitPinPlug = (
    unitId_: string,
    type_: IO,
    pinId_: string
  ): GraphPlugOuterSpec => {
    let plugSpec: GraphPlugOuterSpec

    forIOObjKV(pinSpecs, (type, pinId: string, pinSpec: GraphPinSpec) => {
      const { plug } = pinSpec

      for (const subPinId in plug) {
        const subPinSpec = plug[subPinId]

        if (subPinSpec.unitId === unitId_ && subPinSpec.pinId === pinId_) {
          plugSpec = {
            type,
            pinId,
            subPinId,
          }
        }
      }
    })

    return plugSpec
  }

  for (const { unitId, type, pinId } of link) {
    const pinPlug = findUnitPinPlug(unitId, type, pinId)

    if (
      pinPlug &&
      !plug.find((plugObj) => {
        return (
          plugObj.type === pinPlug.type &&
          plugObj.pinId === pinPlug.pinId &&
          plugObj.subPinId === pinPlug.subPinId
        )
      })
    ) {
      continue
    }

    setUnitPinIgnored(unitId, type, pinId)
  }

  const nextMergeSpecs: GraphMergesSpec = {}

  for (const mergeId of merge) {
    if (source.hasMerge(mergeId)) {
      const mergeSpec = source.getMergeSpec(mergeId)

      nextMergeSpecs[mergeId] = mergeSpec

      forEachPinOnMerge(mergeSpec, (unitId, type, pinId) => {
        setUnitPinIgnored(unitId, type, pinId)
      })
    }
  }

  for (const { unitId, type, pinId } of link) {
    const { mergeId, oppositePinId } = pathOrDefault(
      nextIdMap,
      ['link', unitId, type, pinId],
      { mergeId: null, oppositePinId: null }
    )

    const plugPinSpec: { pinId: string; subPinId: string } | null = null

    moveLinkPinInto(
      source,
      target,
      graphId,
      unitId,
      type,
      pinId,
      undefined,
      collapseMap,
      mergeId,
      oppositePinId,
      plugPinSpec,
      ignoredUnit,
      reverse
    )
  }

  for (const unitId of unit) {
    moveUnit(
      source,
      target,
      graphId,
      unitId,
      collapseMap,
      connectOpt,
      ignoredUnit,
      ignoredUnitPin,
      ignoredMerge,
      pinSpecs,
      reverse
    )
  }

  for (const mergeId of merge) {
    const mergeSpec = mergeSpecs[mergeId]

    moveMerge(
      source,
      target,
      graphId,
      mergeId,
      mergeSpec,
      collapseMap,
      connectOpt,
      ignoredUnit,
      pinSpecs,
      reverse
    )
  }

  for (const { type, pinId, subPinId } of plug) {
    const pinSpec = deepGet(pinSpecs, [type, pinId])
    const subPinSpec = pathOrDefault(
      pinSpecs,
      [type, pinId, 'plug', subPinId],
      undefined
    )

    movePlug(
      source,
      target,
      graphId,
      type,
      pinId,
      pinSpec,
      subPinId,
      subPinSpec,
      nextPlugSpec,
      nextPinIdMap,
      nextMergePinId,
      nextIdMap
    )
  }
}
