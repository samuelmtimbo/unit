import { Element_ } from '../../../../../Class/Element'
import { Graph } from '../../../../../Class/Graph'
import { emptySpec, newSpecId } from '../../../../../client/spec'
import { Zoom } from '../../../../../client/zoom'
import { fromBundle } from '../../../../../spec/fromBundle'
import { fromSpec } from '../../../../../spec/fromSpec'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import { GraphClass } from '../../../../../types/GraphClass'
import { G } from '../../../../../types/interface/G'
import { ID_EDITOR } from '../../../../_ids'

export interface I<T> {
  style: Dict<string>
  graph: G
  disabled: boolean
  fullwindow: boolean
  frame: Element_
  zoom: Zoom
  controls: boolean
}

export interface O<T> {
  graph: G | GraphClass
}

export default class Editor<T> extends Element_<I<T>, O<T>> {
  __ = ['U', 'C', 'V', 'J', 'G']

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
        ],
        o: ['graph'],
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
        },
      },
      system,
      ID_EDITOR
    )

    this._fallback()

    this._input.graph.push(this._fallback_graph)
  }

  private _fallback = () => {
    const { specs, classes } = this.__system

    const spec = this.__system.newSpec(
      emptySpec({ id: newSpecId(specs), user: true })
    )

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
      this._graph = data as Graph

      data.addListener('destroy', () => {
        if (this._graph === this._fallback_graph) {
          this._fallback()
        }

        this._input.graph.pull()
      })

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

  public snapshotSelf(): Dict<any> {
    const bundle = this._fallback_graph.getUnitBundleSpec()

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
