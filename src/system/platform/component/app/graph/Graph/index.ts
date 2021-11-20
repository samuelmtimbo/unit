import { Element } from '../../../../../../Class/Element/Element'
import { Graph } from '../../../../../../Class/Graph'
import { G } from '../../../../../../interface/G'
import { System } from '../../../../../../system'
import { Dict } from '../../../../../../types/Dict'

export interface I<T> {
  style: Dict<string>
  pod: G
  disabled: boolean
  fullwindow: boolean
  frame: Element
}

export interface O<T> {}

export default class _Graph<T> extends Element<I<T>, O<T>> {
  __ = ['U', 'C', 'V', 'J', 'G']

  private _fallback_pod: G
  private _fallback_graph: Graph

  private _pod: G

  constructor(system: System) {
    super(
      {
        i: ['pod', 'style', 'disabled', 'fullwindow', 'frame'],
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
      system
    )

    const fallback_graph = new Graph({}, {}, this.__system)
    this._fallback_graph = fallback_graph

    this._fallback_pod = fallback_graph

    this._input.pod.push(this._fallback_pod)

    this._fallback_graph.play()

    this.addListener('_attach', () => {
      if (this.__system) {
        fallback_graph.attach(this.__system)
      } else {
        throw new Error('not attached to system')
      }
    })

    this.addListener('_dettach', () => {
      // TODO
    })
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
