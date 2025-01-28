import { Graph } from '../../../Class/Graph'
import {
  GraphAddMergeData,
  GraphAddPinToMergeData,
  GraphAddUnitData,
  GraphAddUnitGhostData,
  GraphBulkEditData,
  GraphCloneUnitData,
  GraphCoverPinData,
  GraphCoverPinSetData,
  GraphCoverUnitPinSetData,
  GraphExposePinData,
  GraphExposePinSetData,
  GraphExposeUnitPinSetData,
  GraphMoveSubComponentRootData,
  GraphMoveSubGraphIntoData,
  GraphPlugPinData,
  GraphRemoveMergeData,
  GraphRemoveMergeDataData,
  GraphRemovePinFromMergeData,
  GraphRemoveUnitData,
  GraphRemoveUnitGhostData,
  GraphRemoveUnitPinDataData,
  GraphSetMergeDataData,
  GraphSetPinSetDefaultIgnoredData,
  GraphSetPinSetFunctionalData,
  GraphSetPinSetIdData,
  GraphSetUnitIdData,
  GraphSetUnitPinConstant,
  GraphSetUnitPinDataData,
  GraphSetUnitPinIgnoredData,
  GraphSetUnitPinSetId,
  GraphTakeUnitErrData,
  GraphUnplugPinData,
} from '../../../Class/Graph/interface'
import { BundleOpt, Unit } from '../../../Class/Unit'
import { Memory } from '../../../Class/Unit/Memory'
import { GraphMoment } from '../../../debug/GraphMoment'
import { Moment } from '../../../debug/Moment'
import { watchGraph } from '../../../debug/graph/watchGraph'
import { watchUnit } from '../../../debug/watchUnit'
import { ADD_UNIT } from '../../../spec/actions/G'
import { evaluate } from '../../../spec/evaluate'
import { evaluateMemorySpec } from '../../../spec/evaluate/evaluateMemorySpec'
import { stringify } from '../../../spec/stringify'
import {
  stringifyGraphSpecData,
  stringifyMemorySpecData,
} from '../../../spec/stringifySpec'
import forEachValueKey from '../../../system/core/object/ForEachKeyValue/f'
import { clone } from '../../../util/clone'
import { weakMerge } from '../../../weakMerge'
import { BundleSpec } from '../../BundleSpec'
import { Callback } from '../../Callback'
import { Dict } from '../../Dict'
import { IO } from '../../IO'
import { Key } from '../../Key'
import { UnitBundleSpec } from '../../UnitBundleSpec'
import { Unlisten } from '../../Unlisten'
import { stringifyDataObj, stringifyPinData } from '../../stringifyPinData'
import { $Component } from './$Component'
import { $G, $G_C, $G_G, $G_R, $G_W } from './$G'
import { $U } from './$U'
import { Async } from './Async'

function call(
  graph: Graph,
  method: string,
  fork: boolean,
  bubble: boolean,
  ...args: any[]
) {
  const { global } = graph.__system

  let result: any

  if (fork) {
    result = graph[method].call(graph, ...args, fork, bubble)
  } else {
    const all = { ...global.graph[graph.id] }

    delete all[graph.__global_id]

    const spec = clone(graph.getSpec())

    result = graph[method].call(graph, ...args, fork, bubble)

    for (const globalId in all) {
      const sibling = all[globalId] as Graph

      sibling[method].call(
        weakMerge(sibling, {
          _spec: clone(spec),
        }),
        ...args,
        fork,
        bubble,
        false
      )
    }
  }

  return result
}

export const AsyncGGet = (graph: Graph): $G_G => {
  const obj: $G_G = {
    $getBundle(opt: BundleOpt, callback: Callback<BundleSpec>): void {
      const bundle = graph.getBundleSpec(opt)

      const { spec } = bundle

      stringifyGraphSpecData(spec)

      callback(bundle)
    },

    $getUnitPinData(
      { unitId, type, pinId }: { unitId: string; type: IO; pinId: string },
      callback: (data: { input: Dict<any>; output: Dict<any> }) => void
    ): void {
      const state = graph.getUnitData(unitId, type, pinId)
      callback(state)
    },

    $getGraphData(
      data: {},
      callback: Callback<{
        children: Dict<any>
        pinData: Dict<any>
        err: Dict<string | null>
        mergeData: Dict<any>
      }>
    ): void {
      const children = graph.getGraphChildren()
      const err = graph.getGraphErr()
      const units = graph.getUnits()

      const pinData = {}

      forEachValueKey(units, (unit: Unit, unitId: Key) => {
        const unitPinData = unit.getPinsData()

        const _unitPinData = stringifyPinData(unitPinData)

        pinData[unitId] = _unitPinData
      })

      const _mergeData = graph.getGraphMergeInputData()

      const mergeData = {}

      for (const mergeId in _mergeData) {
        const data = _mergeData[mergeId]
        Performance
        if (data === undefined) {
          mergeData[mergeId] = undefined
        } else {
          mergeData[mergeId] = stringify(data)
        }
      }

      callback({ children, err, pinData, mergeData })
    },

    async $snapshot(data: {}, callback: (state: Memory) => void) {
      const memory = graph.snapshot()
      callback(memory)
    },

    $snapshotUnit(
      { unitId }: { unitId: string },
      callback: (state: Memory) => void
    ) {
      const unit = graph.getUnit(unitId)

      const memory = unit.snapshot()

      stringifyMemorySpecData(memory)

      callback(memory)
    },

    $getGraphChildren({}: {}, callback: (state: Dict<any>) => void) {
      const children = graph.getGraphChildren()
      callback(children)
    },

    $getGraphErr({}: {}, callback: (data: Dict<string | null>) => void): void {
      const state = graph.getGraphErr()
      callback(state)
    },

    $getGraphPinData({}: {}, callback: (data: Dict<any>) => void): void {
      const pinData = {}

      const units = graph.getUnits()

      forEachValueKey(units, (unit: Unit, unitId: Key) => {
        const unitPinData = unit.getPinsData()

        const _unitPinData = stringifyPinData(unitPinData, true)

        pinData[unitId] = _unitPinData
      })

      callback(pinData)
    },

    $getGraphMergeInputData({}: {}, callback: (data: Dict<any>) => void): void {
      const mergeData = graph.getGraphMergeInputData()
      const _mergeData = stringifyDataObj(mergeData)
      callback(_mergeData)
    },

    $getUnitInputData(
      { unitId }: { unitId: string },
      callback: (data: Dict<any>) => void
    ): void {
      const state = graph.getUnitInputData(unitId)
      callback(state)
    },
  }

  return obj
}

export const AsyncGCall = (graph: Graph): $G_C => {
  const obj: $G_C = {
    $setUnitId({
      unitId,
      newUnitId,
      name,
      fork = true,
      bubble = true,
    }: GraphSetUnitIdData): void {
      call(graph, 'setUnitId', fork, bubble, unitId, newUnitId, name)
    },

    $setUnitPinData({
      unitId,
      pinId,
      type,
      data,
      fork = true,
      bubble = true,
    }: GraphSetUnitPinDataData): void {
      const { specs, classes } = graph.__system

      data = evaluate(data, specs, classes)

      call(
        graph,
        'setUnitPinData',
        fork,
        bubble,
        unitId,
        type,
        pinId,
        data,
        true
      )
    },

    $removeUnitPinData({
      unitId,
      type,
      pinId,
      fork = true,
      bubble = true,
    }: GraphRemoveUnitPinDataData): void {
      call(graph, 'removeUnitPinData', fork, bubble, unitId, type, pinId)
    },

    $addUnit({
      unitId,
      bundle,
      parentId,
      fork = true,
      bubble = true,
    }: GraphAddUnitData): void {
      const { specs, classes } = graph.__system

      const {
        unit: { memory = {} },
      } = bundle

      evaluateMemorySpec(memory, specs, classes)

      call(
        graph,
        'addUnitSpec',
        fork,
        bubble,
        unitId,
        bundle,
        parentId,
        undefined
      )
    },

    $cloneUnit({
      unitId,
      newUnitId,
      fork = true,
      bubble = true,
    }: GraphCloneUnitData): void {
      call(graph, 'cloneUnit', fork, bubble, unitId, newUnitId)
    },

    $removeUnit({
      unitId,
      take,
      fork = true,
      bubble = true,
    }: GraphRemoveUnitData) {
      call(
        graph,
        'removeUnit',
        fork,
        bubble,
        unitId,
        undefined,
        take,
        undefined
      )
    },

    $exposePinSet({
      type,
      pinId,
      pinSpec,
      data,
      fork = true,
      bubble = true,
    }: GraphExposePinSetData) {
      const data_ =
        data && evaluate(data, graph.__system.specs, graph.__system.classes)

      call(
        graph,
        'exposePinSet',
        fork,
        bubble,
        type,
        pinId,
        pinSpec,
        data_,
        undefined,
        undefined
      )
    },

    $coverPinSet({
      type,
      pinId,
      fork = true,
      bubble = true,
    }: GraphCoverPinSetData) {
      call(graph, 'coverPinSet', fork, bubble, type, pinId, true)
    },

    $exposePin({
      type,
      pinId,
      subPinId,
      subPinSpec,
      fork = true,
      bubble = true,
    }: GraphExposePinData) {
      call(graph, 'exposePin', fork, bubble, type, pinId, subPinId, subPinSpec)
    },

    $coverPin({
      type,
      pinId,
      subPinId,
      fork = true,
      bubble = true,
    }: GraphCoverPinData) {
      call(graph, 'coverPin', fork, bubble, type, pinId, subPinId)
    },

    $plugPin({
      type,
      pinId,
      subPinId,
      subPinSpec,
      fork = true,
      bubble = true,
    }: GraphPlugPinData) {
      call(
        graph,
        'plugPin',
        fork,
        bubble,
        type,
        pinId,
        subPinId,
        subPinSpec,
        undefined,
        undefined,
        undefined
      )
    },

    $unplugPin({
      type,
      pinId,
      subPinId,
      take,
      fork = true,
      bubble = true,
    }: GraphUnplugPinData) {
      call(graph, 'unplugPin', fork, bubble, type, pinId, subPinId, true, take)
    },

    $exposeUnitPinSet({
      unitId,
      type,
      pinId,
      pinSpec,
      fork = true,
      bubble = true,
    }: GraphExposeUnitPinSetData) {
      const unit = graph.getUnit(unitId) as Graph

      call(
        unit,
        'exposePinSet',
        fork,
        bubble,
        type,
        pinId,
        pinSpec,
        undefined,
        undefined,
        undefined
      )
    },

    $coverUnitPinSet({
      unitId,
      type,
      pinId,
      fork = true,
      bubble = true,
    }: GraphCoverUnitPinSetData) {
      const unit = graph.getUnit(unitId) as Graph

      call(unit, 'coverPinSet', fork, bubble, type, pinId)
    },

    $setPinSetId({
      type,
      pinId,
      nextPinId,
      fork = true,
      bubble = true,
    }: GraphSetPinSetIdData): void {
      call(graph, 'setPinSetId', fork, bubble, type, pinId, nextPinId)
    },

    $setPinSetFunctional({
      type,
      pinId,
      functional,
      fork = true,
      bubble = true,
    }: GraphSetPinSetFunctionalData) {
      call(graph, 'setPinSetFunctional', fork, bubble, type, pinId, functional)
    },

    $setUnitPinConstant({
      unitId,
      type,
      pinId,
      constant,
      fork = true,
      bubble = true,
    }: GraphSetUnitPinConstant): void {
      call(
        graph,
        'setUnitPinConstant',
        fork,
        bubble,
        unitId,
        type,
        pinId,
        constant,
        true
      )
    },

    $setUnitPinIgnored({
      unitId,
      type,
      pinId,
      ignored,
      fork = true,
      bubble = true,
    }: GraphSetUnitPinIgnoredData): void {
      call(
        graph,
        'setUnitPinIgnored',
        fork,
        bubble,
        unitId,
        type,
        pinId,
        ignored
      )
    },

    $setUnitPinSetId({
      unitId,
      type,
      pinId,
      nextPinId,
      fork = true,
      bubble = true,
    }: GraphSetUnitPinSetId): void {
      call(
        graph,
        'setUnitPinSetId',
        fork,
        bubble,
        unitId,
        type,
        pinId,
        nextPinId
      )
    },

    $addMerge({
      mergeId,
      mergeSpec,
      fork = true,
      bubble = true,
    }: GraphAddMergeData) {
      call(
        graph,
        'addMerge',
        fork,
        bubble,
        mergeSpec,
        mergeId,
        undefined,
        undefined
      )
    },

    $removeMerge({
      mergeId,
      take,
      fork = true,
      bubble = true,
    }: GraphRemoveMergeData) {
      call(graph, 'removeMerge', fork, bubble, mergeId, undefined, take)
    },

    $addPinToMerge({
      mergeId,
      unitId,
      type,
      pinId,
      fork = true,
      bubble = true,
    }: GraphAddPinToMergeData): void {
      call(
        graph,
        'addPinToMerge',
        fork,
        bubble,
        mergeId,
        unitId,
        type,
        pinId,
        undefined,
        undefined
      )
    },

    $removePinFromMerge({
      mergeId,
      unitId,
      type,
      pinId,
      take,
      fork = true,
      bubble = true,
    }: GraphRemovePinFromMergeData): void {
      call(
        graph,
        'removePinFromMerge',
        fork,
        bubble,
        mergeId,
        unitId,
        type,
        pinId,
        true,
        take
      )
    },

    $removeUnitGhost(
      {
        unitId,
        nextUnitId,
        nextUnitSpec,
        fork = true,
        bubble = true,
      }: GraphRemoveUnitGhostData,
      callback: (data: { specId: string; bundle: UnitBundleSpec }) => void
    ): void {
      const ghost = call(
        graph,
        'removeUnitGhost',
        fork,
        bubble,
        unitId,
        nextUnitId,
        nextUnitSpec
      )

      const ghost_ = clone(ghost)

      stringifyMemorySpecData(ghost_.bundle.unit.memory)

      callback(ghost_)
    },

    $addUnitGhost({
      unitId,
      nextUnitId,
      nextUnitBundle,
      nextUnitPinMap,
      fork = true,
      bubble = true,
    }: GraphAddUnitGhostData): void {
      nextUnitBundle = clone(nextUnitBundle)

      if (nextUnitBundle.unit?.memory) {
        evaluateMemorySpec(
          nextUnitBundle.unit?.memory,
          graph.__system.specs,
          graph.__system.classes
        )
      }

      call(
        graph,
        'addUnitGhost',
        fork,
        bubble,
        unitId,
        nextUnitId,
        nextUnitBundle,
        nextUnitPinMap
      )
    },

    $setMetadata({
      path,
      data,
      fork = true,
      bubble = true,
    }: {
      path: string[]
      data: any
      fork?: boolean
      bubble?: boolean
    }): void {
      call(graph, 'setMetadata', fork, bubble, path, data)
    },

    $reorderSubComponent({
      parentId,
      childId,
      to,
      fork = true,
      bubble = true,
    }: {
      parentId: string | null
      childId: string
      to: number
      fork?: boolean
      bubble?: boolean
    }) {
      call(graph, 'reorderSubComponent', fork, bubble, parentId, childId, to)
    },

    $moveSubComponentRoot({
      parentId,
      children,
      slotMap,
      index,
      fork = true,
      bubble = true,
    }: GraphMoveSubComponentRootData): void {
      call(
        graph,
        'moveSubComponentRoot',
        fork,
        bubble,
        parentId,
        children,
        index,
        slotMap
      )
    },

    $moveSubgraphInto({
      graphId,
      nextSpecId,
      nodeIds,
      nextIdMap,
      nextPinIdMap,
      nextMergePinId,
      nextPlugSpec,
      nextSubComponentParentMap,
      nextSubComponentChildrenMap,
      nextSubComponentParentSlot,
      nextSubComponentSlot,
      fork = true,
      bubble = true,
    }: GraphMoveSubGraphIntoData): void {
      const graphBundle = graph.getGraphUnitUnitBundleSpec(graphId)
      const graphSpec = graph.getGraphUnitGraphSpec(graphId)

      call(
        graph,
        'moveSubgraphInto',
        fork,
        bubble,
        graphId,
        graphBundle,
        graphSpec,
        nextSpecId,
        nodeIds,
        nextIdMap,
        nextPinIdMap,
        nextMergePinId,
        nextPlugSpec,
        nextSubComponentParentMap,
        nextSubComponentChildrenMap,
        nextSubComponentParentSlot,
        nextSubComponentSlot
      )
    },

    $moveSubgraphOutOf({
      graphId,
      nextSpecId,
      nodeIds,
      nextIdMap,
      nextPinIdMap,
      nextMergePinId,
      nextPlugSpec,
      nextSubComponentParentMap,
      nextSubComponentChildrenMap,
      nextSubComponentParentSlot,
      nextSubComponentSlot,
      fork = true,
      bubble = true,
    }: GraphMoveSubGraphIntoData): void {
      const graphBundle = graph.getGraphUnitUnitBundleSpec(graphId)
      const graphSpec = graph.getGraphUnitGraphSpec(graphId)

      call(
        graph,
        'moveSubgraphOutOf',
        fork,
        bubble,
        graphId,
        graphBundle,
        graphSpec,
        nextSpecId,
        nodeIds,
        nextIdMap,
        nextPinIdMap,
        nextMergePinId,
        nextPlugSpec,
        nextSubComponentParentMap,
        nextSubComponentChildrenMap,
        nextSubComponentParentSlot,
        nextSubComponentSlot
      )
    },

    $bulkEdit({ actions, fork = true, bubble = true }: GraphBulkEditData) {
      const { specs, classes } = graph.__system

      actions = actions.map((action) => {
        action = clone(action)

        if (action.data.data) {
          action.data.data = evaluate(action.data.data, specs, classes)
        }

        if (action.type === ADD_UNIT) {
          if (action.data.bundle.unit.memory) {
            evaluateMemorySpec(action.data.bundle.unit.memory, specs, classes)
          }
        }

        return action
      })

      call(graph, 'bulkEdit', fork, bubble, actions)
    },

    $setMergeData({
      mergeId,
      data,
      fork = true,
      bubble = true,
    }: GraphSetMergeDataData): void {
      const system = graph.refSystem()

      const { specs, classes } = system

      const _data = evaluate(data, specs, classes)

      graph.setMergeData(mergeId, _data)
    },

    $removeMergeData({
      mergeId,
      fork = true,
      bubble = true,
    }: GraphRemoveMergeDataData): void {
      graph.removeMergeData(mergeId)
    },

    $takeUnitErr({
      unitId,
      fork = true,
      bubble = true,
    }: GraphTakeUnitErrData): void {
      graph.takeUnitErr(unitId)
    },

    $setPinSetDefaultIgnored({
      type,
      pinId,
      defaultIgnored,
      fork,
      bubble,
    }: GraphSetPinSetDefaultIgnoredData): void {
      call(
        graph,
        'setPinSetDefaultIgnored',
        fork,
        bubble,
        type,
        pinId,
        defaultIgnored
      )
    },
  }

  return obj
}

export const AsyncGWatch = (graph: Graph): $G_W => {
  return {
    $watchGraph(
      { events }: { events: string[] },
      callback: (moment: GraphMoment) => void
    ): Unlisten {
      return watchGraph(graph, callback, events)
    },

    $watchUnit(
      { unitId, events }: { unitId: string; events: string[] },
      callback: (moment: Moment) => void
    ): Unlisten {
      const unit = graph.getUnit(unitId)
      return watchUnit(unit, callback, events)
    },

    $watchGraphUnit(
      { unitId, events }: { unitId: string; events: string[] },
      callback: (moment: GraphMoment) => void
    ): Unlisten {
      const graph = this.refUnit(unitId) as Graph
      return watchGraph(graph, callback, events)
    },

    $watchUnitPath(
      { path, events }: { path: string[]; events: string[] },
      callback: Callback<any>
    ): Unlisten {
      const unit = graph.getUnitByPath(path)
      return watchUnit(unit, callback, events)
    },

    $watchGraphUnitPath(
      { path, events }: { path: string[]; events: string[] },
      callback: Callback<any>
    ): Unlisten {
      const unit = graph.getUnitByPath(path) as Graph
      return watchGraph(unit, callback, events)
    },
  }
}

export const AsyncGRef = (graph: Graph): $G_R => {
  return {
    $refUnit({ unitId, _ }: { unitId: string; _: string[] }): $U {
      const unit = graph.getUnit(unitId)

      const $unit = Async(unit, _, graph.__system.async)

      return $unit
    },

    $refSubComponent({
      unitId,
      _,
    }: {
      unitId: string
      _: string[]
    }): $Component {
      const unit = graph.getUnit(unitId)

      const $unit = Async(unit, _, graph.__system.async)

      return $unit
    },
  }
}

export const AsyncG = (graph: Graph): $G => {
  return {
    ...AsyncGGet(graph),
    ...AsyncGWatch(graph),
    ...AsyncGCall(graph),
    ...AsyncGRef(graph),
  }
}
