import { Element } from '../../../../../Class/Element/Element'
import { Graph } from '../../../../../Class/Graph'
import { Config } from '../../../../../Class/Unit/Config'
import { Dict } from '../../../../../types/Dict'

export interface I<T> {
  style: Dict<string>
  pod: Graph
  disabled: boolean
  fullwindow: boolean
  frame: Element
}

export interface O<T> {}

export default class _Graph<T> extends Element<I<T>, O<T>> {
  _ = ['U', 'C', 'V', 'J', 'G']

  private _fallback_pod: Graph

  private _pod: Graph

  constructor(config?: Config) {
    super(
      {
        i: ['pod', 'style', 'disabled', 'fullwindow', 'frame'],
        o: ['pod'],
      },
      config,
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
      }
    )

    const fallback_graph = new Graph({})
    fallback_graph.play()
    this._fallback_pod = fallback_graph

    this._input.pod.push(this._fallback_pod)
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
