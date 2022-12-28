import { AsyncWorkerGraph } from './AsyncWorker'
import { $ } from './Class/$'
import { $Child } from './component/Child'
import { $Children } from './component/Children'
import { RemotePort } from './RemotePort'
import { State } from './State'
import { System } from './system'
import {
  GraphMergeSpec,
  GraphMergesSpec,
  GraphPinSpec,
  GraphSpec,
  GraphSubPinSpec,
  GraphUnitsSpec,
} from './types'
import { BundleSpec } from './types/BundleSpec'
import { Callback } from './types/Callback'
import { Dict } from './types/Dict'
import { GlobalRefSpec } from './types/GlobalRefSpec'
import { $Component } from './types/interface/async/$Component'
import { $EE } from './types/interface/async/$EE'
import { $Graph } from './types/interface/async/$Graph'
import { $U } from './types/interface/async/$U'
import { IO } from './types/IO'
import { IOOf } from './types/IOOf'
import { UnitBundleSpec } from './types/UnitBundleSpec'
import { Unlisten } from './types/Unlisten'

export function asyncGraphFromPort(
  system: System,
  port: RemotePort
): $Graph & $ {
  const $graph: $Graph = AsyncWorkerGraph(port)

  class AsyncGraph extends $ implements $Graph {
    __: string[] = ['$U', '$C', '$G']

    $setUnitName(data: {
      unitId: string
      newUnitId: string
      name: string
    }): void {
      return $graph.$setUnitName(data)
    }

    $addListener(data: { event: string }, callback: Callback<any>): Unlisten {
      return $graph.$addListener(data, callback)
    }

    $emit(data: { type: string; data: any }, callback: Callback<any>): void {
      return $graph.$emit(data, callback)
    }

    $refEmitter(data: {}): $EE {
      return $graph.$refEmitter(data)
    }

    $getGlobalId(data: {}, callback: Callback<string>): void {
      return $graph.$getGlobalId(data, callback)
    }

    $getEventNames(data: {}, callback: Callback<string[]>): void {
      return $graph.$getEventNames(data, callback)
    }

    $play(data: {}): void {
      return $graph.$play(data)
    }

    $pause(data: {}): void {
      return $graph.$pause(data)
    }

    $push(data: { id: string; data: any }): void {
      return $graph.$push(data)
    }

    $pullInput(data: { id: string }): void {
      return $graph.$pullInput(data)
    }

    $takeInput(data: { id: string }): void {
      return $graph.$takeInput(data)
    }

    $setPinData(data: { pinId: string; type: IO; data: string }) {
      return $graph.$setPinData(data)
    }

    $removePinData(data: { type: IO; pinId: string }) {
      return $graph.$removePinData(data)
    }

    $getPinData(
      data: {},
      callback: (data: { input: Dict<any>; output: Dict<any> }) => void
    ): void {
      return $graph.$getPinData(data, callback)
    }

    $getInputData(data: {}, callback: (data: Dict<any>) => void): void {
      return $graph.$getInputData(data, callback)
    }

    $getRefInputData(
      data: {},
      callback: (data: Dict<GlobalRefSpec>) => void
    ): void {
      return $graph.$getRefInputData(data, callback)
    }

    $reset(data: {}): void {
      return $graph.$reset(data)
    }

    $watch(
      data: { events: string[] },
      callback: (moment: any) => void
    ): Unlisten {
      return $graph.$watch(data, callback)
    }

    $refGlobalObj(data: GlobalRefSpec): $U {
      return $graph.$refGlobalObj(data)
    }

    $appendChild(data: { specId: string }, callback: Callback<number>): void {
      return $graph.$appendChild(data, callback)
    }

    $removeChild(
      data: { at: number },
      callback: Callback<{ specId: string }>
    ): void {
      return $graph.$removeChild(data, callback)
    }

    $hasChild(data: { at: number }, callback: Callback<boolean>): void {
      return $graph.$hasChild(data, callback)
    }

    $child(data: { at: number }, callback: Callback<$Child>): void {
      return $graph.$child(data, callback)
    }

    $children(data: {}, callback: Callback<$Children>): void {
      return $graph.$children(data, callback)
    }

    $refChild(data: { at: number; _: string[] }): $Component {
      return $graph.$refChild(data)
    }

    $setUnitPinData(data: {
      unitId: string
      pinId: string
      type: IO
      data: string
    }): void {
      return $graph.$setUnitPinData(data)
    }

    $removeUnitPinData(data: {
      unitId: string
      type: IO
      pinId: string
    }): void {
      return $graph.$removeUnitPinData(data)
    }

    $addUnit(data: { id: string; unit: UnitBundleSpec }): void {
      return $graph.$addUnit(data)
    }

    $cloneUnit(data: { unitId: string; newUnitId: string }): void {
      return $graph.$cloneUnit(data)
    }

    $moveUnit(data: { id: string; unitId: string; inputId: string }): void {
      return $graph.$moveUnit(data)
    }

    $addUnits(data: { units: GraphUnitsSpec }): void {
      return $graph.$addUnits(data)
    }

    $removeUnit(data: { id: string }): void {
      return $graph.$removeUnit(data)
    }

    $exposePinSet(data: { type: IO; id: string; pin: GraphPinSpec }): void {
      return $graph.$exposePinSet(data)
    }

    $coverPinSet(data: { type: IO; id: string }): void {
      return $graph.$coverPinSet(data)
    }

    $exposePin(data: {
      type: IO
      id: string
      subPinId: string
      subPin: GraphSubPinSpec
    }): void {
      return $graph.$exposePin(data)
    }

    $coverPin(data: { type: IO; id: string; subPinId: string }): void {
      return $graph.$coverPin(data)
    }

    $plugPin(data: {
      type: IO
      id: string
      subPinId: string
      subPin: GraphSubPinSpec
    }): void {
      return $graph.$plugPin(data)
    }

    $unplugPin(data: { type: IO; id: string; subPinId: string }): void {
      return $graph.$unplugPin(data)
    }

    $exposeUnitPinSet(data: {
      unitId: string
      type: IO
      id: string
      pin: GraphPinSpec
    }): void {
      return $graph.$exposeUnitPinSet(data)
    }

    $coverUnitPinSet(data: { unitId: string; type: IO; id: string }): void {
      return $graph.$coverUnitPinSet(data)
    }

    $setPinSetId(data: { type: IO; pinId: string; nextPinId: string }): void {
      throw new Error('Method not implemented.')
    }

    $setPinSetFunctional(data: {
      type: IO
      pinId: string
      functional: boolean
    }): void {
      return $graph.$setPinSetFunctional(data)
    }

    $addMerge(data: { id: string; merge: GraphMergeSpec }): void {
      return $graph.$addMerge(data)
    }

    $removeMerge(data: { id: string }) {
      return $graph.$removeMerge(data)
    }

    $setUnitPinConstant(data: {
      unitId: string
      type: IO
      pinId: string
      constant: boolean
    }): void {
      return $graph.$setUnitPinConstant(data)
    }

    $setUnitPinIgnored(data: {
      unitId: string
      type: IO
      pinId: string
      ignored: boolean
    }): void {
      return $graph.$setUnitPinIgnored(data)
    }

    $addMerges(data: { merges: GraphMergesSpec }): void {
      return $graph.$addMerges(data)
    }

    $setMergeData(data: { id: string; data: any }): void {
      return $graph.$setMergeData(data)
    }

    $removeMergeData(data: { id: string }): void {
      return $graph.$removeMergeData(data)
    }

    $addPinToMerge(data: {
      mergeId: string
      unitId: string
      type: IO
      pinId: string
    }): void {
      return $graph.$addPinToMerge(data)
    }

    $removePinFromMerge(data: {
      mergeId: string
      unitId: string
      type: IO
      pinId: string
    }): void {
      return $graph.$removePinFromMerge(data)
    }

    $mergeMerges(data: { mergeIds: string[] }): void {
      return $graph.$mergeMerges(data)
    }

    $takeUnitErr(data: { unitId: string }): void {
      return $graph.$takeUnitErr(data)
    }

    $moveSubComponentChild(data: {
      subComponentId: string
      childId: string
      slotName: string
    }): void {
      throw new Error('Method not implemented.')
    }

    $moveSubComponentChildren(data: {
      subComponentId: string
      children: string[]
      slotMap: Dict<string>
    }): void {
      throw new Error('Method not implemented.')
    }

    $appendSubComponent(data: { subComponentId: string }): void {
      throw new Error('Method not implemented.')
    }

    $moveSubgraphInto(data: {
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
        link: Dict<IOOf<Dict<{ mergeId: string; oppositePinId: string }>>>
        unit: Dict<string>
      }
      nextPinIdMap: Dict<{
        input: Dict<{ pinId: string; subPinId: string }>
        output: Dict<{ pinId: string; subPinId: string }>
      }>
      nextMergePinId: Dict<{
        input: { mergeId: string; pinId: string }
        output: { mergeId: string; pinId: string }
      }>
      nextSubComponentParentMap: Dict<string | null>
      nextSubComponentChildrenMap: Dict<string[]>
    }): void {
      throw new Error('Method not implemented.')
    }

    $moveUnitInto(data: {
      graphId: string
      unitId: string
      nextUnitId: string
    }): void {
      return $graph.$moveUnitInto(data)
    }

    $movePlugInto(data: {
      graphId: string
      type: IO
      pinId: string
      subPinId: string
      subPinSpec: GraphSubPinSpec
    }): void {
      throw new Error('Method not implemented.')
    }

    $moveLinkPinInto(data: {
      graphId: string
      unitId: string
      type: IO
      pinId: string
      nextPinId: string
    }): void {
      return $graph.$moveLinkPinInto(data)
    }

    $moveMergePinInto(data: {
      graphId: string
      mergeId: string
      nextInputMergeId: { mergeId: string; pinId: string }
      nextOutputMergeId: { mergeId: string; pinId: string }
      nextPinIdMap: Dict<{
        input: Dict<{ pinId: string; subPinId: string }>
        output: Dict<{ pinId: string; subPinId: string }>
      }>
    }): void {
      return $graph.$moveMergePinInto(data)
    }

    $explodeUnit(data: {
      unitId: string
      mapUnitId: Dict<string>
      mapMergeId: Dict<string>
    }): void {
      return $graph.$explodeUnit(data)
    }

    $getUnitPinData(
      data: {},
      callback: (data: { input: Dict<any>; output: Dict<any> }) => void
    ): void {
      return $graph.$getUnitPinData(data, callback)
    }

    $getUnitState(data: { unitId: string }, callback: (state: State) => void) {
      return $graph.$getUnitState(data, callback)
    }

    $getGraphData(
      callback: Callback<{
        state: Dict<any>
        children: Dict<any>
        pinData: Dict<any>
        err: Dict<string>
        mergeData: Dict<any>
      }>
    ): Promise<void> {
      throw new Error('Method not implemented.')
    }

    $snapshot(
      data: {},
      callback: (state: {
        input: Dict<any>
        output: Dict<any>
        memory: Dict<any>
      }) => void
    ): void {
      throw new Error('Method not implemented.')
    }

    $snapshotUnit(
      data: {},
      callback: (state: {
        input: Dict<any>
        output: Dict<any>
        memory: Dict<any>
      }) => void
    ): void {
      throw new Error('Method not implemented.')
    }

    $removeUnitGhost(
      data: { unitId: string },
      callback: (data: {
        spec_id: string
        state: { input: Dict<any>; output: Dict<any>; memory: Dict<any> }
      }) => void
    ): void {
      throw new Error('Method not implemented.')
    }

    $getGraphState(data: {}, callback: (state: Dict<any>) => void) {
      return $graph.$getGraphState(data, callback)
    }

    $getGraphChildren(data: {}, callback: (state: Dict<any>) => void) {
      return $graph.$getGraphChildren(data, callback)
    }

    $getGraphPinData(data: {}, callback: (data: Dict<any>) => void): void {
      return $graph.$getGraphPinData(data, callback)
    }

    $getGraphErr(data: {}, callback: (data: Dict<string>) => void): void {
      return $graph.$getGraphErr(data, callback)
    }

    $getGraphMergeInputData(
      data: {},
      callback: (data: Dict<any>) => void
    ): void {
      return $graph.$getGraphMergeInputData(data, callback)
    }

    $getUnitInputData(
      data: { unitId: string },
      callback: (data: Dict<any>) => void
    ): void {
      return $graph.$getUnitInputData(data, callback)
    }

    $getSpec(data: {}, callback: Callback<GraphSpec>): void {
      return $graph.$getSpec(data, callback)
    }

    $getBundle(data: {}, callback: Callback<BundleSpec>): void {
      return $graph.$getBundle(data, callback)
    }

    $setMetadata(data: { path: string[]; data: any }): void {
      return $graph.$setMetadata(data)
    }

    $watchGraph(data: { events: string[] }, callback: Callback<any>): Unlisten {
      return $graph.$watchGraph(data, callback)
    }

    $watchUnit(
      data: { unitId: string; events: string[] },
      callback: Callback<any>
    ): Unlisten {
      return $graph.$watchUnit(data, callback)
    }

    $watchGraphUnit(
      data: { unitId: string },
      callback: (moment: any) => void
    ): Unlisten {
      return $graph.$watchGraphUnit(data, callback)
    }

    $watchUnitPath(
      data: { path: string[]; events: string[] },
      callback: Callback<any>
    ): Unlisten {
      return $graph.$watchUnitPath(data, callback)
    }

    $watchGraphUnitPath(
      data: { path: string[]; events: string[] },
      callback: Callback<any>
    ): Unlisten {
      return $graph.$watchGraphUnitPath(data, callback)
    }

    $compose(data: { id: string; unitId: string; _: string[] }): $Graph {
      return $graph.$compose(data)
    }

    $refSubComponent(data: { unitId: string; _: string[] }): $Component {
      return $graph.$refSubComponent(data)
    }

    $refUnit(data: { unitId: string; _: string[] }): $U {
      return $graph.$refUnit(data)
    }
  }

  const $$graph = new AsyncGraph(system)

  return $$graph
}
