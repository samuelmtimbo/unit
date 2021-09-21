import { Callback } from '../Callback'
import { GraphMoment } from '../debug/GraphMoment'
import { Moment } from '../debug/Moment'
import {
  GraphExposedPinSpec,
  GraphExposedSubPinSpec,
  GraphMergeSpec,
  GraphMergesSpec,
  GraphSpec,
  GraphUnitSpec,
  UnitsSpec,
} from '../types'
import { Dict } from '../types/Dict'
import { Unlisten } from '../Unlisten'
import { $Component } from './$Component'
import { $G, $G_C, $G_R, $G_W } from './$G'
import { $Graph } from './$Graph'
import { $U } from './$U'

export const AsyncGCall = (graph: $G_C): $G_C => {
  return {
    $setUnitPinData(data: {
      unitId: string
      pinId: string
      type: 'input' | 'output'
      data: any
    }): void {
      return graph.$setUnitPinData(data)
    },

    $removeUnitPinData(data: {
      unitId: string
      type: 'input' | 'output'
      pinId: string
    }) {
      return graph.$removeUnitPinData(data)
    },

    $addUnit(data: { id: string; unit: GraphUnitSpec }): void {
      return graph.$addUnit(data)
    },

    $moveUnit(data: { id: string; unitId: string; inputId: string }): void {
      return graph.$moveUnit(data)
    },

    $addUnits(data: { units: UnitsSpec }) {
      return graph.$addUnits(data)
    },

    $removeUnit(data: { id: string }) {
      return graph.$removeUnit(data)
    },

    $exposePinSet(data: {
      type: 'input' | 'output'
      id: string
      pin: GraphExposedPinSpec
    }) {
      return graph.$exposePinSet(data)
    },

    $coverPinSet(data: { type: 'input' | 'output'; id: string }) {
      return graph.$coverPinSet(data)
    },

    $exposePin(data: {
      type: 'input' | 'output'
      id: string
      subPinId: string
      subPin: GraphExposedSubPinSpec
    }) {
      return graph.$exposePin(data)
    },

    $coverPin(data: {
      type: 'input' | 'output'
      id: string
      subPinId: string
    }) {
      return graph.$coverPin(data)
    },

    $plugPin(data: {
      type: 'input' | 'output'
      id: string
      subPinId: string
      subPin: GraphExposedSubPinSpec
    }) {
      return graph.$plugPin(data)
    },

    $unplugPin(data: {
      type: 'input' | 'output'
      id: string
      subPinId: string
    }) {
      return graph.$unplugPin(data)
    },

    $exposeUnitPinSet(data: {
      unitId: string
      type: 'input' | 'output'
      id: string
      pin: GraphExposedPinSpec
    }) {
      return graph.$exposeUnitPinSet(data)
    },

    $coverUnitPinSet(data: {
      unitId: string
      type: 'input' | 'output'
      id: string
    }) {
      return graph.$coverUnitPinSet(data)
    },

    $setPinSetFunctional(data: {
      type: 'input' | 'output'
      id: string
      functional: boolean
    }) {
      return graph.$setPinSetFunctional(data)
    },

    $setUnitPinConstant(data: {
      unitId: string
      type: 'input' | 'output'
      pinId: string
      constant: boolean
    }) {
      return graph.$setUnitPinConstant(data)
    },

    $setUnitPinIgnored(data: {
      unitId: string
      type: 'input' | 'output'
      pinId: string
      ignored: boolean
    }) {
      return graph.$setUnitPinIgnored(data)
    },

    $addMerge(data: { id: string; merge: GraphMergeSpec }) {
      return graph.$addMerge(data)
    },

    $removeMerge(data: { id: string }) {
      return graph.$removeMerge(data)
    },

    $addMerges(data: { merges: GraphMergesSpec }) {
      return graph.$addMerges(data)
    },

    $setMergeData(data: { id: string; data: any }) {
      return graph.$setMergeData(data)
    },

    $removeMergeData(data: { id: string }) {
      return graph.$removeMergeData(data)
    },

    $addPinToMerge(data: {
      mergeId: string
      unitId: string
      type: 'input' | 'output'
      pinId: string
    }) {
      return graph.$addPinToMerge(data)
    },

    $removePinFromMerge(data: {
      mergeId: string
      unitId: string
      type: 'input' | 'output'
      pinId: string
    }) {
      return graph.$removePinFromMerge(data)
    },

    $mergeMerges(data: { mergeIds: string[] }) {
      return graph.$mergeMerges(data)
    },

    $takeUnitErr(data: { unitId: string }) {
      return graph.$takeUnitErr(data)
    },

    $getSpec(data: {}, callback: Callback<GraphSpec>) {
      return graph.$getSpec(data, callback)
    },

    $getUnitPinData(
      data: {},
      callback: (data: { input: Dict<any>; output: Dict<any> }) => void
    ) {
      return graph.$getUnitPinData(data, callback)
    },

    $getUnitState(
      data: { unitId: string },
      callback: (state: Dict<any>) => void
    ) {
      return graph.$getUnitState(data, callback)
    },

    $getGraphState(data: {}, callback: (state: Dict<any>) => void) {
      return graph.$getGraphState(data, callback)
    },

    $getGraphChildren(data: {}, callback: (state: Dict<any>) => void) {
      return graph.$getGraphChildren(data, callback)
    },

    $getGraphErr(data: {}, callback: (data: Dict<string | null>) => void) {
      return graph.$getGraphErr(data, callback)
    },

    $getGraphPinData(data: {}, callback: (data: Dict<any>) => void) {
      return graph.$getGraphPinData(data, callback)
    },

    $getGraphMergeInputData(data: {}, callback: (data: Dict<any>) => void) {
      return graph.$getGraphMergeInputData(data, callback)
    },

    $getUnitInputData(
      data: { unitId: string },
      callback: (data: Dict<any>) => void
    ) {
      return graph.$getUnitInputData(data, callback)
    },

    $setMetadata(data: { path: string[]; data: any }) {
      return graph.$setMetadata(data)
    },

    $moveUnitInto(data: {
      graphId: string
      unitId: string
      nextUnitId: string
    }): void {
      return graph.$moveUnitInto(data)
    },

    $moveLinkPinInto(data: {
      graphId: string
      unitId: string
      type: 'input' | 'output'
      pinId: string
      nextPinId: string
    }): void {
      return graph.$moveLinkPinInto(data)
    },

    $moveMergePinInto(data: {
      graphId: string
      mergeId: string
      nextMergeId: string
    }): void {
      return graph.$moveMergePinInto(data)
    },

    $explodeUnit(data: {
      unitId: string
      mapUnitId: Dict<string>
      mapMergeId: Dict<string>
    }): void {
      return graph.$explodeUnit(data)
    },
  }
}

export const AsyncGWatch = (graph: $G_W): $G_W => {
  return {
    $watchGraph(
      data: { events: string[] },
      callback: (moment: GraphMoment) => void
    ): Unlisten {
      return graph.$watchGraph(data, callback)
    },

    $watchGraphUnit(
      data: { unitId: string },
      callback: (moment: GraphMoment) => void
    ): Unlisten {
      return graph.$watchGraphUnit(data, callback)
    },

    $watchUnit(
      data: { unitId: string; events: string[] },
      callback: (moment: Moment) => void
    ): Unlisten {
      return graph.$watchUnit(data, callback)
    },

    $watchGraphUnitPath(
      data: { path: string[]; events: string[] },
      callback: (moment: GraphMoment) => void
    ): Unlisten {
      return graph.$watchGraphUnitPath(data, callback)
    },

    $watchUnitPath(
      data: { path: string[]; events: string[] },
      callback: (moment: Moment) => void
    ): Unlisten {
      return graph.$watchUnitPath(data, callback)
    },
  }
}

export const AsyncGRef = (graph: $G_R): $G_R => {
  return {
    $transcend(data: { id: string; unitId: string; _: string[] }): $Graph {
      return graph.$transcend(data)
    },

    $refUnit(data: { unitId: string; _: string[] }): $U {
      return graph.$refUnit(data)
    },

    $refSubComponent(data: { unitId: string; _: string[] }): $Component {
      return graph.$refSubComponent(data)
    },
  }
}

export const AsyncG = (g: $G): $G => {
  return {
    ...AsyncGWatch(g),
    ...AsyncGCall(g),
    ...AsyncGRef(g),
  }
}
