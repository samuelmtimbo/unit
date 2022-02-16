import { Element } from '../../../../../Class/Element'
import { Graph } from '../../../../../Class/Graph'
import { emptySpec, newSpecId } from '../../../../../client/spec'
import { G } from '../../../../../interface/G'
import { Pod } from '../../../../../pod'
import { fromSpec } from '../../../../../spec/fromSpec'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'

export interface I<T> {
  style: Dict<string>
  pod: G
  disabled: boolean
  fullwindow: boolean
  frame: Element
}

export interface O<T> {
  pod: G
}

export default class _Graph<T> extends Element<I<T>, O<T>> {
  __ = ['U', 'C', 'V', 'J', 'G']

  private _fallback_pod: G
  private _fallback_graph: Graph

  private _pod: G

  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['pod', 'style', 'disabled', 'fullwindow', 'frame', 'zoom'],
        o: ['pod'],
      },
      {
        input: {
          pod: {
            ref: true,
          },
          frame: {
            ref: true,
          },
        },
        output: {
          pod: {
            ref: true,
          },
        },
      },
      system,
      pod
    )

    const spec = emptySpec({ id: newSpecId(system.specs) })

    const Class = fromSpec(spec, { ...pod.specs, ...system.specs }, {})

    const fallback_graph = new Class(system, pod)
    this._fallback_graph = fallback_graph

    this._fallback_pod = fallback_graph

    this._input.pod.push(this._fallback_pod)

    this._fallback_graph.play()
  }

  onRefInputInvalid(name: string) {
    // console.log('Graph', 'onRefInputInvalid', name)

    if (name === 'pod') {
    }
  }

  onRefInputData(name: string, data: any) {
    // console.log('Graph', 'onRefInputData', name)

    if (name === 'pod') {
      const pod = data as Graph
      this._pod = pod
      this._output.pod.push(pod)
    }
  }

  onRefInputDrop(name: string) {
    // console.log('Graph', 'onRefInputDrop', name)
    if (name === 'pod') {
      this._input.pod.push(this._fallback_pod)
    }
  }
}
