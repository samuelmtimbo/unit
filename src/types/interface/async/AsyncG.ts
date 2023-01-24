import {
  Classes,
  GraphMergeSpec,
  GraphMergesSpec,
  GraphPinSpec,
  GraphSpec,
  GraphSubPinSpec,
  GraphUnitsSpec,
  Specs,
} from '../..'
import { Graph } from '../../../Class/Graph'
import { Unit } from '../../../Class/Unit'
import { emptySpec } from '../../../client/spec'
import { watchGraph } from '../../../debug/graph/watchGraph'
import { GraphMoment } from '../../../debug/GraphMoment'
import { Moment } from '../../../debug/Moment'
import { watchUnit } from '../../../debug/watchUnit'
import { proxyWrap } from '../../../proxyWrap'
import { evaluate } from '../../../spec/evaluate'
import { fromId } from '../../../spec/fromId'
import { stringify } from '../../../spec/stringify'
import { _stringifyGraphSpecData } from '../../../spec/stringifySpec'
import forEachValueKey from '../../../system/core/object/ForEachKeyValue/f'
import { clone, isEmptyObject, mapObjVK } from '../../../util/object'
import { BundleSpec } from '../../BundleSpec'
import { Callback } from '../../Callback'
import { Dict } from '../../Dict'
import { GraphState } from '../../GraphState'
import { IO } from '../../IO'
import { IOOf, _IOOf } from '../../IOOf'
import { stringifyDataObj, stringifyPinData } from '../../stringifyPinData'
import { UnitBundleSpec } from '../../UnitBundleSpec'
import { Unlisten } from '../../Unlisten'
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
    $setUnitName({
      unitId,
      newUnitId,
      name,
    }: {
      unitId: string
      newUnitId: string
      name: string
    }): void {
      graph.setUnitName(unitId, newUnitId, name)
    },

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
    }): void {
      const system = graph.__system

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

    $addUnit({ id, unit }: { id: string; unit: UnitBundleSpec }): void {
      graph.addUnitSpec(id, unit)
    },

    $cloneUnit({
      unitId,
      newUnitId,
    }: {
      unitId: string
      newUnitId: string
    }): void {
      graph.cloneUnit(unitId, newUnitId)
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
      graph.addUnitSpecs(unitNodes)
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
      pin: GraphPinSpec
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
      subPin: GraphSubPinSpec
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
      subPin: GraphSubPinSpec
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
      pin: GraphPinSpec
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

    $setPinSetId({
      type,
      pinId,
      nextPinId,
    }: {
      type: IO
      pinId: string
      nextPinId: string
    }): void {
      graph.setPinSetId(type, pinId, nextPinId)
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
      graph.addMerge(clone(merge), id)
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

    $getBundle({}: {}, callback: Callback<BundleSpec>): void {
      const bundle = graph.getBundleSpec()

      const { spec } = bundle

      _stringifyGraphSpecData(spec)

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
      forEachValueKey(units, (unit: Unit, unitId: string) => {
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
      callback: (data: {
        spec_id: string
        state: {
          input: Dict<any>
          output: Dict<any>
          memory: Dict<any>
        }
      }) => void
    ): void {
      const ghost = graph.removeUnitGhost(unitId, nextUnitId, nextUnitSpec)

      callback(ghost)
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

    $moveSubComponentChild({
      subComponentId,
      childId,
      slotName,
    }: {
      subComponentId: string
      childId: string
      slotName: string
    }): void {
      graph.moveSubComponent(subComponentId, childId, slotName)
    },

    $moveSubComponentChildren({
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
      nextPlugSpec,
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
        plug: {
          type: IO
          pinId: string
          subPinId: string
        }[]
      }
      nextIdMap: {
        merge: Dict<string>
        link: Dict<IOOf<Dict<{ mergeId: string; oppositePinId: string }>>>
        plug: _IOOf<Dict<Dict<{ mergeId: string; type: IO }>>>
        unit: Dict<string>
      }
      nextPinIdMap: Dict<{
        input: Dict<{ pinId: string; subPinId: string }>
        output: Dict<{ pinId: string; subPinId: string }>
      }>
      nextMergePinId: Dict<{
        input: { mergeId: string; pinId: string; subPinSpec: GraphSubPinSpec }
        output: { mergeId: string; pinId: string; subPinSpec: GraphSubPinSpec }
      }>
      nextPlugSpec: {
        input: Dict<Dict<GraphSubPinSpec>>
        output: Dict<Dict<GraphSubPinSpec>>
      }
      nextSubComponentParentMap: Dict<string | null>
      nextSubComponentChildrenMap: Dict<string[]>
    }): void {
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
    }: {
      graphId: string
      mergeId: string
      nextInputMergeId: {
        mergeId: string
        pinId: string
        subPinSpec: GraphSubPinSpec
      }
      nextOutputMergeId: {
        mergeId: string
        pinId: string
        subPinSpec: GraphSubPinSpec
      }
    }): void {
      graph.moveMergeInto(graphId, mergeId, nextInputMergeId, nextOutputMergeId)
    },

    $movePlugInto({
      graphId,
      type,
      pinId,
      subPinId,
      subPinSpec,
    }: {
      graphId: string
      type: IO
      pinId: string
      subPinId: string
      subPinSpec: GraphSubPinSpec
    }): void {
      graph.movePlugInto(graphId, type, pinId, subPinId, subPinSpec)
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
      graph.explodeUnit(unitId, mapUnitId, mapMergeId, true)
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

      parent.addUnit(unitId, graph, false)

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
