import { unitBundleSpec } from '../../bundle'
import { getExtNodeId, getMergeNodeId } from '../../client/id'
import { deepDefault_ } from '../../deepDefault'
import { deepSet_ } from '../../deepSet'
import { makeMoveSubComponentRootAction } from '../../spec/actions/C'
import {
  makeAddMergeAction,
  makeAddPinToMergeAction,
  makeAddUnitAction,
  makeCoverPinAction,
  makeCoverPinOrSetAction,
  makeCoverPinSetAction,
  makeExposePinAction,
  makeExposePinSetAction,
  makePlugPinAction,
  makeRemoveMergeAction,
  makeRemovePinFromMergeAction,
  makeRemoveUnitAction,
  makeSetPlugDataAction,
  makeSetSubComponentSizeAction,
  makeSetUnitPinConstantAction,
  makeSetUnitPinDataAction,
  makeUnplugPinAction,
} from '../../spec/actions/G'
import {
  getSingleMergePin,
  getSpec,
  isComponentSpec,
  isPinMerged,
  newMergeId,
  newPinId,
  newUnitId,
} from '../../spec/util'
import {
  getDefaultSlotSubComponentId,
  getSubComponentChildren,
  getSubComponentChildrenSlot,
  getSubComponentParentId,
  getSubComponentParentIndex,
  getSubComponentParentSlotName,
  getSubComponentSpec,
} from '../../spec/util/component'
import {
  findMergePlugs,
  findPinMergeId,
  findUnitMerges,
  findUnitPlugs,
  forEachGraphSpecPin,
  forEachGraphSpecPinPlug,
  forEachPinOnMerge,
  forEachPinOnMerges,
  forEachSpecPin,
  getMerge,
  getMergePinCount,
  getPinNodeId,
  getPinSpec,
  getPlugCount,
  getSubPinSpec,
  hasPin,
  isMergeRef,
  isPinRef,
  isUnitPinConstant,
  isUnitPinIgnored,
  isUnitPinRef,
  opposite,
} from '../../spec/util/spec'
import deepMerge from '../../system/f/object/DeepMerge/f'
import { keys } from '../../system/f/object/Keys/f'
import { GraphPlugOuterSpec, GraphSubPinSpec, Specs } from '../../types'
import { Dict } from '../../types/Dict'
import { GraphMergeSpec } from '../../types/GraphMergeSpec'
import { GraphPinSpec } from '../../types/GraphPinSpec'
import { GraphSpec } from '../../types/GraphSpec'
import { GraphSelection, GraphSelectionData } from '../../types/interface/G'
import { IO } from '../../types/IO'
import { IOOf, forIOObjKV, io } from '../../types/IOOf'
import { forEach } from '../../util/array'
import { clone } from '../../util/clone'
import { randomIdNotInSet } from '../../util/id'
import {
  deepDestroy,
  deepGet,
  deepGetOrDefault,
  deepInc,
  deepPush,
} from '../../util/object'
import { Moves } from './buildMoves'

export type LinkNodeSpec = {
  unitId: string
  type: IO
  pinId: string
}
export type PlugNodeSpec = {
  type: IO
  pinId: string
  subPinId: string
  template?: boolean
}
export type UnitNodeSpec = {
  unitId: string
  component?: {
    parentId?: string
    parentIndex?: number
    parentSlot?: string
    children?: string[]
    childrenSlot?: Dict<string>
    slot?: string
  }
}
export type MergeNodeSpec = {
  mergeId: string
}

export type MoveUnitMap = {
  in?: {
    unit: UnitNodeSpec
    merge?: Dict<MergeNodeSpec>
    plug?: IOOf<Dict<PlugNodeSpec>>
  }
  out?: {
    plug?: IOOf<Dict<PlugNodeSpec>>
  }
}

export type MoveNodeMap = {
  in?: {
    unit?: UnitNodeSpec
    merge?: MergeNodeSpec
    plug?: IOOf<PlugNodeSpec>
  }
  out?: {
    merge?: IOOf<MergeNodeSpec>
  }
}

export type MoveMapping = {
  unit?: Dict<MoveUnitMap>
  merge?: Dict<MoveNodeMap>
  link?: Dict<
    IOOf<Dict<MoveNodeMap & { in?: { link?: { template: boolean } } }>>
  >
  plug?: IOOf<Dict<Dict<MoveNodeMap>>>
}

export type MoveTask = {
  id: string
  dependsOn: Set<string>
  isDependencyOf: Set<string>
  moves: Moves
}

export type MoveMap = {
  source: GraphSpec
  target: GraphSpec
  mapping: MoveMapping
  table: Dict<string>
  tasks: Dict<MoveTask>
}

export function buildMoveMap(
  specs: Specs,
  source: GraphSpec,
  target: GraphSpec,
  graphId: string,
  selection: GraphSelection,
  data?: GraphSelectionData,
  reverse?: boolean
): MoveMap {
  const table: Dict<string> = {}
  const tasks: Dict<MoveTask> = {}

  const taskIdSet = new Set<string>()

  const newTaskId = (): string => {
    const taskId = randomIdNotInSet(taskIdSet)

    taskIdSet.add(taskId)

    return taskId
  }

  const newTask = (moves: Moves = []) => {
    const id = newTaskId()

    const task: MoveTask = {
      id,
      dependsOn: new Set(),
      isDependencyOf: new Set(),
      moves,
    }

    tasks[id] = task

    return task
  }

  const addDependency = (taskA: MoveTask, taskB: MoveTask) => {
    taskA.dependsOn.add(taskB.id)
    taskB.isDependencyOf.add(taskA.id)
  }

  const mapping = {
    unit: {},
    merge: {},
    link: {},
    plug: {},
  }

  const unitIdBlacklist = new Set(keys(target.units ?? {}))
  const targetPinIdBlacklist = {
    input: new Set(keys(target.inputs ?? {})),
    output: new Set(keys(target.outputs ?? {})),
  }

  const sourceMergeIdBlacklist = new Set(keys({}))
  const targetMergeIdBlacklist = new Set(keys(target.merges ?? {}))

  const targetSubPinBlacklist: IOOf<Dict<Set<string>>> = {
    input: {},
    output: {},
  }

  const linkSelectionMap = {}
  const plugSelectionMap = {}
  const mergeSelectionSet = new Set(selection.merge ?? [])
  const unitSelectionSet = new Set(selection.unit ?? [])

  const sourcePinToPlugs: Dict<IOOf<Dict<GraphPlugOuterSpec[]>>> = {}
  const sourceMergeToPlug: Dict<IOOf<Dict<GraphPlugOuterSpec>>> = {}

  const graphMerges = findUnitMerges(target, graphId)

  const graphPinToMergeId = {}

  const sourceRemoveMergeTasks: Dict<MoveTask> = {}
  const sourceRemoveUnitTasks = {}
  const sourceCoverPinSetTasks: IOOf<Dict<MoveTask>> = {}
  const sourceCoverPinTasks: IOOf<Dict<Dict<MoveTask>>> = {}

  const targetAddUnitTasks = {}
  const targetUnplugFromGraphPinTasks: IOOf<Dict<MoveTask>> = {}
  const targetNextMerges: Dict<GraphMergeSpec> = {}
  const targetPinNextMerges: Dict<IOOf<Dict<string>>> = {}
  const targetPinNextRemoveTasks: Dict<MoveTask[]> = {}
  const targetNextMergeSourceUnitIds: Dict<string[]> = {}
  const targetRemoveMergeTasks: Dict<MoveTask> = {}
  const targetRemovePinFromMergeTasks: Dict<Dict<IOOf<Dict<MoveTask>>>> = {}
  const targetExposePinSetTasks: Dict<MoveTask> = {}
  const targetExposePinTasks: Dict<MoveTask> = {}

  const nextUnitIdMap: Dict<string> = {}
  const prevUnitIdMap = {}

  const unitOutsideMerges: Dict<GraphMergeSpec> = {}

  const components = []

  const graphMergeMap = findUnitMerges(target, graphId)
  const graphPlugMap = findUnitPlugs(target, graphId)

  forEachPinOnMerges(graphMerges, (mergeId, unitId, type, pinId) => {
    if (unitId === graphId) {
      deepSet_(graphPinToMergeId, [type, pinId], mergeId)
    }
  })

  forEachGraphSpecPin(
    source,
    (type: IO, pinId: string, pinSpec: GraphPinSpec) => {
      const { plug = {} } = pinSpec

      for (const subPinId in plug) {
        const subPinSpec = plug[subPinId]

        if (subPinSpec.unitId && subPinSpec.pinId) {
          deepPush(
            sourcePinToPlugs,
            [subPinSpec.unitId, subPinSpec.kind ?? type, subPinSpec.pinId],
            { pinId, type, subPinId }
          )
        } else if (subPinSpec.mergeId) {
          const merge = getMerge(source, subPinSpec.mergeId)

          deepSet_(sourceMergeToPlug, [subPinSpec.mergeId, type], {
            pinId,
            type,
            subPinId,
          })

          forEachPinOnMerge(merge, (unitId, type, pinId_) => {
            deepSet_(sourcePinToPlugs, [unitId, type, pinId_], {
              pinId,
              type,
              subPinId,
            })
          })
        }
      }
    }
  )

  forEachGraphSpecPinPlug(
    target,
    (type, pinId, pinSpec, subPinId, subPinSpec) => {
      deepDefault_(targetSubPinBlacklist, [type, pinId], new Set())

      targetPinIdBlacklist[type].add(pinId)
      targetSubPinBlacklist[type][pinId].add(subPinId)
    }
  )

  selection.link?.forEach(({ unitId, type, pinId }) => {
    deepSet_(linkSelectionMap, [unitId, type, pinId], true)
  })

  selection.plug?.forEach(({ type, pinId, subPinId }) => {
    deepSet_(plugSelectionMap, [type, pinId, subPinId], true)
  })

  const isUnitSelected = (unitId: string): boolean => {
    return unitSelectionSet.has(unitId)
  }

  const isLinkSelected = (unitId: string, type: IO, pinId: string): boolean => {
    return deepGetOrDefault(linkSelectionMap, [unitId, type, pinId], false)
  }

  const isMergeSelected = (mergeId: string): boolean => {
    return mergeSelectionSet.has(mergeId)
  }

  const isPlugSelected = (type: IO, pinId: string, subPinId: string) => {
    return deepGetOrDefault(plugSelectionMap, [type, pinId, subPinId], false)
  }

  const mergeInside: Dict<IOOf<GraphMergeSpec>> = {}
  const mergeOutside: Dict<IOOf<GraphMergeSpec>> = {}
  const mergeSelf: Dict<IOOf<GraphMergeSpec>> = {}

  const mergeInsideCount: Dict<IOOf<number>> = {}
  const mergeOutsideCount: Dict<IOOf<number>> = {}
  const mergeSelfCount: Dict<IOOf<number>> = {}

  const sourceMergeIds = keys(source.merges ?? {})

  for (const mergeId of sourceMergeIds) {
    const merge = source.merges[mergeId]

    mergeInsideCount[mergeId] = mergeInsideCount[mergeId] ?? {
      input: 0,
      output: 0,
    }
    mergeOutsideCount[mergeId] = mergeOutsideCount[mergeId] ?? {
      input: 0,
      output: 0,
    }

    for (const unitId in merge) {
      const unitMerge = merge[unitId]

      forIOObjKV(unitMerge, (type, pinId) => {
        if (isUnitSelected(unitId)) {
          deepInc(mergeInsideCount, [mergeId, type])
          deepSet_(mergeInside, [mergeId, type, unitId, type, pinId], true)
        } else if (unitId === graphId) {
          deepInc(mergeSelfCount, [mergeId, type])
          deepSet_(mergeSelf, [mergeId, type, unitId, type, pinId], true)
        } else {
          deepInc(mergeOutsideCount, [mergeId, type])
          deepSet_(mergeOutside, [mergeId, type, unitId, type, pinId], true)
        }
      })
    }
  }

  const sourceShouldRemoveMerge = new Set()

  for (const mergeId of sourceMergeIds) {
    const outsideCount = mergeOutsideCount[mergeId]

    if (isMergeSelected(mergeId)) {
      if (
        !(outsideCount.input === 0 && outsideCount.output > 1) ||
        (outsideCount.output === 0 && outsideCount.input > 1)
      ) {
        sourceShouldRemoveMerge.add(mergeId)
      }
    } else {
      if (outsideCount.input + outsideCount.output < 2) {
        sourceShouldRemoveMerge.add(mergeId)
      }
    }
  }

  const newTargetPinId = (type: IO, pinId: string): string => {
    const newPinId_ = newPinId({}, type, pinId, targetPinIdBlacklist[type])

    targetPinIdBlacklist[type].add(newPinId_)

    return newPinId_
  }

  const newTargetSubPinId = (type: IO, pinId: string) => {
    let i = 0

    while (targetSubPinBlacklist?.[type]?.[pinId]?.has(`${i}`)) {
      i++
    }

    deepDefault_(targetSubPinBlacklist, [type, pinId], new Set())

    targetSubPinBlacklist[type][pinId].add(`${i}`)

    return `${i}`
  }

  const newSourceMergeId = (): string => {
    const newMergeId_ = newMergeId(source, sourceMergeIdBlacklist)

    sourceMergeIdBlacklist.add(newMergeId_)

    return newMergeId_
  }

  const newTargetMergeId = (): string => {
    const newMergeId_ = newMergeId(target, targetMergeIdBlacklist)

    targetMergeIdBlacklist.add(newMergeId_)

    return newMergeId_
  }

  const addPinPlug = (
    unitId: string,
    type: IO,
    pinId: string
  ): { nextPinId: string; nextSubPinId: string } => {
    const nextPinId = newTargetPinId(type, pinId)
    const nextSubPinId = newTargetSubPinId(type, nextPinId)

    deepSet_(mapping, ['unit', unitId, 'in', 'plug', type, pinId], {
      pinId: nextPinId,
      type,
      subPinId: nextSubPinId,
    })

    return { nextPinId, nextSubPinId }
  }

  for (const unitId of selection.unit ?? []) {
    const unit = source.units[unitId]

    const spec = getSpec(specs, unit.id)

    if (isComponentSpec(spec)) {
      components.push(unitId)
    }

    const bundle = unitBundleSpec(unit, specs)

    const nextUnitId = newUnitId(specs, target, unit.id, unitIdBlacklist)

    nextUnitIdMap[unitId] = nextUnitId
    prevUnitIdMap[nextUnitId] = unitId

    const merges = findUnitMerges(source, unitId)
    const plugss = findUnitPlugs(source, unitId)

    let parentId = null
    let parentIndex = null
    let parentSlot = null
    let children = []
    let childrenSlot = {}

    if (isComponentSpec(spec)) {
      parentId = getSubComponentParentId(source, unitId)
      parentSlot = getSubComponentParentSlotName(source, unitId)
      parentIndex = getSubComponentParentIndex(source, unitId)
      children = getSubComponentChildren(source, unitId)
      childrenSlot = getSubComponentChildrenSlot(source, unitId)
    }

    const moveUnitTask = newTask()

    table[unitId] = moveUnitTask.id

    unitIdBlacklist.add(nextUnitId)

    deepSet_(mapping, ['unit', unitId, 'in', 'unit', 'unitId'], nextUnitId)

    const removeUnitTask = newTask([
      {
        in: false,
        action: makeRemoveUnitAction(
          unitId,
          bundle,
          {},
          {},
          parentId,
          parentIndex,
          parentSlot,
          children,
          childrenSlot
        ),
      },
    ])

    addDependency(removeUnitTask, moveUnitTask)

    sourceRemoveUnitTasks[unitId] = removeUnitTask

    forIOObjKV(plugss, (type, pinId, plugs) => {
      forEach(plugs, (plug) => {
        const unplugPinTask = newTask([
          {
            in: false,
            action: makeUnplugPinAction(
              plug.type,
              plug.pinId,
              plug.subPinId,
              plug.subPinSpec
            ),
          },
        ])

        addDependency(unplugPinTask, moveUnitTask)
        addDependency(removeUnitTask, unplugPinTask)
      })
    })

    for (const mergeId in merges) {
      const merge = getMerge(source, mergeId)

      if (sourceShouldRemoveMerge.has(mergeId)) {
        if (!isMergeSelected(mergeId)) {
          let removeMergeTask = deepGetOrDefault(
            sourceRemoveMergeTasks,
            [mergeId],
            undefined
          )

          if (!removeMergeTask) {
            removeMergeTask = newTask([
              { in: false, action: makeRemoveMergeAction(mergeId, merge) },
            ])

            deepSet_(sourceRemoveMergeTasks, [mergeId], removeMergeTask)
          }

          addDependency(removeMergeTask, moveUnitTask)
          addDependency(removeUnitTask, removeMergeTask)
        }
      } else {
        const unitMerge = merge[unitId]

        forIOObjKV(unitMerge, (type, pinId) => {
          const removePinFromMergeTask = newTask([
            {
              in: false,
              action: makeRemovePinFromMergeAction(
                mergeId,
                unitId,
                type,
                pinId
              ),
            },
          ])

          addDependency(removePinFromMergeTask, moveUnitTask)
          addDependency(removeUnitTask, removePinFromMergeTask)
        })
      }
    }

    const addUnitTask = newTask([
      { in: true, action: makeAddUnitAction(nextUnitId, bundle) },
    ])

    addDependency(addUnitTask, moveUnitTask)
    addDependency(addUnitTask, removeUnitTask)

    targetAddUnitTasks[unitId] = addUnitTask

    forEachSpecPin(spec, (type, pinId) => {
      if (isUnitPinIgnored(source, unitId, type, pinId)) {
        return
      }

      const ref = isUnitPinRef(specs, source, unitId, type, pinId)
      const constant = isUnitPinConstant(source, unitId, type, pinId)

      const linkSelected = isLinkSelected(unitId, type, pinId)

      const outerPlugs = deepGetOrDefault(
        sourcePinToPlugs,
        [unitId, type, pinId],
        []
      ) as GraphPlugOuterSpec[]

      const addSetPinDatumTask = (
        nextPinId: string,
        exposePinTask: MoveTask
      ) => {
        const datum = deepGetOrDefault(
          data,
          ['pin', unitId, type, pinId],
          undefined
        )

        if (datum) {
          const setUnitPinDataTask = newTask([
            {
              in: false,
              action: makeSetUnitPinDataAction(graphId, type, nextPinId, datum),
            },
          ])

          addDependency(setUnitPinDataTask, exposePinTask)
        }
      }

      const addSetPinConstantTasks = (
        nextPinId: string,
        exposePinTask: MoveTask
      ) => {
        if (constant) {
          const setUnitPinNotConstantTask = newTask([
            {
              in: true,
              action: makeSetUnitPinConstantAction(
                nextUnitId,
                type,
                pinId,
                false
              ),
            },
          ])

          addDependency(setUnitPinNotConstantTask, addUnitTask)

          const setGraphPinConstant = newTask([
            {
              in: false,
              action: makeSetUnitPinConstantAction(
                graphId,
                type,
                nextPinId,
                true
              ),
            },
          ])

          addDependency(setGraphPinConstant, exposePinTask)
        }
      }

      if (
        linkSelected &&
        (!outerPlugs.length ||
          !outerPlugs.some(
            (outerPlug) =>
              !isPlugSelected(
                outerPlug.type,
                outerPlug.pinId,
                outerPlug.subPinId
              )
          ))
      ) {
        //
      } else {
        const outsideMergeId = findPinMergeId(source, unitId, type, pinId)

        if (outsideMergeId) {
          if (isMergeSelected(outsideMergeId)) {
            //
          } else {
            const { nextPinId, nextSubPinId } = addPinPlug(unitId, type, pinId)

            const pinSpec: GraphPinSpec = {
              plug: {
                [nextSubPinId]: {
                  unitId: nextUnitId,
                  kind: type,
                  pinId,
                },
              },
              ref,
            }

            const exposePinSetTask = newTask([
              {
                in: true,
                action: makeExposePinSetAction(type, nextPinId, pinSpec),
              },
            ])

            deepSet_(
              targetExposePinSetTasks,
              [type, nextPinId],
              exposePinSetTask
            )

            addDependency(exposePinSetTask, addUnitTask)

            addSetPinDatumTask(nextPinId, exposePinSetTask)
            addSetPinConstantTasks(nextPinId, exposePinSetTask)

            const outsideCount = mergeOutsideCount[outsideMergeId]
            const totalOutsideCount = outsideCount.input + outsideCount.output

            deepSet_(mapping, ['link', unitId, type, pinId, 'in', 'merge'], {
              mergeId: outsideMergeId,
            })

            if (totalOutsideCount > 1) {
              const addMergeTask = newTask([
                {
                  in: false,
                  action: makeAddPinToMergeAction(
                    outsideMergeId,
                    graphId,
                    type,
                    nextPinId
                  ),
                },
              ])

              addDependency(addMergeTask, exposePinSetTask)
            } else {
              deepSet_(
                unitOutsideMerges,
                [outsideMergeId, graphId, type, nextPinId],
                true
              )
            }
          }
        } else {
          if (reverse) {
            //
          } else {
            const startPinId = linkSelected
              ? outerPlugs[0]?.pinId ?? pinId
              : pinId

            const { nextPinId, nextSubPinId } = addPinPlug(
              unitId,
              type,
              startPinId
            )

            const subPinSpec = {
              unitId: nextUnitId,
              kind: type,
              pinId,
            }

            const outerPlugSelected = outerPlugs.filter((outerPlug) =>
              isPlugSelected(
                outerPlug.type,
                outerPlug.pinId,
                outerPlug.subPinId
              )
            )

            const outerPlugNotSelected = outerPlugs.filter(
              (outerPlug) =>
                !isPlugSelected(
                  outerPlug.type,
                  outerPlug.pinId,
                  outerPlug.subPinId
                )
            )

            let exposePinSetTask = deepGetOrDefault(
              targetExposePinSetTasks,
              [type, nextPinId],
              undefined
            )

            if (!exposePinSetTask) {
              exposePinSetTask = newTask([
                {
                  in: true,
                  action: makeExposePinSetAction(type, nextPinId, { ref }),
                },
              ])

              addDependency(exposePinSetTask, addUnitTask)

              if (!linkSelected || outerPlugSelected.length === 0) {
                const exposePinTask = newTask([
                  {
                    in: true,
                    action: makeExposePinAction(
                      type,
                      nextPinId,
                      nextSubPinId,
                      subPinSpec
                    ),
                  },
                ])

                addDependency(exposePinTask, exposePinSetTask)
              }

              addSetPinDatumTask(nextPinId, exposePinSetTask)
              addSetPinConstantTasks(nextPinId, exposePinSetTask)

              deepSet_(
                targetExposePinSetTasks,
                [type, nextPinId],
                exposePinSetTask
              )
            }

            forEach(outerPlugNotSelected, (outerPlug) => {
              const replugPinTask = newTask([
                {
                  in: false,
                  action: makePlugPinAction(
                    outerPlug.type,
                    outerPlug.pinId,
                    outerPlug.subPinId,
                    {
                      unitId: graphId,
                      kind: type,
                      pinId: nextPinId,
                    }
                  ),
                },
              ])

              addDependency(replugPinTask, exposePinSetTask)
            })
          }
        }
      }
    })
  }

  for (const outsideMergeId in unitOutsideMerges) {
    const outsideMerge = mergeOutside[outsideMergeId]
    const unitOutsideMerge = unitOutsideMerges?.[outsideMergeId]
    const nextOutsideMerge = deepMerge(
      unitOutsideMerge,
      deepMerge(outsideMerge?.input ?? {}, outsideMerge?.output ?? {})
    )

    if (getMergePinCount(nextOutsideMerge) > 1) {
      const addMergeTask = newTask([
        {
          in: false,
          action: makeAddMergeAction(outsideMergeId, nextOutsideMerge),
        },
      ])

      forEachPinOnMerge(unitOutsideMerge, (_, type, pinId) => {
        const exposePinTask = deepGet(targetExposePinSetTasks, [type, pinId])

        addDependency(addMergeTask, exposePinTask)
      })
    }
  }

  for (const unitId of components) {
    const unit = source.units[unitId]

    const nextUnitId = deepGetOrDefault(
      mapping,
      ['unit', unitId, 'in', 'unit', 'unitId'],
      unitId
    )

    const subComponent = getSubComponentSpec(source, unitId)
    const parentId = getSubComponentParentId(source, unitId)
    const parentSlot = getSubComponentParentSlotName(source, unitId)
    const parentIndex = getSubComponentParentIndex(source, unitId)

    let selectedParentId = parentId
    let nextParentSlot = parentSlot
    let nextParentIndex = parentIndex

    while (selectedParentId && !isUnitSelected(selectedParentId)) {
      const previousSelectedParent = selectedParentId

      selectedParentId = getSubComponentParentId(source, selectedParentId)

      const previousSelectedParentIndex = getSubComponentParentIndex(
        source,
        previousSelectedParent
      )

      nextParentSlot = 'default'
      nextParentIndex = previousSelectedParentIndex
    }

    let nextParentId =
      selectedParentId &&
      deepGetOrDefault(
        mapping,
        ['unit', selectedParentId, 'in', 'unit', 'unitId'],
        selectedParentId
      )

    const addUnitTask = targetAddUnitTasks[unitId]

    const addSubComponentTask = newTask()

    addDependency(addSubComponentTask, addUnitTask)

    const addMoveToParentTask = () => {
      const moveSubComponentTask = newTask([
        {
          in: true,
          action: makeMoveSubComponentRootAction(
            nextParentId,
            {},
            [nextUnitId],
            nextParentIndex,
            { [nextUnitId]: nextParentSlot },
            {}
          ),
        },
      ])

      deepSet_(mapping, ['unit', unitId, 'in', 'unit', 'component'], {
        parentId: nextParentId,
        parentIndex: nextParentIndex,
        parentSlot: nextParentSlot,
      })

      addDependency(moveSubComponentTask, addSubComponentTask)

      return moveSubComponentTask
    }

    if (nextParentId) {
      const moveSubComponentTask = addMoveToParentTask()

      const parentAddUnitTask = targetAddUnitTasks[parentId]

      addDependency(moveSubComponentTask, parentAddUnitTask)
    } else {
      if (reverse) {
        const graphParentId = getSubComponentParentId(target, graphId)
        const graphParentIndex = getSubComponentParentIndex(target, graphId)
        const graphParentSlot = getSubComponentParentSlotName(target, graphId)

        if (graphParentId) {
          nextParentId = graphParentId
          nextParentIndex = graphParentIndex + parentIndex
          nextParentSlot = graphParentSlot

          addMoveToParentTask()
        }
      } else {
        const defaultSlotSubComponentId = getDefaultSlotSubComponentId(target)

        if (defaultSlotSubComponentId) {
          nextParentId = defaultSlotSubComponentId
          nextParentIndex = parentIndex
          nextParentSlot = 'default'

          addMoveToParentTask()
        }
      }
    }

    if (subComponent) {
      const { metadata: { component = {} } = {} } = unit

      const width = subComponent.width ?? component.width
      const height = subComponent.height ?? component.height

      if (typeof width === 'number' && typeof height === 'number') {
        const setUnitSubComponentSizeTask = newTask([
          {
            in: true,
            action: makeSetSubComponentSizeAction(
              nextUnitId,
              width,
              height,
              200,
              200
            ),
          },
        ])

        addDependency(setUnitSubComponentSizeTask, addSubComponentTask)
      }
    }
  }

  const sourceSelectedPinPlugCountMap: IOOf<Dict<number>> = {}

  for (const { type, pinId } of selection.plug ?? []) {
    deepInc(sourceSelectedPinPlugCountMap, [type, pinId])
  }

  const sourceShouldCoverPinSet: IOOf<Dict<boolean>> = {}

  for (const { type, pinId } of selection.plug ?? []) {
    const plugCount = getPlugCount(source, type, pinId)
    const selectedCount = deepGetOrDefault(
      sourceSelectedPinPlugCountMap,
      [type, pinId],
      0
    )

    if (plugCount - selectedCount === 0) {
      deepSet_(sourceShouldCoverPinSet, [type, pinId], true)
    }
  }

  for (const mergeId of selection.merge ?? []) {
    const mergeSpec = getMerge(source, mergeId)

    const ref = isMergeRef(specs, source, mergeId)

    const insideCount = mergeInsideCount[mergeId]
    const outsideCount = mergeOutsideCount[mergeId]
    const selfCount = mergeSelfCount[mergeId] ?? { input: 0, output: 0 }

    const inside = mergeInside[mergeId]
    const outside = mergeOutside[mergeId]
    const self = mergeSelf[mergeId] ?? { input: {}, output: {} }

    const unplugPinTasks: IOOf<MoveTask> = { input: null, output: null }

    let pinOnlyNextMergeId: string = null
    let addPinOnlyMergeTask: MoveTask

    const outerPlugs = (deepGetOrDefault(
      sourceMergeToPlug,
      [mergeId],
      undefined
    ) as IOOf<GraphPlugOuterSpec>) ?? { input: null, output: null }

    const nodeId = getMergeNodeId(mergeId)

    const moveMergeTask = newTask()

    table[nodeId] = moveMergeTask.id

    let nextInsideMergeId: string
    let addMergeInsideTask: MoveTask

    const insideMergeSpec = deepMerge(
      inside?.['input'] ?? {},
      inside?.['output'] ?? {}
    )

    const nextMergeSpec = {}

    let shouldPreserveOutsideMerge =
      (outsideCount.input === 0 && outsideCount.output > 1) ||
      (outsideCount.output === 0 && outsideCount.input > 1)

    for (const unitId in insideMergeSpec) {
      const nextUnitId = mapping.unit?.[unitId]?.in?.unit.unitId ?? unitId

      const unitMerge = insideMergeSpec[unitId]

      nextMergeSpec[nextUnitId] = unitMerge
    }

    const totalInsideCount = insideCount['input'] + insideCount['output']

    const addPinOnlyMerge = (unitId: string, type: IO, pinId: string) => {
      pinOnlyNextMergeId = newTargetMergeId()

      const addUnitTask = targetAddUnitTasks[unitId]

      const nextUnitId = mapping.unit?.[unitId]?.in?.unit?.unitId ?? unitId

      addPinOnlyMergeTask = newTask([
        {
          in: true,
          action: makeAddMergeAction(pinOnlyNextMergeId, {
            [nextUnitId]: {
              [type]: {
                [pinId]: true,
              },
            },
          }),
        },
      ])

      addDependency(addPinOnlyMergeTask, moveMergeTask)
      addDependency(addPinOnlyMergeTask, addUnitTask)
    }

    if (reverse) {
      const plugsMap = findMergePlugs(source, mergeId)

      const outsideMergeId: IOOf<string> = { input: null, output: null }
      const exposePinIds: IOOf<string> = { input: null, output: null }
      const exposePinTasks: IOOf<MoveTask> = { input: null, output: null }

      io((type) => {
        if (!plugsMap[type] || !plugsMap[type].length) {
          let subPinSpec: GraphSubPinSpec = {}

          const mergePinCount = getMergePinCount(outside?.[type] ?? {})

          if (mergePinCount > 1) {
            outsideMergeId[type] = newSourceMergeId()

            const addOutsideMergeTask = newTask([
              {
                in: false,
                action: makeAddMergeAction(outsideMergeId[type], outside[type]),
              },
            ])

            addDependency(addOutsideMergeTask, removeOutsideMergeTask)

            subPinSpec = { mergeId: outsideMergeId[type] }
          } else if (mergePinCount === 1) {
            const { unitId, pinId } = getSingleMergePin(outside[type])

            subPinSpec = { unitId, pinId }
          }

          if (totalInsideCount === 0) {
            const nextPinId = 'a'

            const exposePinTask = newTask([
              {
                in: false,
                action: makeExposePinSetAction(type, nextPinId, {
                  plug: { '0': subPinSpec },
                  ref,
                }),
              },
            ])

            addDependency(exposePinTask, moveMergeTask)

            exposePinIds[type] = nextPinId
            exposePinTasks[type] = exposePinTask
          }
        } else {
          for (const plug of plugsMap[type]) {
            const insideMergeId = deepGetOrDefault(
              graphPinToMergeId,
              [plug.type, plug.pinId],
              undefined
            )

            const plugCount = getPlugCount(source, plug.type, plug.pinId)

            if (
              isPlugSelected(plug.type, plug.pinId, plug.subPinId) &&
              insideMergeId
            ) {
              const pinInsideMerge = getMerge(target, insideMergeId)

              const unplugPinTask = newTask([
                {
                  in: false,
                  action: makeUnplugPinAction(
                    plug.type,
                    plug.pinId,
                    plug.subPinId,
                    plug.subPinSpec
                  ),
                },
              ])

              addDependency(unplugPinTask, moveMergeTask)

              unplugPinTasks[plug.type] = unplugPinTask

              const pinInsideMerge_ = clone(pinInsideMerge)

              delete pinInsideMerge_[graphId]

              const removeInsideMergeTask = newTask([
                {
                  in: true,
                  action: makeRemoveMergeAction(insideMergeId, pinInsideMerge),
                },
              ])

              addDependency(removeInsideMergeTask, moveMergeTask)

              targetRemoveMergeTasks[insideMergeId] = removeInsideMergeTask

              forEachPinOnMerge(pinInsideMerge_, (unitId, type, pinId) => {
                deepSet_(nextMergeSpec, [unitId, type, pinId], true)
              })
            }
          }
        }
      })

      const mergeInside = deepMerge(inside?.input ?? {}, inside?.output ?? {})

      const removeOutsideMergeTask = newTask([
        {
          in: false,
          action: makeRemoveMergeAction(mergeId, mergeSpec),
        },
      ])

      addDependency(removeOutsideMergeTask, moveMergeTask)

      for (const unitId in mergeInside) {
        const removeUnitTask = sourceRemoveUnitTasks[unitId]

        addDependency(removeUnitTask, removeOutsideMergeTask)
      }

      io((type) => {
        const unplugPinTask = unplugPinTasks[type]

        if (unplugPinTask) {
          addDependency(removeOutsideMergeTask, unplugPinTask)
        }
      })

      sourceRemoveMergeTasks[mergeId] = removeOutsideMergeTask

      if (insideCount['input'] + insideCount['output'] === 0) {
        io((type) => {
          const nextPinId = exposePinIds[type]

          if (nextPinId) {
            deepSet_(nextMergeSpec, [graphId, type, nextPinId], true)
          }
        })
      }

      if (getMergePinCount(nextMergeSpec) > 1) {
        nextInsideMergeId = newTargetMergeId()

        deepSet_(mapping, ['merge', mergeId, 'in', 'merge'], {
          mergeId: nextInsideMergeId,
        })

        addMergeInsideTask = newTask([
          {
            in: true,
            action: makeAddMergeAction(nextInsideMergeId, nextMergeSpec),
          },
        ])

        addDependency(addMergeInsideTask, moveMergeTask)

        for (const unitId in insideMergeSpec) {
          const addUnitTask = targetAddUnitTasks[unitId]

          addDependency(addMergeInsideTask, addUnitTask)
        }

        io((type) => {
          const exposePinTask = exposePinTasks[type]

          if (exposePinTask) {
            addDependency(addMergeInsideTask, exposePinTask)
          }
        })
      }
    } else {
      if (shouldPreserveOutsideMerge) {
        //
      } else {
        const mergeInside = deepMerge(inside?.input ?? {}, inside?.output ?? {})

        const removeMergeTask = newTask([
          {
            in: false,
            action: makeRemoveMergeAction(mergeId, mergeSpec),
          },
        ])

        addDependency(removeMergeTask, moveMergeTask)

        for (const unitId in mergeInside) {
          const removeUnitTask = sourceRemoveUnitTasks[unitId]

          addDependency(removeUnitTask, removeMergeTask)
        }
      }

      let internalMergeSelfPinCount = 0

      io((type) => {
        const merge = self?.[type] ?? {}

        forEachPinOnMerge(merge, (_, type, pinId) => {
          const selfPinSpec = getPinSpec(target, type, pinId)

          const removeSelfPinTask = newTask([
            {
              in: true,
              action: makeCoverPinSetAction(type, pinId, selfPinSpec),
            },
          ])

          targetPinIdBlacklist[type].delete(pinId)

          addDependency(removeSelfPinTask, moveMergeTask)

          const { plug = {} } = selfPinSpec

          for (const subPinId in plug) {
            const subPinSpec = plug[subPinId]

            if (subPinSpec.unitId) {
              deepSet_(
                nextMergeSpec,
                [subPinSpec.unitId, subPinSpec.kind ?? type, subPinSpec.pinId],
                true
              )

              internalMergeSelfPinCount++
            } else if (subPinSpec.mergeId) {
              const mergeSpec = getMerge(target, subPinSpec.mergeId)

              const removeSelfInternalMergeTask = newTask([
                {
                  in: true,
                  action: makeRemoveMergeAction(subPinSpec.mergeId, mergeSpec),
                },
              ])

              addDependency(removeSelfInternalMergeTask, removeSelfPinTask)

              forEachPinOnMerge(mergeSpec, (unitId, type, pinId) => {
                deepSet_(nextMergeSpec, [unitId, type, pinId], true)

                internalMergeSelfPinCount++
              })
            }
          }
        })
      })

      const mergeExposePinTasks: IOOf<MoveTask> = { input: null, output: null }

      const nextMergePinId: IOOf<string> = { input: null, output: null }

      const total = totalInsideCount + internalMergeSelfPinCount

      if (
        (total === 0 && outsideCount.input > 0 && outsideCount.output > 0) ||
        total > 1
      ) {
        nextInsideMergeId = newTargetMergeId()

        deepSet_(mapping, ['merge', mergeId, 'in', 'merge'], {
          mergeId: nextInsideMergeId,
        })

        addMergeInsideTask = newTask([
          {
            in: true,
            action: makeAddMergeAction(nextInsideMergeId, nextMergeSpec),
          },
        ])

        addDependency(addMergeInsideTask, moveMergeTask)

        for (const unitId in insideMergeSpec) {
          const addUnitTask = targetAddUnitTasks[unitId]

          addDependency(addMergeInsideTask, addUnitTask)
        }
      }

      const processMergeOutside = (type_: IO) => {
        const oppositeType = opposite(type_)

        const plug = deepGetOrDefault(
          sourceMergeToPlug,
          [mergeId, type_],
          undefined
        )

        if (outsideCount[type_] > 0) {
          const fallbackNextPin = getSingleMergePin(outside[type_])

          const nextPinIdStart = plug?.pinId ?? fallbackNextPin.pinId

          const nextPinId = newTargetPinId(oppositeType, nextPinIdStart)
          const nextPinType = oppositeType
          const nextSubPinId = '0'

          const mergeExposePinTask = newTask([
            {
              in: true,
              action: makeExposePinSetAction(nextPinType, nextPinId, {
                plug: {
                  [nextSubPinId]: {},
                },
                ref,
              }),
            },
          ])

          let datum: string

          forEachPinOnMerge(outside[type_], (unitId, type, pinId) => {
            if (!datum) {
              datum = deepGetOrDefault(
                data,
                ['pin', unitId, type, pinId],
                undefined
              )

              if (datum) {
                mergeExposePinTask.moves.push({
                  in: false,
                  action: makeSetUnitPinDataAction(
                    graphId,
                    nextPinType,
                    nextPinId,
                    datum
                  ),
                })
              }
            }
          })

          nextMergePinId[type_] = nextPinId

          mergeExposePinTasks[type_] = mergeExposePinTask

          addDependency(mergeExposePinTask, moveMergeTask)

          if (
            insideCount[oppositeType] > 1 ||
            totalInsideCount === 0 ||
            totalInsideCount > 1
          ) {
            deepSet_(mapping, ['merge', mergeId, 'in', 'plug', nextPinType], {
              pinId: nextPinId,
              type: oppositeType,
              subPinId: nextSubPinId,
            })

            if (addMergeInsideTask) {
              const mergePlugTask = newTask([
                {
                  in: true,
                  action: makePlugPinAction(
                    nextPinType,
                    nextPinId,
                    nextSubPinId,
                    {
                      mergeId: nextInsideMergeId,
                    }
                  ),
                },
              ])

              addDependency(mergePlugTask, mergeExposePinTask)
              addDependency(mergePlugTask, addMergeInsideTask)
            }
          } else if (insideCount[oppositeType] === 1) {
            const { unitId, type, pinId } = getSingleMergePin(
              inside[oppositeType]
            )

            deepSet_(mapping, ['unit', unitId, 'in', 'plug', type, pinId], {
              pinId: nextPinId,
              type: nextPinType,
              subPinId: nextSubPinId,
            })

            const nextUnitId =
              mapping.unit?.[unitId]?.in?.unit?.unitId ?? unitId

            let nextSubPinSpec: GraphSubPinSpec = {
              unitId: nextUnitId,
              pinId: pinId,
              kind: type,
            }

            if (outsideCount[oppositeType] > 0) {
              if (!pinOnlyNextMergeId) {
                addPinOnlyMerge(unitId, type, pinId)
              }

              nextSubPinSpec = {
                mergeId: pinOnlyNextMergeId,
              }
            }

            const addUnitTask = targetAddUnitTasks[unitId]

            const mergePlugTask = newTask([
              {
                in: true,
                action: makePlugPinAction(
                  nextPinType,
                  nextPinId,
                  nextSubPinId,
                  nextSubPinSpec
                ),
              },
            ])

            addDependency(mergePlugTask, mergeExposePinTask)
            addDependency(mergePlugTask, addUnitTask)

            if (addPinOnlyMergeTask) {
              addDependency(mergePlugTask, addPinOnlyMergeTask)
            }
          } else if (insideCount[type_] === 1) {
            const { unitId, type, pinId } = getSingleMergePin(inside[type_])

            const nextUnitId =
              mapping.unit?.[unitId]?.in?.unit?.unitId ?? unitId

            const addUnitTask = targetAddUnitTasks[unitId]

            let nextSubPinSpec: GraphSubPinSpec = {
              unitId: nextUnitId,
              pinId: pinId,
              kind: type,
            }

            if (outsideCount[oppositeType] > 0) {
              if (!pinOnlyNextMergeId) {
                addPinOnlyMerge(unitId, type, pinId)
              }

              nextSubPinSpec = {
                mergeId: pinOnlyNextMergeId,
              }
            }

            const mergePlugTask = newTask([
              {
                in: true,
                action: makePlugPinAction(
                  oppositeType,
                  nextPinId,
                  nextSubPinId,
                  nextSubPinSpec
                ),
              },
            ])

            addDependency(mergePlugTask, mergeExposePinTask)
            addDependency(mergePlugTask, addUnitTask)

            if (addPinOnlyMergeTask) {
              addDependency(mergePlugTask, addPinOnlyMergeTask)
            }
          }

          if (shouldPreserveOutsideMerge) {
            const addPinToMergeOutside = newTask([
              {
                in: false,
                action: makeAddPinToMergeAction(
                  mergeId,
                  graphId,
                  oppositeType,
                  nextPinId
                ),
              },
            ])

            addDependency(addPinToMergeOutside, mergeExposePinTask)
          } else {
            const nextOutsideMergeId = newSourceMergeId()

            deepSet_(
              mapping,
              ['merge', mergeId, 'out', 'merge', oppositeType],
              {
                mergeId: nextOutsideMergeId,
              }
            )

            const addOutsideMergeTask = newTask([
              {
                in: false,
                action: makeAddMergeAction(
                  nextOutsideMergeId,
                  deepMerge(
                    {
                      [graphId]: {
                        [oppositeType]: {
                          [nextPinId]: true,
                        },
                      },
                    },
                    outside[type_]
                  )
                ),
              },
            ])

            addDependency(addOutsideMergeTask, moveMergeTask)
          }
        }

        if (plug) {
          if (isPlugSelected(plug.type, plug.pinId, plug.subPinId)) {
            const shouldCoverPinSet = deepGetOrDefault(
              sourceShouldCoverPinSet,
              [plug.type, plug.pinId],
              true
            )

            if (shouldCoverPinSet) {
              const sourceCoverPinSetTask = newTask([
                {
                  in: false,
                  action: makeCoverPinSetAction(
                    plug.type,
                    plug.pinId,
                    plug.pinSpec
                  ),
                },
              ])

              addDependency(sourceCoverPinSetTask, moveMergeTask)

              deepSet_(
                sourceCoverPinSetTasks,
                [plug.type, plug.pinId],
                sourceCoverPinSetTask
              )
            } else {
              if (
                !deepGetOrDefault(
                  sourceCoverPinTasks,
                  [plug.type, plug.pinId, plug.subPinId],
                  undefined
                )
              ) {
                const sourceCoverPinTask = newTask([
                  {
                    in: false,
                    action: makeCoverPinAction(
                      plug.type,
                      plug.pinId,
                      plug.subPinId,
                      plug.subPinSpec
                    ),
                  },
                ])

                addDependency(sourceCoverPinTask, moveMergeTask)

                deepSet_(
                  sourceCoverPinTasks,
                  [plug.type, plug.pinId, plug.subPinId],
                  sourceCoverPinTask
                )
              }
            }
          } else {
            const unselectedPlugOutsideUnplugTask = newTask([
              {
                in: false,
                action: makeUnplugPinAction(
                  plug.type,
                  plug.pinId,
                  plug.subPinId,
                  { mergeId }
                ),
              },
            ])

            addDependency(unselectedPlugOutsideUnplugTask, moveMergeTask)

            if (!targetExposePinSetTasks[plug.type]?.[plug.pinId]) {
              nextInsideMergeId = nextInsideMergeId ?? newTargetMergeId()

              if (!addMergeInsideTask) {
                addMergeInsideTask = newTask([
                  {
                    in: true,
                    action: makeAddMergeAction(nextInsideMergeId, {}),
                  },
                ])

                addDependency(addMergeInsideTask, moveMergeTask)
              }

              const unselectedPlugOutsideNextPinId = newTargetPinId(
                plug.type,
                plug.pinId
              )

              const unselectedPlugOutsideNextSubPinId = '0'

              const unselectedPlugOutsideExposePinTask = newTask([
                {
                  in: true,
                  action: makeExposePinSetAction(
                    plug.type,
                    unselectedPlugOutsideNextPinId,
                    {
                      plug: {
                        [unselectedPlugOutsideNextSubPinId]: {
                          mergeId: nextInsideMergeId,
                        },
                      },
                      ref,
                    }
                  ),
                },
              ])

              addDependency(
                unselectedPlugOutsideExposePinTask,
                addMergeInsideTask
              )

              deepSet_(
                targetExposePinSetTasks,
                [plug.type, plug.pinId],
                unselectedPlugOutsideExposePinTask
              )

              addDependency(
                unselectedPlugOutsideExposePinTask,
                unselectedPlugOutsideUnplugTask
              )

              const unselectedPlugOutsidePlugTask = newTask([
                {
                  in: false,
                  action: makePlugPinAction(
                    plug.type,
                    plug.pinId,
                    plug.subPinId,
                    { unitId: graphId, pinId: unselectedPlugOutsideNextPinId }
                  ),
                },
              ])

              addDependency(
                unselectedPlugOutsidePlugTask,
                unselectedPlugOutsideExposePinTask
              )

              const datum: string = deepGetOrDefault(
                data,
                ['plug', plug.type, plug.pinId, plug.subPinId],
                undefined
              )

              if (datum) {
                const unselectedPlugOutsideSetPinDataTask = newTask([
                  {
                    in: false,
                    action: makeSetUnitPinDataAction(
                      graphId,
                      plug.type,
                      unselectedPlugOutsideNextPinId,
                      datum
                    ),
                  },
                ])

                addDependency(
                  unselectedPlugOutsideSetPinDataTask,
                  unselectedPlugOutsidePlugTask
                )
              }
            }
          }
        }
      }

      processMergeOutside('output')
      processMergeOutside('input')

      if (
        getMergePinCount(mergeSpec) === 0 &&
        outerPlugs.input &&
        outerPlugs.output
      ) {
        io((type) => {
          const plug = outerPlugs[type]

          const nextPinType = type
          const nextPinId = newTargetPinId(type, plug.pinId)
          const nextSubPinId = '0'

          deepSet_(mapping, ['merge', mergeId, 'in', 'plug', type], {
            pinId: nextPinId,
            type: nextPinType,
            subPinId: nextSubPinId,
          })

          if (!targetExposePinSetTasks[nextPinType][plug.pinId]) {
            nextMergePinId[type] = nextPinId

            const mergeExposePinTask = newTask([
              {
                in: true,
                action: makeExposePinSetAction(nextPinType, nextPinId, {
                  plug: {
                    [nextSubPinId]: {
                      mergeId: nextInsideMergeId,
                    },
                  },
                  ref,
                }),
              },
              {
                in: false,
                action: makePlugPinAction(type, plug.pinId, plug.subPinId, {
                  unitId: graphId,
                  kind: nextPinType,
                  pinId: nextPinId,
                }),
              },
            ])

            mergeExposePinTasks[type] = mergeExposePinTask

            const datum: string = deepGetOrDefault(
              data,
              ['plug', type, plug.pinId, plug.subPinId],
              undefined
            )

            if (datum) {
              mergeExposePinTask.moves.push({
                in: false,
                action: makeSetUnitPinDataAction(
                  graphId,
                  nextPinType,
                  nextPinId,
                  datum
                ),
              })
            }

            addDependency(mergeExposePinTask, moveMergeTask)

            deepSet_(
              targetExposePinSetTasks,
              [plug.type, plug.pinId],
              mergeExposePinTask
            )
          }
        })
      }

      io((type) => {
        const plug = outerPlugs[type]

        const pin = deepGetOrDefault(
          mapping,
          ['merge', mergeId, 'out', 'plug', type],
          undefined
        ) as GraphPlugOuterSpec

        if (pin) {
          const mergeOutsidePlugTask = newTask([
            {
              in: true,
              action: makePlugPinAction(plug.type, plug.pinId, plug.subPinId, {
                unitId: graphId,
                kind: pin.type,
                pinId: pin.pinId,
              }),
            },
          ])

          addDependency(mergeOutsidePlugTask, moveMergeTask)
        }
      })
    }
  }

  for (const { unitId, type, pinId } of selection.link ?? []) {
    const nodeId = getPinNodeId(unitId, type, pinId)

    const moveLinkTask = newTask()

    table[nodeId] = moveLinkTask.id

    if (unitSelectionSet.has(unitId)) {
      continue
    }

    if (unitId === graphId) {
      const pinSpec = getPinSpec(target, type, pinId)

      moveLinkTask.moves.push({
        in: true,
        action: makeCoverPinSetAction(type, pinId, pinSpec),
      })

      const { plug = {} } = pinSpec

      const nextInternalMerge = {}

      let nextMergePinCount: number = 0

      for (const subPinId in plug) {
        const subPinSpec = plug[subPinId]

        if (subPinSpec.unitId) {
          deepSet_(
            nextInternalMerge,
            [subPinSpec.unitId, subPinSpec.kind ?? type, subPinSpec.pinId],
            true
          )

          nextMergePinCount++
        } else if (subPinSpec.mergeId) {
          const mergeSpec = getMerge(target, subPinSpec.mergeId)

          moveLinkTask.moves.push({
            in: true,
            action: makeRemoveMergeAction(subPinSpec.mergeId, mergeSpec),
          })

          forEachPinOnMerge(mergeSpec, (unitId, type, pinId) => {
            deepSet_(nextInternalMerge, [unitId, type, pinId], true)

            nextMergePinCount++
          })
        }

        if (nextMergePinCount > 1) {
          const nextInternalMergeId: string = newTargetMergeId()

          moveLinkTask.moves.push({
            in: true,
            action: makeAddMergeAction(nextInternalMergeId, nextInternalMerge),
          })
        }
      }
    } else {
      const oppositeType = opposite(type)

      const plugs = deepGetOrDefault(
        sourcePinToPlugs,
        [unitId, type, pinId],
        []
      ) as GraphPlugOuterSpec[]

      const nextPinIdStart = plugs?.[0]?.pinId ?? pinId

      const nextPinId = newTargetPinId(oppositeType, nextPinIdStart)
      const nextSubPinId = '0'

      deepSet_(
        mapping,
        ['link', unitId, type, pinId, 'in', 'plug', oppositeType],
        {
          pinId: nextPinId,
          type: oppositeType,
          subPinId: nextSubPinId,
        }
      )

      const selectedPlugs = plugs.filter((plug) =>
        isPlugSelected(plug.type, plug.pinId, plug.subPinId)
      )

      forEach(selectedPlugs, (plug) => {
        moveLinkTask.moves.push({
          in: false,
          action: makeCoverPinOrSetAction(
            source,
            plug.type,
            plug.pinId,
            plug.subPinId
          ),
        })
      })

      const ref = isUnitPinRef(specs, source, unitId, type, pinId)

      moveLinkTask.moves.push({
        in: true,
        action: makeExposePinSetAction(oppositeType, nextPinId, {
          plug: {
            [nextSubPinId]: {},
          },
          ref,
        }),
      })

      const datum = deepGetOrDefault(
        data,
        ['pin', unitId, type, pinId],
        undefined
      )

      if (datum) {
        moveLinkTask.moves.push({
          in: false,
          action: makeSetUnitPinDataAction(
            graphId,
            oppositeType,
            nextPinId,
            datum
          ),
        })
      }

      const nextMergeId = newSourceMergeId()

      deepSet_(
        mapping,
        ['link', unitId, type, pinId, 'out', 'merge', oppositeType],
        {
          mergeId: nextMergeId,
        }
      )

      moveLinkTask.moves.push({
        in: false,
        action: makeAddMergeAction(nextMergeId, {
          [graphId]: {
            [oppositeType]: {
              [nextPinId]: true,
            },
          },
          [unitId]: {
            [type]: {
              [pinId]: true,
            },
          },
        }),
      })
    }
  }

  const outsidePlugMatched: IOOf<Dict<boolean>> = {}

  for (const { type, pinId, subPinId, template } of selection.plug ?? []) {
    const subPinSpec = getSubPinSpec(source, type, pinId, subPinId)

    const selectedCount = deepGetOrDefault(
      sourceSelectedPinPlugCountMap,
      [type, pinId],
      0
    )

    const nodeId = getExtNodeId(type, pinId, subPinId)

    const movePlugTask = newTask()

    table[nodeId] = movePlugTask.id

    if (!reverse) {
      if (subPinSpec.unitId) {
        const unit_selected = isUnitSelected(subPinSpec.unitId)
        const link_selected = isLinkSelected(
          subPinSpec.unitId,
          subPinSpec.kind ?? type,
          subPinSpec.pinId
        )

        if (unit_selected !== link_selected) {
          continue
        }
      } else if (subPinSpec.mergeId) {
        //
      }
    }

    const ref = isPinRef(specs, source, type, pinId)

    const oppositeType = opposite(type)

    if (template) {
      const nextPinId = newTargetPinId(type, pinId)
      const nextSubPinId = newTargetSubPinId(type, pinId)

      deepSet_(mapping, ['plug', type, pinId, subPinId, 'in', 'plug', type], {
        pinId: nextPinId,
        type,
        subPinId: nextSubPinId,
      })

      movePlugTask.moves.push({
        in: true,
        action: makeExposePinSetAction(type, nextPinId, {
          plug: {
            [nextSubPinId]: {},
          },
          ref,
        }),
      })

      movePlugTask.moves.push({
        in: false,
        action: makePlugPinAction(type, pinId, subPinId, {
          unitId: graphId,
          kind: type,
          pinId: nextPinId,
        }),
      })

      const datum = deepGetOrDefault(
        data,
        ['plug', type, pinId, subPinId],
        undefined
      )

      if (datum) {
        movePlugTask.moves.push({
          in: false,
          action: makeSetUnitPinDataAction(graphId, type, nextPinId, datum),
        })
      }
    } else {
      if (reverse) {
        const insideMergeId = deepGetOrDefault(
          graphPinToMergeId,
          [type, pinId],
          undefined
        )

        const plugCount = getPlugCount(source, type, pinId)
        const selectedPlugCount = deepGetOrDefault(
          sourceSelectedPinPlugCountMap,
          [type, pinId],
          0
        )

        const shouldCoverPinSet = plugCount === selectedPlugCount

        let unplugSubPinTask: MoveTask

        if (
          (subPinSpec.unitId && !isUnitSelected(subPinSpec.unitId)) ||
          (subPinSpec.mergeId && !isMergeSelected(subPinSpec.mergeId))
        ) {
          unplugSubPinTask = newTask([
            {
              in: false,
              action: makeUnplugPinAction(type, pinId, subPinId, subPinSpec),
            },
          ])

          addDependency(unplugSubPinTask, movePlugTask)
        }

        let coverPlugTask = deepGetOrDefault(
          sourceCoverPinTasks,
          [type, pinId, subPinId],
          undefined
        )

        if (!coverPlugTask) {
          coverPlugTask = newTask([
            {
              in: false,
              action: makeCoverPinAction(type, pinId, subPinId, {}),
            },
          ])

          addDependency(coverPlugTask, movePlugTask)

          if (unplugSubPinTask) {
            addDependency(coverPlugTask, unplugSubPinTask)
          }

          deepSet_(sourceCoverPinTasks, [type, pinId, subPinId], coverPlugTask)
        }

        if (shouldCoverPinSet) {
          let coverPinSetTask = deepGetOrDefault(
            sourceCoverPinSetTasks,
            [type, pinId],
            undefined
          )

          if (!coverPinSetTask) {
            let removeOutsidePinFromMergeTask: MoveTask = deepGetOrDefault(
              targetRemovePinFromMergeTasks,
              [insideMergeId, graphId, type, pinId],
              undefined
            )

            if (insideMergeId) {
              const insideMerge = getMerge(target, insideMergeId)

              const insideMerge_ = clone(insideMerge)

              delete insideMerge_[graphId]

              if (!targetRemoveMergeTasks[insideMergeId]) {
                if (!removeOutsidePinFromMergeTask) {
                  removeOutsidePinFromMergeTask = newTask([
                    {
                      in: true,
                      action: makeRemovePinFromMergeAction(
                        insideMergeId,
                        graphId,
                        type,
                        pinId
                      ),
                    },
                  ])
                }

                addDependency(removeOutsidePinFromMergeTask, coverPlugTask)

                deepSet_(
                  targetRemovePinFromMergeTasks,
                  [insideMergeId, graphId, type, pinId],
                  removeOutsidePinFromMergeTask
                )
              }
            }

            coverPinSetTask = newTask([
              {
                in: false,
                action: makeCoverPinSetAction(type, pinId, { plug: {} }),
              },
            ])

            if (removeOutsidePinFromMergeTask) {
              addDependency(coverPinSetTask, removeOutsidePinFromMergeTask)
            }

            deepSet_(sourceCoverPinSetTasks, [type, pinId], coverPinSetTask)
          }

          addDependency(coverPinSetTask, coverPlugTask)
        }

        if (insideMergeId) {
          const insideMerge = getMerge(target, insideMergeId)

          const insideMerge_ = clone(insideMerge)

          delete insideMerge_[graphId]

          let nextInsideMergeId: string

          if (subPinSpec.mergeId && isMergeSelected(subPinSpec.mergeId)) {
            const subPinMerge = getMerge(source, subPinSpec.mergeId)

            if (getMergePinCount(subPinMerge) > 1) {
              nextInsideMergeId = deepGetOrDefault(
                mapping,
                ['merge', subPinSpec.mergeId, 'in', 'merge', 'mergeId'],
                undefined
              )
            }
          }

          if (nextInsideMergeId) {
            const nextSubPinId = newTargetSubPinId(type, pinId)

            const exposePinOutsideTask = newTask([
              {
                in: true,
                action: makeExposePinAction(oppositeType, pinId, nextSubPinId, {
                  mergeId: nextInsideMergeId,
                }),
              },
            ])

            deepSet_(
              mapping,
              ['plug', type, pinId, subPinId, 'in', 'plug', type],
              {
                type: oppositeType,
                pinId,
                subPinId: nextSubPinId,
              }
            )

            addDependency(exposePinOutsideTask, coverPlugTask)
          } else {
            if (getMergePinCount(insideMerge_) > 1) {
              if (shouldCoverPinSet) {
                if (subPinSpec.unitId) {
                  const nextUnitId =
                    mapping.unit?.[subPinSpec.unitId]?.in?.unit?.unitId ??
                    subPinSpec.unitId

                  deepSet_(
                    mapping,
                    ['plug', type, pinId, subPinId, 'in', 'merge', 'mergeId'],
                    insideMergeId
                  )

                  deepSet_(
                    mapping,
                    [
                      'link',
                      subPinSpec.unitId,
                      subPinSpec.kind ?? type,
                      subPinSpec.pinId,
                      'in',
                      'merge',
                      'mergeId',
                    ],
                    insideMergeId
                  )

                  const addPinToMergeAction = newTask([
                    {
                      in: true,
                      action: makeAddPinToMergeAction(
                        insideMergeId,
                        nextUnitId,
                        subPinSpec.kind ?? type,
                        subPinSpec.pinId
                      ),
                    },
                  ])

                  const addUnitTask = targetAddUnitTasks[subPinSpec.unitId]

                  addDependency(addPinToMergeAction, addUnitTask)
                } else {
                  if (
                    !subPinSpec.mergeId ||
                    getMergePinCount(getMerge(source, subPinSpec.mergeId)) > 0
                  ) {
                    const nextSubPinId = newTargetSubPinId(type, pinId)

                    const exposePinOutsideTask = newTask([
                      {
                        in: true,
                        action: makeExposePinAction(
                          oppositeType,
                          pinId,
                          nextSubPinId,
                          {
                            mergeId: insideMergeId,
                          }
                        ),
                      },
                    ])

                    deepSet_(
                      mapping,
                      ['plug', type, pinId, subPinId, 'in', 'plug', type],
                      {
                        type: oppositeType,
                        pinId,
                        subPinId: nextSubPinId,
                      }
                    )

                    addDependency(exposePinOutsideTask, movePlugTask)
                  }
                }
              }
            } else {
              let removeInsideMergeTask = targetRemoveMergeTasks[insideMergeId]

              if (!removeInsideMergeTask) {
                removeInsideMergeTask = newTask([
                  {
                    in: true,
                    action: makeRemoveMergeAction(insideMergeId, insideMerge),
                  },
                ])

                addDependency(removeInsideMergeTask, coverPlugTask)

                targetRemoveMergeTasks[insideMergeId] = removeInsideMergeTask
              }

              if (subPinSpec.unitId) {
                const nextUnitId =
                  mapping.unit?.[subPinSpec.unitId]?.in?.unit.unitId ??
                  subPinSpec.unitId

                targetNextMergeSourceUnitIds[insideMergeId] =
                  targetNextMergeSourceUnitIds[insideMergeId] ?? []
                targetNextMergeSourceUnitIds[insideMergeId].push(
                  subPinSpec.unitId
                )

                let collapsedInsideMergeId = deepGetOrDefault(
                  targetPinNextMerges,
                  [nextUnitId, subPinSpec.kind ?? type, subPinSpec.pinId],
                  undefined
                )

                if (collapsedInsideMergeId) {
                  //
                } else {
                  deepSet_(
                    targetNextMerges,
                    [
                      insideMergeId,
                      nextUnitId,
                      subPinSpec.kind ?? type,
                      subPinSpec.pinId,
                    ],
                    true
                  )

                  deepSet_(
                    targetPinNextMerges,
                    [nextUnitId, subPinSpec.kind ?? type, subPinSpec.pinId],
                    insideMergeId
                  )

                  collapsedInsideMergeId = insideMergeId
                }

                deepSet_(
                  mapping,
                  ['plug', type, pinId, subPinId, 'in', 'merge', 'mergeId'],
                  collapsedInsideMergeId
                )

                const targetRemoveMergeTask =
                  targetRemoveMergeTasks[insideMergeId]

                forEachPinOnMerge(
                  targetRemovePinFromMergeTasks[insideMergeId] ?? {},
                  (_, __, ___, targetRemovePinFromMergeTask) => {
                    deepPush(
                      targetPinNextRemoveTasks,
                      [collapsedInsideMergeId],
                      targetRemovePinFromMergeTask
                    )
                  }
                )

                deepPush(
                  targetPinNextRemoveTasks,
                  [collapsedInsideMergeId],
                  targetRemoveMergeTask
                )

                const originalInsideMerge = clone(
                  getMerge(target, insideMergeId)
                )

                forIOObjKV(sourceCoverPinSetTasks, (type, pinId) => {
                  deepDestroy(originalInsideMerge, [graphId, type, pinId])
                })

                forEachPinOnMerge(
                  originalInsideMerge,
                  (unitId, type, pinId) => {
                    deepSet_(
                      targetNextMerges,
                      [collapsedInsideMergeId, unitId, type, pinId],
                      true
                    )
                  }
                )
              } else {
                const pin = getSingleMergePin(insideMerge_)

                if (pin.pinId === pinId) {
                  deepSet_(
                    mapping,
                    ['plug', type, pinId, subPinId, 'in', 'link'],
                    pin
                  )
                } else {
                  const nextSubPinId = newTargetSubPinId(oppositeType, pinId)

                  let targetExposePinTask = deepGetOrDefault(
                    targetExposePinTasks,
                    [oppositeType, pinId, nextSubPinId],
                    undefined
                  )

                  if (!targetExposePinTask) {
                    targetExposePinTask = newTask([
                      {
                        in: true,
                        action: makeExposePinAction(
                          oppositeType,
                          pinId,
                          nextSubPinId,
                          {
                            unitId: pin.unitId,
                            kind: pin.type,
                            pinId: pin.pinId,
                          }
                        ),
                      },
                    ])

                    deepSet_(
                      targetExposePinTasks,
                      [oppositeType, pinId, nextSubPinId],
                      targetExposePinTask
                    )
                  }

                  const data_ = reverse
                    ? deepGetOrDefault(
                        data,
                        ['plug', type, pinId, subPinId],
                        undefined
                      )
                    : deepGetOrDefault(
                        data,
                        ['pin', pin.unitId, pin.type, pin.pinId],
                        undefined
                      )

                  if (data_ !== undefined) {
                    const setPinOutsideDataTask = newTask([
                      {
                        in: true,
                        action: makeSetPlugDataAction(
                          oppositeType,
                          pinId,
                          nextSubPinId,
                          data_,
                          undefined
                        ),
                      },
                    ])

                    addDependency(setPinOutsideDataTask, targetExposePinTask)
                  }

                  deepSet_(
                    mapping,
                    ['plug', type, pinId, subPinId, 'in', 'plug', type],
                    {
                      type: oppositeType,
                      pinId,
                      subPinId: nextSubPinId,
                    }
                  )

                  addDependency(targetExposePinTask, removeInsideMergeTask)
                }
              }
            }
          }
        }

        if (insideMergeId) {
          continue
        }
      } else {
        let coverPinSetTask = deepGetOrDefault(
          sourceCoverPinSetTasks,
          [type, pinId],
          undefined
        )

        if (subPinSpec.unitId || subPinSpec.mergeId) {
          if (!subPinSpec.unitId || !isUnitSelected(subPinSpec.unitId)) {
            const sourceUnplugPinTask = newTask([
              {
                in: false,
                action: makeUnplugPinAction(type, pinId, subPinId, subPinSpec),
              },
            ])

            addDependency(sourceUnplugPinTask, movePlugTask)
          }
        }

        const shouldCover = deepGetOrDefault(
          sourceShouldCoverPinSet,
          [type, pinId],
          false
        )

        let sourceCoverPinTask = deepGetOrDefault(
          sourceCoverPinTasks,
          [type, pinId, subPinId],
          undefined
        )

        if (!sourceCoverPinTask) {
          sourceCoverPinTask = newTask([
            {
              in: false,
              action: makeCoverPinAction(type, pinId, subPinId, {}),
            },
          ])

          deepSet_(
            sourceCoverPinTasks,
            [type, pinId, subPinId],
            sourceCoverPinTask
          )

          addDependency(sourceCoverPinTask, movePlugTask)

          deepSet_(
            sourceCoverPinTasks,
            [type, pinId, subPinId],
            sourceCoverPinTask
          )
        }

        if (shouldCover) {
          if (!coverPinSetTask) {
            coverPinSetTask = newTask([
              {
                in: false,
                action: makeCoverPinSetAction(type, pinId, {
                  plug: {},
                }),
              },
            ])

            deepSet_(sourceCoverPinSetTasks, [type, pinId], coverPinSetTask)

            addDependency(coverPinSetTask, movePlugTask)
          }

          addDependency(coverPinSetTask, sourceCoverPinTask)
        }
      }

      if (subPinSpec.unitId && subPinSpec.pinId) {
        if (reverse) {
          const nextPinType = type
          const nextPinId = pinId

          const nextUnitId =
            mapping.unit?.[subPinSpec.unitId]?.in?.unit.unitId ??
            subPinSpec.unitId

          const graphPinOutsidePlugs = deepGetOrDefault(
            graphPlugMap,
            [type, pinId],
            undefined
          ) as GraphPlugOuterSpec[]

          if (pinId === subPinSpec.pinId && selectedCount === 1) {
            deepSet_(
              mapping,
              [
                'link',
                subPinSpec.unitId,
                subPinSpec.kind ?? type,
                subPinSpec.pinId,
                'in',
                'link',
                'template',
              ],
              true
            )
          } else {
            const nextSubPinId = newTargetSubPinId(nextPinType, nextPinId)

            let exposePinSetTask = deepGetOrDefault(
              targetExposePinSetTasks,
              [nextPinType, nextPinId],
              undefined
            )

            const data_ = deepGetOrDefault(
              data,
              ['plug', type, pinId, subPinId],
              undefined
            )

            if (!exposePinSetTask) {
              if (!hasPin(target, nextPinType, nextPinId)) {
                exposePinSetTask = newTask([
                  {
                    in: true,
                    action: makeExposePinSetAction(nextPinType, nextPinId, {
                      plug: {},
                      ref,
                    }),
                  },
                ])

                deepSet_(
                  targetExposePinSetTasks,
                  [nextPinType, nextPinId],
                  exposePinSetTask
                )

                addDependency(exposePinSetTask, movePlugTask)
              }
            }

            let targetExposePinTask = deepGetOrDefault(
              targetExposePinSetTasks,
              [nextPinType, nextPinId, nextSubPinId],
              undefined
            )

            if (!targetExposePinTask) {
              targetExposePinTask = newTask([
                {
                  in: true,
                  action: makeExposePinAction(
                    nextPinType,
                    nextPinId,
                    nextSubPinId,
                    {}
                  ),
                },
              ])

              deepSet_(
                targetExposePinTasks,
                [nextPinType, nextPinId, nextSubPinId],
                targetExposePinTask
              )
            }

            addDependency(targetExposePinTask, movePlugTask)

            if (exposePinSetTask) {
              addDependency(targetExposePinTask, exposePinSetTask)
            }

            deepSet_(
              mapping,
              ['plug', type, pinId, subPinId, 'in', 'plug', type],
              {
                pinId: nextPinId,
                type: nextPinType,
                subPinId: nextSubPinId,
              }
            )

            if (data_) {
              const setPlugDataTask = newTask([
                {
                  in: true,
                  action: makeSetPlugDataAction(
                    nextPinType,
                    nextPinId,
                    nextSubPinId,
                    data_,
                    undefined
                  ),
                },
              ])

              addDependency(setPlugDataTask, targetExposePinTask)
            }

            if (isUnitSelected(subPinSpec.unitId)) {
              const plugPinToUnitTask = newTask([
                {
                  in: true,
                  action: makePlugPinAction(
                    nextPinType,
                    nextPinId,
                    nextSubPinId,
                    {
                      unitId: nextUnitId,
                      pinId: subPinSpec.pinId,
                      kind: subPinSpec.kind ?? type,
                    }
                  ),
                },
              ])

              const addUnitTask = targetAddUnitTasks[subPinSpec.unitId]

              addDependency(plugPinToUnitTask, targetExposePinTask)
              addDependency(plugPinToUnitTask, addUnitTask)
            }
          }

          if (graphPinOutsidePlugs) {
            let unplugOutsidePinsTask = deepGetOrDefault(
              targetUnplugFromGraphPinTasks,
              [type, pinId],
              undefined
            )

            if (!unplugOutsidePinsTask) {
              unplugOutsidePinsTask = newTask()

              for (const graphPinOutsidePlug of graphPinOutsidePlugs) {
                unplugOutsidePinsTask.moves.push({
                  in: true,
                  action: makeUnplugPinAction(
                    graphPinOutsidePlug.type,
                    graphPinOutsidePlug.pinId,
                    graphPinOutsidePlug.subPinId,
                    graphPinOutsidePlug.subPinSpec
                  ),
                })
              }

              deepSet_(
                targetUnplugFromGraphPinTasks,
                [type, pinId],
                unplugOutsidePinsTask
              )

              const plugOutsidePinTask = newTask()

              for (const graphPinOutsidePlug of graphPinOutsidePlugs) {
                plugOutsidePinTask.moves.push({
                  in: true,
                  action: makePlugPinAction(
                    graphPinOutsidePlug.type,
                    graphPinOutsidePlug.pinId,
                    graphPinOutsidePlug.subPinId,
                    {
                      unitId: nextUnitId,
                      pinId: subPinSpec.pinId,
                    }
                  ),
                })
              }

              const addUnitTask = targetAddUnitTasks[subPinSpec.unitId]

              addDependency(plugOutsidePinTask, unplugOutsidePinsTask)
              addDependency(plugOutsidePinTask, addUnitTask)
            }

            const coverPinSetTask = deepGetOrDefault(
              sourceCoverPinSetTasks,
              [type, pinId],
              undefined
            )

            addDependency(unplugOutsidePinsTask, movePlugTask)

            if (coverPinSetTask) {
              addDependency(coverPinSetTask, unplugOutsidePinsTask)
            }
          }
        } else {
          if (isUnitSelected(subPinSpec.unitId)) {
            const nextPinType = type
            const nextPinId = pinId
            const nextSubPinId = newTargetSubPinId(nextPinType, pinId)

            deepSet_(
              mapping,
              ['plug', type, pinId, subPinId, 'in', 'plug', type],
              {
                pinId: nextPinId,
                type: nextPinType,
                subPinId: nextSubPinId,
              }
            )

            let exposePinSetTask = deepGetOrDefault(
              targetExposePinSetTasks,
              [nextPinType, nextPinId],
              undefined
            )

            if (!exposePinSetTask) {
              exposePinSetTask = newTask([
                {
                  in: true,
                  action: makeExposePinSetAction(nextPinType, nextPinId, {
                    plug: {},
                    ref,
                  }),
                },
              ])

              deepSet_(
                targetExposePinSetTasks,
                [nextPinType, nextPinId],
                exposePinSetTask
              )

              addDependency(exposePinSetTask, movePlugTask)
            }

            const targetExposePinTask = newTask([
              {
                in: true,
                action: makeExposePinAction(
                  nextPinType,
                  nextPinId,
                  nextSubPinId,
                  {}
                ),
              },
            ])

            addDependency(targetExposePinTask, exposePinSetTask)
            addDependency(targetExposePinTask, movePlugTask)

            const data_ = deepGetOrDefault(
              data,
              ['plug', type, pinId, subPinId],
              undefined
            )

            if (data_ !== undefined) {
              const setPinOutsideDataTask = newTask([
                {
                  in: false,
                  action: makeSetUnitPinDataAction(
                    graphId,
                    nextPinType,
                    nextPinId,
                    data_
                  ),
                },
              ])

              addDependency(setPinOutsideDataTask, targetExposePinTask)
            }

            const nextUnitId =
              mapping.unit?.[subPinSpec.unitId]?.in?.unit.unitId ??
              subPinSpec.unitId

            const plugPinTask = newTask([
              {
                in: true,
                action: makePlugPinAction(
                  nextPinType,
                  nextPinId,
                  nextSubPinId,
                  {
                    unitId: nextUnitId,
                    pinId: subPinSpec.pinId,
                    kind: subPinSpec.kind ?? type,
                  }
                ),
              },
            ])

            const addUnitTask = targetAddUnitTasks[subPinSpec.unitId]

            addDependency(plugPinTask, targetExposePinTask)
            addDependency(plugPinTask, addUnitTask)
          } else {
            const nextPinType = oppositeType
            const nextPinId = pinId
            const nextSubPinId = newTargetSubPinId(nextPinType, pinId)

            deepSet_(
              mapping,
              ['plug', type, pinId, subPinId, 'in', 'plug', oppositeType],
              {
                pinId: nextPinId,
                type: nextPinType,
                subPinId: nextSubPinId,
              }
            )

            movePlugTask.moves.push({
              in: true,
              action: makeExposePinSetAction(nextPinType, nextPinId, {
                plug: {
                  [nextSubPinId]: {},
                },
                ref,
              }),
            })

            const nextMergeId = newSourceMergeId()

            deepSet_(
              mapping,
              ['plug', type, pinId, subPinId, 'out', 'merge', oppositeType],
              {
                mergeId: nextMergeId,
              }
            )

            deepSet_(
              mapping,
              [
                'link',
                subPinSpec.unitId,
                subPinSpec.kind ?? type,
                subPinSpec.pinId,
                'in',
                'merge',
              ],
              {
                mergeId: nextMergeId,
              }
            )

            const sourceAddMergeTask = newTask([
              {
                in: false,
                action: makeAddMergeAction(nextMergeId, {
                  [graphId]: {
                    [oppositeType]: {
                      [nextPinId]: true,
                    },
                  },
                  [subPinSpec.unitId]: {
                    [subPinSpec.kind ?? type]: {
                      [subPinSpec.pinId]: true,
                    },
                  },
                }),
              },
            ])

            addDependency(sourceAddMergeTask, movePlugTask)

            const coverPinTask = deepGetOrDefault(
              sourceCoverPinTasks,
              [type, pinId, subPinId],
              undefined
            )

            if (coverPinTask) {
              addDependency(sourceAddMergeTask, coverPinTask)
            }

            const datum = deepGetOrDefault(
              data,
              ['plug', type, pinId, subPinId],
              undefined
            )

            if (datum) {
              movePlugTask.moves.push({
                in: false,
                action: makeSetUnitPinDataAction(
                  graphId,
                  nextPinType,
                  nextPinId,
                  datum
                ),
              })
            }
          }
        }
      } else if (subPinSpec.mergeId) {
        const nextPinType = reverse ? type : oppositeType
        const nextPinId = pinId
        const nextSubPinId = newTargetSubPinId(nextPinType, pinId)

        const mergeSpec = getMerge(source, subPinSpec.mergeId)

        const nextMergeSpec = {}

        for (const unitId in mergeSpec) {
          const nextUnitId = mapping.unit?.[unitId]?.in?.unit?.unitId ?? unitId

          const unitMerge = mergeSpec[unitId]

          nextMergeSpec[nextUnitId] = unitMerge
        }

        const nextMergeId = subPinSpec.mergeId

        if (reverse) {
          const graphPinOutsidePlugs = deepGetOrDefault(
            graphPlugMap,
            [type, pinId],
            undefined
          ) as GraphPlugOuterSpec[]

          if (graphPinOutsidePlugs) {
            //
          } else {
            deepSet_(
              mapping,
              ['plug', type, pinId, subPinId, 'in', 'plug', nextPinType],
              {
                pinId: nextPinId,
                type: nextPinType,
                subPinId: nextSubPinId,
              }
            )

            deepSet_(
              mapping,
              ['plug', type, pinId, subPinId, 'out', 'merge', nextPinType],
              {
                mergeId: nextMergeId,
              }
            )

            movePlugTask.moves.push({
              in: true,
              action: makeExposePinSetAction(nextPinType, nextPinId, {
                plug: {
                  [nextSubPinId]: {},
                },
                ref,
              }),
            })
          }

          const datum = deepGetOrDefault(
            data,
            ['plug', type, pinId, subPinId],
            undefined
          )

          if (datum) {
            movePlugTask.moves.push({
              in: false,
              action: makeSetPlugDataAction(
                nextPinType,
                nextPinId,
                nextSubPinId,
                datum,
                undefined
              ),
            })
          }

          if (isMergeSelected(subPinSpec.mergeId)) {
            const insideCount = mergeInsideCount[subPinSpec.mergeId]

            if (insideCount[type] > 0) {
              if (insideCount.input + insideCount.output > 1) {
                const nextMergeId = deepGetOrDefault(
                  mapping,
                  ['merge', subPinSpec.mergeId, 'in', 'merge', 'mergeId'],
                  undefined
                )

                if (graphPinOutsidePlugs && graphPinOutsidePlugs.length > 0) {
                  forEach(graphPinOutsidePlugs, (outerPlug) => {
                    movePlugTask.moves.push({
                      in: true,
                      action: makeUnplugPinAction(
                        outerPlug.type,
                        outerPlug.pinId,
                        outerPlug.subPinId,
                        outerPlug.subPinSpec
                      ),
                    })

                    movePlugTask.moves.push({
                      in: true,
                      action: makePlugPinAction(
                        outerPlug.type,
                        outerPlug.pinId,
                        outerPlug.subPinId,
                        {
                          mergeId: nextMergeId,
                        }
                      ),
                    })
                  })
                } else {
                  movePlugTask.moves.push({
                    in: true,
                    action: makePlugPinAction(type, pinId, nextSubPinId, {
                      mergeId: nextMergeId,
                    }),
                  })
                }
              }
            }
          }
        } else {
          if (isMergeSelected(subPinSpec.mergeId)) {
            const outsideCount = mergeOutsideCount[subPinSpec.mergeId] ?? {
              input: 0,
              output: 0,
            }

            if (outsideCount.input + outsideCount.output === 0) {
              deepSet_(
                mapping,
                ['plug', type, pinId, subPinId, 'in', 'plug', type],
                {
                  pinId: nextPinId,
                  type: nextPinType,
                  subPinId: nextSubPinId,
                }
              )

              deepSet_(
                mapping,
                ['plug', type, pinId, subPinId, 'out', 'merge', type],
                {
                  mergeId: nextMergeId,
                }
              )

              movePlugTask.moves.push({
                in: true,
                action: makeExposePinSetAction(type, nextPinId, {
                  plug: {
                    [nextSubPinId]: {},
                  },
                  ref,
                }),
              })

              const datum = deepGetOrDefault(
                data,
                ['plug', type, pinId, subPinId],
                undefined
              )

              if (datum) {
                movePlugTask.moves.push({
                  in: false,
                  action: makeSetUnitPinDataAction(
                    graphId,
                    type,
                    nextPinId,
                    datum
                  ),
                })
              }

              movePlugTask.moves.push({
                in: true,
                action: makePlugPinAction(type, pinId, '0', {
                  mergeId: nextMergeId,
                }),
              })
            }
          } else {
            if (reverse) {
              //
            } else {
              deepSet_(
                mapping,
                ['plug', type, pinId, subPinId, 'in', 'plug', nextPinType],
                {
                  pinId: nextPinId,
                  type: nextPinType,
                  subPinId: nextSubPinId,
                }
              )

              deepSet_(
                mapping,
                ['plug', type, pinId, subPinId, 'out', 'merge', nextPinType],
                {
                  mergeId: nextMergeId,
                }
              )

              movePlugTask.moves.push({
                in: true,
                action: makeExposePinSetAction(nextPinType, nextPinId, {
                  plug: {
                    [nextSubPinId]: {},
                  },
                  ref,
                }),
              })

              const datum = deepGetOrDefault(
                data,
                ['plug', type, pinId, subPinId],
                undefined
              )

              if (datum) {
                movePlugTask.moves.push({
                  in: false,
                  action: makeSetUnitPinDataAction(
                    graphId,
                    nextPinType,
                    nextPinId,
                    datum
                  ),
                })
              }

              movePlugTask.moves.push({
                in: false,
                action: makeAddPinToMergeAction(
                  nextMergeId,
                  graphId,
                  oppositeType,
                  nextPinId
                ),
              })
            }
          }
        }
      } else {
        const outerPlugs = deepGetOrDefault(
          graphPlugMap,
          [type, pinId],
          []
        ) as GraphPlugOuterSpec[]

        const samePinIdOuterPlug = outerPlugs?.find(
          (outerPlug) => outerPlug.pinId === pinId
        )

        if (
          samePinIdOuterPlug &&
          !deepGetOrDefault(
            outsidePlugMatched,
            [samePinIdOuterPlug.type, samePinIdOuterPlug.pinId],
            false
          )
        ) {
          const unplugPinTask = newTask([
            {
              in: true,
              action: makeUnplugPinAction(
                samePinIdOuterPlug.type,
                samePinIdOuterPlug.pinId,
                samePinIdOuterPlug.subPinId,
                samePinIdOuterPlug.subPinSpec
              ),
            },
          ])

          deepSet_(
            mapping,
            ['plug', type, pinId, subPinId, 'in', 'plug', type],
            {
              ...samePinIdOuterPlug,
              template: true,
            }
          )

          deepSet_(
            outsidePlugMatched,
            [samePinIdOuterPlug.type, samePinIdOuterPlug.pinId],
            true
          )

          addDependency(unplugPinTask, movePlugTask)
        } else {
          const nextPinType = type
          const nextPinId = pinId
          const nextSubPinId = newTargetSubPinId(nextPinType, pinId)

          deepSet_(
            mapping,
            ['plug', type, pinId, subPinId, 'in', 'plug', type],
            {
              pinId: nextPinId,
              type,
              subPinId: nextSubPinId,
            }
          )

          let exposePinTask = deepGetOrDefault(
            targetExposePinTasks,
            [type, nextPinId, nextSubPinId],
            undefined
          )

          if (!exposePinTask) {
            exposePinTask = newTask([
              {
                in: true,
                action: makeExposePinAction(type, nextPinId, nextSubPinId, {}),
              },
            ])

            addDependency(exposePinTask, movePlugTask)

            deepSet_(
              targetExposePinTasks,
              [type, nextPinId, nextSubPinId],
              exposePinTask
            )
          }

          const datum = deepGetOrDefault(
            data,
            ['plug', type, pinId, subPinId],
            undefined
          )

          if (datum) {
            const setUnitPinDataTask = newTask([
              {
                in: false,
                action: makeSetUnitPinDataAction(
                  graphId,
                  type,
                  nextPinId,
                  datum
                ),
              },
            ])

            addDependency(setUnitPinDataTask, exposePinTask)
          }
        }
      }
    }
  }

  for (const insideMergeId in targetNextMerges) {
    const reverseNextInsideMerge = targetNextMerges[insideMergeId]
    const reverseUnitIds = targetNextMergeSourceUnitIds[insideMergeId] ?? []

    const nextInsideMergeTask = newTask([
      {
        in: true,
        action: makeAddMergeAction(insideMergeId, reverseNextInsideMerge),
      },
    ])

    const removeTasks = deepGetOrDefault(
      targetPinNextRemoveTasks,
      [insideMergeId],
      []
    )

    for (const removeTask of removeTasks) {
      addDependency(nextInsideMergeTask, removeTask)
    }

    for (const unitId of reverseUnitIds) {
      const addUnitTask = targetAddUnitTasks[unitId]

      addDependency(nextInsideMergeTask, addUnitTask)
    }
  }

  return { source, target, mapping, table, tasks }
}

export function buildFullGraphSelection(
  specs: Specs,
  spec: GraphSpec
): GraphSelection {
  const selection: GraphSelection = {
    unit: keys(spec.units ?? {}),
    merge: keys(spec.merges ?? {}),
    link: [],
    plug: [],
  }

  for (const unitId in spec.units ?? {}) {
    const unit = spec.units[unitId]

    const unitSpec = specs[unit.id]

    forEachSpecPin(unitSpec, (type, pinId) => {
      if (isPinMerged(spec, unitId, type, pinId)) {
        //
      } else {
        selection.link.push({ unitId, type, pinId })
      }
    })
  }

  forEachGraphSpecPinPlug(spec, (type, pinId, pinSpec, subPinId) => {
    selection.plug.push({ type, pinId, subPinId })
  })

  return selection
}
