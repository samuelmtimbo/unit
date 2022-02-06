import { Graph } from '../../Class/Graph'
import { Unit } from '../../Class/Unit'
import { GraphMoment } from '../../debug/GraphMoment'
import { Moment } from '../../debug/Moment'
import { watchGraph } from '../../debug/watchGraph'
import { watchUnit } from '../../debug/watchUnit'
import { proxyWrap } from '../../proxyWrap'
import { evaluate } from '../../spec/evaluate'
import { fromId } from '../../spec/fromId'
import { stringify } from '../../spec/stringify'
import forEachKeyValue from '../../system/core/object/ForEachKeyValue/f'
import {
  Classes,
  GraphExposedPinSpec,
  GraphExposedSubPinSpec,
  GraphMergeSpec,
  GraphMergesSpec,
  GraphSpec,
  GraphUnitSpec,
  GraphUnitsSpec,
  Specs,
} from '../../types'
import { Callback } from '../../types/Callback'
import { Dict } from '../../types/Dict'
import { GraphState } from '../../types/GraphState'
import { IO } from '../../types/IO'
import { stringifyPinData } from '../../types/stringifyPinData'
import { Unlisten } from '../../types/Unlisten'
import { mapObjVK } from '../../util/object'
import { U } from '../U'
import { $Component } from './$Component'
import { $G, $G_C, $G_R, $G_W } from './$G'
import { $Graph } from './$Graph'
import { $U } from './$U'
import { Async } from './Async'

export interface Holder<T> {
  data: T
}

export const AsyncGCall = (graph: Graph): $G_C => {
  return {
    $setUnitPinData({
      unitId,
      pinId,
      type,
      data,
    }: {
      unitId: string
      pinId: string
      type: IO
      data: string
    }) {
      const system = graph.refSystem()

      const { specs, classes } = system

      const _specs = graph.getSpecs()

      data = evaluate(data, { ...specs, ..._specs }, classes)

      graph.setUnitPinData(unitId, type, pinId, data)
    },

    $removeUnitPinData({
      unitId,
      type,
      pinId,
    }: {
      unitId: string
      type: IO
      pinId: string
    }): void {
      const unit: U<any, any> = graph.refUnit(unitId)
      unit.getPin(type, pinId).take()
    },

    $addUnit({ id, unit }: { id: string; unit: GraphUnitSpec }): void {
      graph.addUnit(unit, id)
    },

    $moveUnit({
      id,
      unitId,
      inputId,
    }: {
      id: string
      unitId: string
      inputId: string
    }): void {
      graph.moveUnit(id, unitId, inputId)
    },

    $addUnits({
      specs,
      units,
      classes,
    }: {
      specs: Specs
      units: GraphUnitsSpec
      classes: Classes
    }): void {
      const unitNodes = mapObjVK(units, (u) => ({
        ...u,
        Class: fromId(u.id, specs, classes),
      }))
      graph.addUnits(unitNodes)
    },

    $removeUnit({ id }: { id: string }) {
      graph.removeUnit(id)
    },

    $exposePinSet({
      type,
      id,
      pin,
    }: {
      type: IO
      id: string
      pin: GraphExposedPinSpec
    }) {
      graph.exposePinSet(type, id, pin)
    },

    $coverPinSet({ type, id }: { type: IO; id: string }) {
      graph.coverPinSet(type, id, true)
    },

    $exposePin({
      type,
      id,
      subPinId,
      subPin,
    }: {
      type: IO
      id: string
      subPinId: string
      subPin: GraphExposedSubPinSpec
    }) {
      graph.exposePin(type, id, subPinId, subPin)
    },

    $coverPin({
      type,
      id,
      subPinId,
    }: {
      type: IO
      id: string
      subPinId: string
    }) {
      graph.coverPin(type, id, subPinId)
    },

    $plugPin({
      type,
      id,
      subPinId,
      subPin,
    }: {
      type: IO
      id: string
      subPinId: string
      subPin: GraphExposedSubPinSpec
    }) {
      graph.plugPin(type, id, subPinId, subPin)
    },

    $unplugPin({
      type,
      id,
      subPinId,
    }: {
      type: IO
      id: string
      subPinId: string
    }) {
      graph.unplugPin(type, id, subPinId)
    },

    $exposeUnitPinSet({
      unitId,
      type,
      id,
      pin,
    }: {
      unitId: string
      type: IO
      id: string
      pin: GraphExposedPinSpec
    }) {
      const unit = graph.refUnit(unitId) as Graph
      unit.exposePinSet(type, id, pin)
    },

    $coverUnitPinSet({
      unitId,
      type,
      id,
    }: {
      unitId: string
      type: IO
      id: string
    }) {
      const unit = graph.refUnit(unitId) as Graph
      unit.coverPinSet(type, id)
    },

    $setPinSetFunctional({
      type,
      pinId,
      functional,
    }: {
      type: IO
      pinId: string
      functional: boolean
    }) {
      graph.setPinSetFunctional(type, pinId, functional)
    },

    $setUnitPinConstant({
      unitId,
      type,
      pinId,
      constant,
    }: {
      unitId: string
      type: IO
      pinId: string
      constant: boolean
    }): void {
      graph.setUnitPinConstant(unitId, type, pinId, constant)
    },

    $setUnitPinIgnored({
      unitId,
      type,
      pinId,
      ignored,
    }: {
      unitId: string
      type: IO
      pinId: string
      ignored: boolean
    }): void {
      graph.setUnitPinIgnored(unitId, type, pinId, ignored)
    },

    $addMerge({ id, merge }: { id: string; merge: GraphMergeSpec }) {
      graph.addMerge(merge, id)
    },

    $removeMerge({ id }: { id: string }) {
      graph.removeMerge(id)
    },

    $addMerges({ merges }: { merges: GraphMergesSpec }): void {
      graph.addMerges(merges)
    },

    $setMergeData({ id, data }: { id: string; data: string }): void {
      const system = graph.refSystem()

      const { specs, classes } = system

      const _specs = graph.getSpecs()

      const _data = evaluate(data, { ...specs, ..._specs }, classes)

      const mergePin = graph.refMergePin(id, 'input')

      mergePin.push(_data)
    },

    $removeMergeData({ id }: { id: string }): void {
      const mergePin = graph.refMergePin(id, 'input')
      mergePin.take()
    },

    $addPinToMerge({
      mergeId,
      unitId,
      type,
      pinId,
    }: {
      mergeId: string
      unitId: string
      type: IO
      pinId: string
    }): void {
      graph.addPinToMerge(mergeId, unitId, type, pinId)
    },

    $removePinFromMerge({
      mergeId,
      unitId,
      type,
      pinId,
    }: {
      mergeId: string
      unitId: string
      type: IO
      pinId: string
    }): void {
      graph.removePinFromMerge(mergeId, unitId, type, pinId)
    },

    $mergeMerges({ mergeIds }: { mergeIds: string[] }): void {
      graph.mergeMerges(mergeIds)
    },

    $takeUnitErr({ unitId }: { unitId: string }): void {
      graph.takeUnitErr(unitId)
    },

    $getSpec({}: {}, callback: Callback<GraphSpec>): void {
      const spec = graph.getSpec()

      callback(spec)
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

    async $getGraphData(
      callback: Callback<{
        state: Dict<any>
        children: Dict<any>
        pinData: Dict<any>
        err: Dict<string | null>
        mergeData: Dict<any>
      }>
    ): Promise<void> {
      const state = await graph.getGraphState()
      const children = graph.getGraphChildren()
      const err = graph.getGraphErr()

      const pinData = {}
      const units = graph.refUnits()
      forEachKeyValue(units, (unit: Unit, unitId: string) => {
        const unitPinData = unit.getPinData()
        const _unitPinData = stringifyPinData(unitPinData)
        pinData[unitId] = _unitPinData
      })

      const _mergeData = graph.getGraphMergeInputData()
      const mergeData = {}
      for (const mergeId in _mergeData) {
        const data = _mergeData[mergeId]
        if (data === undefined) {
          mergeData[mergeId] = undefined
        } else {
          mergeData[mergeId] = stringify(data)
        }
      }

      callback({ state, children, err, pinData, mergeData })
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
      forEachKeyValue(units, (unit: Unit, unitId: string) => {
        const unitPinData = unit.getPinData()
        const _unitPinData = stringifyPinData(unitPinData)
        pinData[unitId] = _unitPinData
      })
      callback(pinData)
    },

    $getGraphMergeInputData({}: {}, callback: (data: Dict<any>) => void): void {
      const _mergeData = graph.getGraphMergeInputData()
      const mergeData = {}
      for (const mergeId in _mergeData) {
        const data = _mergeData[mergeId]
        if (data === undefined) {
          mergeData[mergeId] = undefined
        } else {
          mergeData[mergeId] = stringify(data)
        }
      }
      callback(mergeData)
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

    $appendSubComponentChild({
      subComponentId,
      childId,
      slotName,
    }: {
      subComponentId: string
      childId: string
      slotName: string
    }): void {
      graph.appendParentRoot(subComponentId, childId, slotName)
    },

    $appendSubComponentChildren({
      subComponentId,
      children,
      slotMap,
    }: {
      subComponentId: string
      children: string[]
      slotMap: Dict<string>
    }): void {
      graph.appendParentRootChildren(subComponentId, children, slotMap)
    },

    $appendSubComponent({ subComponentId }: { subComponentId: string }): void {
      graph.appendRoot(subComponentId)
    },

    $moveSubgraphInto({
      graphId,
      nodeIds,
      nextIdMap,
      nextPinIdMap,
      nextMergePinId,
      nextSubComponentParentMap,
      nextSubComponentChildrenMap,
    }: {
      graphId: string
      nodeIds: {
        merge: string[]
        link: {
          unitId: string
          type: IO
          pinId: string
        }[]
        unit: string[]
      }
      nextIdMap: {
        merge: Dict<string>
        link: Dict<{
          input: Dict<{ mergeId: string; oppositePinId: string }>
          output: Dict<{ mergeId: string; oppositePinId: string }>
        }>
        unit: Dict<string>
      }
      nextPinIdMap: Dict<{
        input: Dict<{ pinId: string; subPinId: string }>
        output: Dict<{ pinId: string; subPinId: string }>
      }>
      nextMergePinId: Dict<{
        nextInputMergePinId: string
        nextOutputMergePinId: string
      }>
      nextSubComponentParentMap: Dict<string | null>
      nextSubComponentChildrenMap: Dict<string[]>
    }): void {
      graph.moveSubgraphInto(
        graphId,
        nodeIds,
        nextIdMap,
        nextPinIdMap,
        nextMergePinId,
        nextSubComponentParentMap,
        nextSubComponentChildrenMap
      )
    },

    $moveUnitInto({
      graphId,
      unitId,
      nextUnitId,
      ignoredPin,
      ignoredMerge,
      nextPinMap,
      nextUnitSubComponentParent,
      nextSubComponentChildren,
    }: {
      graphId: string
      unitId: string
      nextUnitId: string
      ignoredPin: { input: Set<string>; output: Set<string> }
      ignoredMerge: Set<string>
      nextPinMap: {
        input: Dict<{ pinId: string; subPinId: string }>
        output: Dict<{ pinId: string; subPinId: string }>
      }
      nextUnitSubComponentParent: string | null
      nextSubComponentChildren: string[]
    }): void {
      graph.moveUnitInto(
        graphId,
        unitId,
        nextUnitId,
        ignoredPin,
        ignoredMerge,
        nextPinMap,
        nextUnitSubComponentParent,
        nextSubComponentChildren
      )
    },

    $moveLinkPinInto({
      graphId,
      unitId,
      type,
      pinId,
    }: {
      graphId: string
      unitId: string
      type: IO
      pinId: string
    }): void {
      graph.moveLinkPinInto(graphId, unitId, type, pinId)
    },

    $moveMergePinInto({
      graphId,
      mergeId,
      nextInputMergeId,
      nextOutputMergeId,
      nextPinIdMap,
    }: {
      graphId: string
      mergeId: string
      nextInputMergeId: string | null
      nextOutputMergeId: string | null
      nextPinIdMap: Dict<{
        input: Dict<{ pinId: string; subPinId: string }>
        output: Dict<{ pinId: string; subPinId: string }>
      }>
    }): void {
      graph.moveMergeInto(
        graphId,
        mergeId,
        nextInputMergeId,
        nextOutputMergeId,
        nextPinIdMap
      )
    },

    $explodeUnit({
      unitId,
      mapUnitId,
      mapMergeId,
    }: {
      unitId: string
      mapUnitId: Dict<string>
      mapMergeId: Dict<string>
    }): void {
      graph.explodeUnit(unitId, mapUnitId, mapMergeId)
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
    $transcend({
      id,
      unitId,
      _,
    }: {
      id: string
      unitId: string
      _: string[]
    }): $Graph {
      const system = graph.refSystem()
      const pod = graph.refPod()
      const parent = new Graph({}, {}, system, pod)
      parent.addUnit({ id }, unitId, graph, false)
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

export const AsyncG = (g: Graph): $G => {
  return {
    ...AsyncGWatch(g),
    ...AsyncGCall(g),
    ...AsyncGRef(g),
  }
}
