import { GraphSpec } from '../..'
import { Graph } from '../../../Class/Graph'
import {
  GraphAddMergeData,
  GraphAddMergesData,
  GraphAddPinToMergeData,
  GraphAddUnitData,
  GraphAddUnitGhostData,
  GraphAddUnitsData,
  GraphBulkEditData,
  GraphCloneUnitData,
  GraphCoverPinData,
  GraphCoverPinSetData,
  GraphCoverUnitPinSetData,
  GraphExplodeUnitData,
  GraphExposePinData,
  GraphExposePinSetData,
  GraphExposeUnitPinSetData,
  GraphMoveLinkPinIntoData,
  GraphMoveMergeIntoData,
  GraphMovePlugIntoData,
  GraphMoveSubComponentRootData,
  GraphMoveSubGraphIntoData,
  GraphMoveUnitData,
  GraphMoveUnitIntoData,
  GraphPlugPinData,
  GraphRemoveMergeData,
  GraphRemoveMergeDataData,
  GraphRemovePinFromMergeData,
  GraphRemoveUnitData,
  GraphRemoveUnitPinDataData,
  GraphSetMergeDataData,
  GraphSetPinSetFunctionalData,
  GraphSetPinSetIdData,
  GraphSetUnitNameData,
  GraphSetUnitPinConstant,
  GraphSetUnitPinDataData,
  GraphSetUnitPinIgnoredData,
  GraphTakeUnitErrData,
  GraphUnplugPinData,
} from '../../../Class/Graph/interface'
import { Memory, Unit } from '../../../Class/Unit'
import { emptySpec } from '../../../client/spec'
import { watchGraph } from '../../../debug/graph/watchGraph'
import { GraphMoment } from '../../../debug/GraphMoment'
import { Moment } from '../../../debug/Moment'
import { watchUnit } from '../../../debug/watchUnit'
import { proxyWrap } from '../../../proxyWrap'
import { evaluate } from '../../../spec/evaluate'
import { fromId } from '../../../spec/fromId'
import { stringify } from '../../../spec/stringify'
import {
  stringifyBundleSpecData,
  stringifyGraphSpecData,
} from '../../../spec/stringifySpec'
import { System } from '../../../system'
import forEachValueKey from '../../../system/core/object/ForEachKeyValue/f'
import { clone, isEmptyObject, mapObjVK } from '../../../util/object'
import { BundleSpec } from '../../BundleSpec'
import { Callback } from '../../Callback'
import { Dict } from '../../Dict'
import { GraphState } from '../../GraphState'
import { IO } from '../../IO'
import { stringifyDataObj, stringifyPinData } from '../../stringifyPinData'
import { UnitBundleSpec } from '../../UnitBundleSpec'
import { Unlisten } from '../../Unlisten'
import { $Component } from './$Component'
import { $G, $G_C, $G_R, $G_W } from './$G'
import { $Graph } from './$Graph'
import { $U } from './$U'
import { Async } from './Async'

export interface Holder<T> {
  data: T
}

export const parseMemoryData = (system: System, memory: Memory): void => {
  if (memory) {
    for (const inputId in memory.input) {
      if (memory.input[inputId]._register !== undefined) {
        memory.input[inputId]._register = evaluate(
          memory.input[inputId]._register,
          system.specs,
          system.classes
        )
      }
    }
    for (const outputId in memory.output) {
      if (memory.output[outputId]._register !== undefined) {
        memory.output[outputId]._register = evaluate(
          memory.output[outputId]._register,
          system.specs,
          system.classes
        )
      }
    }
  }
}

export const AsyncGCall = (graph: Graph): $G_C => {
  return {
    $setUnitName({ unitId, newUnitId, name }: GraphSetUnitNameData): void {
      graph.setUnitName(unitId, newUnitId, name)
    },

    $setUnitPinData({
      unitId,
      pinId,
      type,
      data,
    }: GraphSetUnitPinDataData): void {
      const system = graph.__system

      const { specs, classes } = system

      const _specs = system.specs

      data = evaluate(data, { ...specs, ..._specs }, classes)

      graph.setUnitPinData(unitId, type, pinId, data)
    },

    $removeUnitPinData({
      unitId,
      type,
      pinId,
    }: GraphRemoveUnitPinDataData): void {
      graph.removeUnitPinData(unitId, type, pinId)
    },

    $addUnit({ unitId: id, bundle }: GraphAddUnitData): void {
      graph.addUnitSpec(id, bundle)
    },

    $cloneUnit({ unitId, newUnitId }: GraphCloneUnitData): void {
      graph.cloneUnit(unitId, newUnitId)
    },

    $moveUnit({ id, unitId, inputId }: GraphMoveUnitData): void {
      graph.moveUnit(id, unitId, inputId)
    },

    $addUnits({ units }: GraphAddUnitsData): void {
      const { specs, classes } = graph.__system

      const unitNodes = mapObjVK(units, (u) => ({
        ...u,
        Class: fromId(u.id, specs, classes),
      }))
      graph.addUnitSpecs(unitNodes)
    },

    $removeUnit({ unitId: id }: GraphRemoveUnitData) {
      graph.removeUnit(id)
    },

    $exposePinSet({ type, pinId: id, pinSpec: pin }: GraphExposePinSetData) {
      graph.exposePinSet(type, id, pin)
    },

    $coverPinSet({ type, pinId: id }: GraphCoverPinSetData) {
      graph.coverPinSet(type, id, true)
    },

    $exposePin({
      type,
      pinId: id,
      subPinId,
      subPinSpec: subPin,
    }: GraphExposePinData) {
      graph.exposePin(type, id, subPinId, subPin)
    },

    $coverPin({ type, pinId: id, subPinId }: GraphCoverPinData) {
      graph.coverPin(type, id, subPinId)
    },

    $plugPin({
      type,
      pinId: id,
      subPinId,
      subPinSpec: subPin,
    }: GraphPlugPinData) {
      graph.plugPin(type, id, subPinId, subPin)
    },

    $unplugPin({ type, pinId: id, subPinId }: GraphUnplugPinData) {
      graph.unplugPin(type, id, subPinId)
    },

    $exposeUnitPinSet({
      unitId,
      type,
      pinId: id,
      pinSpec: pin,
    }: GraphExposeUnitPinSetData) {
      const unit = graph.refUnit(unitId) as Graph
      unit.exposePinSet(type, id, pin)
    },

    $coverUnitPinSet({ unitId, type, pinId: id }: GraphCoverUnitPinSetData) {
      const unit = graph.refUnit(unitId) as Graph
      unit.coverPinSet(type, id)
    },

    $setPinSetId({ type, pinId, nextPinId }: GraphSetPinSetIdData): void {
      graph.setPinSetId(type, pinId, nextPinId)
    },

    $setPinSetFunctional({
      type,
      pinId,
      functional,
    }: GraphSetPinSetFunctionalData) {
      graph.setPinSetFunctional(type, pinId, functional)
    },

    $setUnitPinConstant({
      unitId,
      type,
      pinId,
      constant,
    }: GraphSetUnitPinConstant): void {
      graph.setUnitPinConstant(unitId, type, pinId, constant)
    },

    $setUnitPinIgnored({
      unitId,
      type,
      pinId,
      ignored,
    }: GraphSetUnitPinIgnoredData): void {
      graph.setUnitPinIgnored(unitId, type, pinId, ignored)
    },

    $addMerge({ mergeId: id, mergeSpec: merge }: GraphAddMergeData) {
      graph.addMerge(clone(merge), id)
    },

    $removeMerge({ mergeId: id }: GraphRemoveMergeData) {
      graph.removeMerge(id)
    },

    $addMerges({ merges }: GraphAddMergesData): void {
      graph.addMerges(merges)
    },

    $setMergeData({ id, data }: GraphSetMergeDataData): void {
      const system = graph.refSystem()

      const { specs, classes } = system

      const _specs = system.specs

      const _data = evaluate(data, { ...specs, ..._specs }, classes)

      const mergePin = graph.refMergePin(id, 'input')

      mergePin.push(_data)
    },

    $removeMergeData({ id }: GraphRemoveMergeDataData): void {
      const mergePin = graph.refMergePin(id, 'input')
      mergePin.take()
    },

    $addPinToMerge({
      mergeId,
      unitId,
      type,
      pinId,
    }: GraphAddPinToMergeData): void {
      graph.addPinToMerge(mergeId, unitId, type, pinId)
    },

    $removePinFromMerge({
      mergeId,
      unitId,
      type,
      pinId,
    }: GraphRemovePinFromMergeData): void {
      graph.removePinFromMerge(mergeId, unitId, type, pinId)
    },

    $takeUnitErr({ unitId }: GraphTakeUnitErrData): void {
      graph.takeUnitErr(unitId)
    },

    $removeUnitGhost(
      {
        unitId,
        nextUnitId,
        nextUnitSpec,
      }: {
        unitId: string
        nextUnitId: string
        nextUnitSpec: GraphSpec
      },
      callback: (data: { specId: string; bundle: UnitBundleSpec }) => void
    ): void {
      const ghost = graph.removeUnitGhost(unitId, nextUnitId, nextUnitSpec)

      stringifyBundleSpecData(ghost.bundle)

      callback(ghost)
    },

    $addUnitGhost({
      unitId,
      nextUnitId,
      nextUnitBundle,
      nextUnitPinMap,
    }: GraphAddUnitGhostData): void {
      parseMemoryData(graph.__system, nextUnitBundle.unit.memory)

      graph.addUnitGhost(unitId, nextUnitId, nextUnitBundle, nextUnitPinMap)
    },

    $getSpec({}: {}, callback: Callback<GraphSpec>): void {
      const spec = graph.getSpec()

      callback(spec)
    },

    $getBundle({}: {}, callback: Callback<BundleSpec>): void {
      const bundle = graph.getBundleSpec()

      const { spec } = bundle

      stringifyGraphSpecData(spec)

      callback(bundle)
    },

    $getUnitPinData(
      { unitId, type, pinId }: { unitId: string; type: IO; pinId: string },
      callback: (data: { input: Dict<any>; output: Dict<any> }) => void
    ): void {
      const state = graph.getUnitPinData(unitId, type, pinId)
      callback(state)
    },

    async $getUnitState(
      { unitId }: { unitId: string },
      callback: (state: Dict<any>) => void
    ) {
      const state = await graph.getUnitState(unitId)
      callback(state)
    },

    $getGraphData(
      callback: Callback<{
        state: Dict<any>
        children: Dict<any>
        pinData: Dict<any>
        err: Dict<string | null>
        mergeData: Dict<any>
      }>
    ): void {
      const state = graph.getGraphState()
      const children = graph.getGraphChildren()
      const err = graph.getGraphErr()
      const units = graph.refUnits()

      const pinData = {}

      forEachValueKey(units, (unit: Unit, unitId: string) => {
        const unitPinData = unit.getPinData()

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

      callback({ state, children, err, pinData, mergeData })
    },

    async $snapshot(
      data: {},
      callback: (state: {
        input: Dict<any>
        output: Dict<any>
        memory: Dict<any>
      }) => void
    ) {
      const memory = graph.snapshot()
      callback(memory)
    },

    $snapshotUnit(
      { unitId }: { unitId: string },
      callback: (state: {
        input: Dict<any>
        output: Dict<any>
        memory: Dict<any>
      }) => void
    ) {
      const unit = graph.refUnit(unitId)
      const memory = unit.snapshot()
      callback(memory)
    },

    async $getGraphState({}: {}, callback: Callback<GraphState>) {
      const state = await graph.getGraphState()
      callback(state)
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
      // const state = graph.getGraphPinData()
      const pinData = {}
      const units = graph.refUnits()
      forEachValueKey(units, (unit: Unit, unitId: string) => {
        const unitPinData = unit.getPinData()
        const _unitPinData = stringifyPinData(unitPinData)
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

    $setMetadata({ path, data }: { path: string[]; data: any }): void {
      graph.setMetadata(path, data)
    },

    $reorderSubComponent({
      parentId,
      childId,
      to,
    }: {
      parentId: string | null
      childId: string
      to: number
    }) {
      graph.reorderSubComponent(parentId, childId, to)
    },

    $moveSubComponentRoot({
      parentId,
      children,
      slotMap,
    }: GraphMoveSubComponentRootData): void {
      graph.moveSubComponentRoot(parentId, children, slotMap)
    },

    $moveSubgraphInto({
      graphId,
      nodeIds,
      nextIdMap,
      nextPinIdMap,
      nextMergePinId,
      nextPlugSpec,
      nextSubComponentParentMap,
      nextSubComponentChildrenMap,
    }: GraphMoveSubGraphIntoData): void {
      graph.moveSubgraphInto(
        graphId,
        nodeIds,
        nextIdMap,
        nextPinIdMap,
        nextMergePinId,
        nextPlugSpec,
        nextSubComponentParentMap,
        nextSubComponentChildrenMap
      )
    },

    $moveSubgraphOutOf({
      graphId,
      nodeIds,
      nextIdMap,
      nextPinIdMap,
      nextMergePinId,
      nextPlugSpec,
      nextSubComponentParentMap,
      nextSubComponentChildrenMap,
    }: GraphMoveSubGraphIntoData): void {
      graph.moveSubgraphInto(
        graphId,
        nodeIds,
        nextIdMap,
        nextPinIdMap,
        nextMergePinId,
        nextPlugSpec,
        nextSubComponentParentMap,
        nextSubComponentChildrenMap
      )
    },

    $explodeUnit({
      unitId,
      mapUnitId,
      mapMergeId,
    }: GraphExplodeUnitData): void {
      graph.explodeUnit(unitId, mapUnitId, mapMergeId, true)
    },

    $bulkEdit({ actions }: GraphBulkEditData) {
      graph.bulkEdit(actions)
    },
  }
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
      const unit = graph.refUnit(unitId)
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
    $compose({
      id,
      unitId,
      _,
    }: {
      id: string
      unitId: string
      _: string[]
    }): $Graph {
      const system = graph.refSystem()
      const spec = graph.getSpec()

      if (system.hasSpec(id)) {
        throw new Error('Spec with id ' + id + ' already exists')
      }

      const render =
        spec.component && !isEmptyObject(spec.component.subComponents || {})

      if (render) {
        graph.setElement()
      } else {
        graph.setNotElement()
      }

      const parentSpec = emptySpec({ id })

      system.setSpec(id, parentSpec)

      const parent = new Graph(parentSpec, {}, system)

      parent.addUnit(unitId, graph, undefined, false)

      parent.play()

      const $parent = Async(parent, _)

      return proxyWrap($parent, _)
    },

    $refUnit({ unitId, _ }: { unitId: string; _: string[] }): $U {
      const unit = graph.refUnit(unitId)
      const $unit = Async(unit, _)

      return proxyWrap($unit, _)
    },

    $refSubComponent({
      unitId,
      _,
    }: {
      unitId: string
      _: string[]
    }): $Component {
      console
      const unit = graph.refUnit(unitId)
      const $unit = Async(unit, _)
      return proxyWrap($unit, _)
    },
  }
}

export const AsyncG = (graph: Graph): $G => {
  return {
    ...AsyncGWatch(graph),
    ...AsyncGCall(graph),
    ...AsyncGRef(graph),
  }
}
