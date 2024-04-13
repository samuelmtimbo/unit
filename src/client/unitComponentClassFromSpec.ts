import { graphFromSpec } from '../spec/fromSpec'
import { forEachGraphSpecPinOfType } from '../spec/util/spec'
import { GraphSpec } from '../types/GraphSpec'
import { $Component } from '../types/interface/async/$Component'
import { $Graph } from '../types/interface/async/$Graph'
import { AsyncGraph } from '../types/interface/async/AsyncGraph'
import { IOElement } from './IOElement'
import { Component } from './component'
import { componentClassFromSpec } from './componentClassFromSpec'

export function localComponentClassFromSpec<
  E extends IOElement = any,
  P = any,
  U extends $Component | $Graph = any,
>(spec: GraphSpec): typeof Component<E, P, U> {
  const Class = componentClassFromSpec(spec as GraphSpec, {}, {})

  return class Component_ extends Class {
    constructor($props, $system, $element?) {
      super($props, $system, $element)

      const graph = graphFromSpec($system, spec, $system.specs)

      for (const pinId in $props) {
        const data = $props[pinId]

        graph.setPinData('input', pinId, data)
      }

      forEachGraphSpecPinOfType(spec, 'output', (outputId) => {
        const output = graph.getOutput(outputId)

        output.addListener('data', (data) => {
          this.$output[outputId] = data

          this.dispatchEvent(outputId, data)
        })
        output.addListener('drop', () => {
          delete this.$output[outputId]
        })
      })

      const $graph = AsyncGraph(graph)

      this.connect($graph)

      graph.play()
    }
  }
}
