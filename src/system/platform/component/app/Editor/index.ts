import { $ } from '../../../../../Class/$'
import { Element_ } from '../../../../../Class/Element'
import { Graph } from '../../../../../Class/Graph'
import { SnapshotOpt } from '../../../../../Class/Unit'
import { Rect } from '../../../../../client/util/geometry/types'
import { Zoom } from '../../../../../client/zoom'
import { fromBundle } from '../../../../../spec/fromBundle'
import { fromSpec } from '../../../../../spec/fromSpec'
import { emptySpec, newSpecId } from '../../../../../spec/util'
import { System } from '../../../../../system'
import { GraphNodeSpec } from '../../../../../types'
import { BundleSpec } from '../../../../../types/BundleSpec'
import { Dict } from '../../../../../types/Dict'
import { Async } from '../../../../../types/interface/async/Async'
import { G } from '../../../../../types/interface/G'
import { J } from '../../../../../types/interface/J'
import { UCGJEE } from '../../../../../types/interface/UCGJEE'
import { wrapObject } from '../../../../../wrap/Object'
import { ID_EDITOR } from '../../../../_ids'
import { firstGlobalComponentPromise } from '../../../../globalComponent'
import EditorComponent, { Config, Value } from './Component'

export interface I<T> {
  style: Dict<string>
  graph: G
  disabled: boolean
  fullwindow: boolean
  frame: Element_
  zoom: Zoom
  controls: boolean
  config: Config
  value: Value
}

export interface O<T> {
  graph: G
  state: J & $
  value: Value
}

export default class Editor<T> extends Element_<I<T>, O<T>> {
  __ = ['U', 'C', 'V', 'J', 'G', 'EE']

  private _fallback_graph: Graph
  private _graph: Graph

  constructor(system: System) {
    super(
      {
        i: [
          'graph',
          'style',
          'disabled',
          'fullwindow',
          'frame',
          'zoom',
          'controls',
          'config',
          'attr',
          'value',
        ],
        o: ['graph', 'state', 'value'],
      },
      {
        input: {
          graph: {
            ref: true,
          },
          frame: {
            ref: true,
          },
        },
        output: {
          graph: {
            ref: true,
          },
          state: {
            ref: true,
          },
        },
      },
      system,
      ID_EDITOR
    )

    this._fallback()

    this._input.graph.push(this._fallback_graph)

    this.register()

    void (async () => {
      const component = (await firstGlobalComponentPromise(
        this.__system,
        this.__global_id
      )) as EditorComponent

      const state = wrapObject(
        {
          get bundle(): BundleSpec {
            return component.getBundle()
          },
          get zoom(): Zoom {
            return component.getZoom()
          },
          set zoom(zoom: Zoom) {
            component.setZoom(zoom)
          },
          get rect(): Rect {
            return component.getRect()
          },
          get selected(): GraphNodeSpec[] {
            return component.getSelectedNodes()
          },
          set selected(selected: GraphNodeSpec[]) {
            component.setSelectedNodes(selected)
          },
          get path() {
            return component.getSubgraphPath()
          },
          set path(path: string[]) {
            component.setSubgraphPath(path)
          },
        },
        this.__system
      )

      this._output.state.push(state)
    })()
  }

  private _fallback = () => {
    const { specs, classes } = this.__system

    const id = newSpecId(specs)

    const spec = this.__system.newSpec(emptySpec({ id }))

    this.__system.lockSpec(id)

    const Class = fromSpec(spec, specs, classes, {})

    const fallback_graph = new Class(this.__system)
    this._fallback_graph = fallback_graph

    this._fallback_graph.play()
  }

  onRefInputInvalid(name: string) {
    // console.log('Editor', 'onRefInputInvalid', name)

    if (name === 'graph') {
      //
    }
  }

  onRefInputData(name: string, data: any) {
    super.onRefInputData(name, data)

    // console.log('Editor', 'onRefInputData', name, data)

    if (name === 'graph') {
      if (this._input.graph.embodied()) {
        data = Async(data, UCGJEE, this.__system.async)
      }

      this._graph = data as Graph

      data.addListener('destroy', (path: string[]) => {
        if (path.length > 0) {
          return
        }

        if (this._graph === this._fallback_graph) {
          this._fallback()
        }
      })

      if (this._input.graph.embodied()) {
        data.$play()
      }

      this._output.graph.push(data)
    }
  }

  onRefInputDrop(name: string) {
    super.onRefInputDrop(name)
    // console.log('Editor', 'onRefInputDrop', name)

    if (name === 'graph') {
      this._graph = this._fallback_graph

      this._input.graph.push(this._fallback_graph)
      this._output.graph.push(this._fallback_graph)
    }
  }

  public onRefOutputData(name: string, data: any): void {
    // console.log('Editor', 'onRefOutputData', name, data)
  }

  public snapshotSelf(opt: SnapshotOpt = {}): Dict<any> {
    const bundle = this._fallback_graph.getUnitBundleSpec(opt)

    return {
      ...super.snapshotSelf(),
      _fallback_graph: bundle,
    }
  }

  public restoreSelf(state: Dict<any>): void {
    const { _fallback_graph, ...rest } = state

    super.restoreSelf(rest)

    const Class = fromBundle(_fallback_graph, this.__system.specs, {})

    const graph = new Class(this.__system)

    this._fallback_graph = graph
  }
}
