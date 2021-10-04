import { Callback } from '../Callback'
import { Graph } from '../Class/Graph'
import { Unit } from '../Class/Unit'
import { GraphMoment } from '../debug/GraphMoment'
import { Moment } from '../debug/Moment'
import { watchGraph } from '../debug/watchGraph'
import { watchUnit } from '../debug/watchUnit'
import { GraphState } from '../GraphState'
import { G } from '../interface/G'
import { U } from '../interface/U'
import { _proxy } from '../proxyWrap'
import { evaluate } from '../spec/evaluate'
import { fromId } from '../spec/fromId'
import { stringify } from '../spec/stringify'
import { stringifyPinData } from '../stringifyPinData'
import forEachKeyValue from '../system/core/object/ForEachKeyValue/f'
import {
  GraphExposedPinSpec,
  GraphExposedSubPinSpec,
  GraphMergeSpec,
  GraphMergesSpec,
  GraphSpec,
  GraphUnitSpec,
  GraphUnitsSpec,
} from '../types'
import { Dict } from '../types/Dict'
import { Unlisten } from '../Unlisten'
import { mapObj } from '../util/object'
import { $Component } from './$Component'
import { $G, $G_C, $G_R, $G_W } from './$G'
import { $Graph } from './$Graph'
import { $U } from './$U'
import { Async } from './Async'

export interface Holder<T> {
  data: T
}

export const AsyncGCall = (graph: G): $G_C => {
  return {
    $setUnitPinData({
      unitId,
      pinId,
      type,
      data,
    }: {
      unitId: string
      pinId: string
      type: 'input' | 'output'
      data: string
    }) {
      data = evaluate(data, globalThis.__specs)
      graph.setUnitPinData(unitId, type, pinId, data)
    },

    $removeUnitPinData({
      unitId,
      type,
      pinId,
    }: {
      unitId: string
      type: 'input' | 'output'
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

    $addUnits({ units }: { units: GraphUnitsSpec }): void {
      const unitNodes = mapObj(units, (u) => ({
        ...u,
        Class: fromId(u.path, globalThis.__specs),
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
      type: 'input' | 'output'
      id: string
      pin: GraphExposedPinSpec
    }) {
      graph.exposePinSet(type, id, pin)
    },

    $coverPinSet({ type, id }: { type: 'input' | 'output'; id: string }) {
      graph.coverPinSet(type, id, true)
    },

    $exposePin({
      type,
      id,
      subPinId,
      subPin,
    }: {
      type: 'input' | 'output'
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
      type: 'input' | 'output'
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
      type: 'input' | 'output'
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
      type: 'input' | 'output'
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
      type: 'input' | 'output'
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
      type: 'input' | 'output'
      id: string
    }) {
      const unit = graph.refUnit(unitId) as Graph
      unit.coverPinSet(type, id)
    },

    $setPinSetFunctional({
      type,
      id,
      functional,
    }: {
      type: 'input' | 'output'
      id: string
      functional: boolean
    }) {
      graph.setPinSetFunctional(type, id, functional)
    },

    $setUnitPinConstant({
      unitId,
      type,
      pinId,
      constant,
    }: {
      unitId: string
      type: 'input' | 'output'
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
      type: 'input' | 'output'
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
      const _data = evaluate(data)
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
      type: 'input' | 'output'
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
      type: 'input' | 'output'
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
      {
        unitId,
        type,
        pinId,
      }: { unitId: string; type: 'input' | 'output'; pinId: string },
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
      const state = {}
      const units = graph.refUnits()
      forEachKeyValue(units, (unit: Unit, unitId: string) => {
        const unitPinData = unit.getPinData()
        const _unitPinData = stringifyPinData(unitPinData)
        state[unitId] = _unitPinData
      })
      callback(state)
    },

    $getGraphMergeInputData({}: {}, callback: (data: Dict<any>) => void): void {
      const state = graph.getGraphMergeInputData()
      const _state = {}
      for (const mergeId in state) {
        const data = state[mergeId]
        if (data === undefined) {
          _state[mergeId] = undefined
        } else {
          _state[mergeId] = stringify(data)
        }
      }
      callback(_state)
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

    $moveUnitInto({
      graphId,
      unitId,
      nextUnitId,
    }: {
      graphId: string
      unitId: string
      nextUnitId: string
    }): void {
      graph.moveUnitInto(graphId, unitId, nextUnitId)
    },

    $moveLinkPinInto({
      graphId,
      unitId,
      type,
      pinId,
    }: {
      graphId: string
      unitId: string
      type: 'input' | 'output'
      pinId: string
    }): void {
      graph.moveLinkPinInto(graphId, unitId, type, pinId)
    },

    $moveMergePinInto({
      graphId,
      mergeId,
      nextMergeId,
    }: {
      graphId: string
      mergeId: string
      nextMergeId: string
    }): void {
      graph.moveMergeInto(graphId, mergeId, nextMergeId)
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

export const AsyncGWatch = (graph: G): $G_W => {
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

export const AsyncGRef = (graph: G): $G_R => {
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
      const _parent_graph = new Graph()
      _parent_graph.addUnit({ path: id }, unitId, graph)
      _parent_graph.play()
      const $parent_graph = Async(_parent_graph, _)
      return _proxy($parent_graph, _)
    },

    $refUnit({ unitId, _ }: { unitId: string; _: string[] }): $U {
      const unit = graph.refUnit(unitId)
      const $unit = Async(unit, _)
      return _proxy($unit, _)
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
      return _proxy($unit, _)
    },
  }
}

export const AsyncG = (g: G): $G => {
  return {
    ...AsyncGWatch(g),
    ...AsyncGCall(g),
    ...AsyncGRef(g),
  }
}
