import { getSpecRadius } from '../../../../../client/complexity'
import mergeProps from '../../../../../client/component/mergeProps'
import { Element } from '../../../../../client/element'
import { getLinkId, segmentLinkId } from '../../../../../client/id'
import parentElement from '../../../../../client/platform/web/parentElement'
import { SimNode, Simulation } from '../../../../../client/simulation'
import { getSpec, injectSpecs, isComponent } from '../../../../../client/spec'
import { Shape, surfaceDistance } from '../../../../../client/util/geometry'
import { LINK_DISTANCE } from '../../../../../constant/LINK_DISTANCE'
import { Pod } from '../../../../../pod'
import { emptyGraphSpec } from '../../../../../spec/emptySpec'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import { mapObjVK } from '../../../../../util/object'
import { BundleSpec } from '../../../method/process/BundleSpec'
import { NOT_SUBGRAPH_MAX_D, SUBGRAPH_MAX_D } from '../Graph/Component'
import Minimap from '../Minimap/Component'

export interface Props {
  width: number
  height: number
  bundle: BundleSpec
  className?: string
  style?: Dict<string>
}

export const DEFAULT_STYLE = {}

export default class Mingraph extends Element<HTMLDivElement, Props> {
  public _minimap: Minimap

  public _nodes: Dict<SimNode<any>> = {}
  private _links: Dict<number> = {}

  private _subgraph_to_node_id: Set<string>[] = []
  private _node_id_to_subgraph: Dict<number> = {}

  private _simulation: Simulation

  constructor($props: Props, $system: System, $pod: Pod) {
    super($props, $system, $pod)

    const { width, height } = this.$props

    const minimap = new Minimap(
      {
        width,
        height,
        style: {},
        nodes: {},
        links: {},
        padding: LINK_DISTANCE,
      },
      this.$system,
      this.$pod
    )
    this._minimap = minimap

    const simulation = new Simulation({
      force: this._force,
    })
    simulation.addListener('tick', this._tick)
    this._simulation = simulation

    const $element = parentElement($system)

    this.$element = $element

    this.registerRoot(minimap)

    this._reset()
  }

  onPropChanged(prop: string, current: any): void {
    if (prop === 'bundle') {
      this._reset()
    } else if (prop === 'style') {
      this._minimap.setProp('style', { ...DEFAULT_STYLE, ...current })
    }
  }

  private _force = (alpha: number) => {
    const node_entries = Object.entries(this._nodes)
    const node_n = node_entries.length

    for (let i = 0; i < node_n; i++) {
      const [a_id, a] = node_entries[i]

      const a_subgraph = this._node_id_to_subgraph[a_id]

      for (let j = i + 1; j < node_n; j++) {
        const [b_id, b] = node_entries[j]

        const b_subgraph = this._node_id_to_subgraph[b_id]

        let { l, u } = surfaceDistance(a, b)
        l = Math.max(l, 1)

        const same_subgraph = a_subgraph === b_subgraph

        const D = same_subgraph ? SUBGRAPH_MAX_D : NOT_SUBGRAPH_MAX_D

        if (l < D) {
          const k = (-90 * alpha) / l
          b.vx -= u.x * k
          b.vy -= u.y * k
          a.vx += u.x * k
          a.vy += u.y * k
        }
      }

      a.y -= (a.y * alpha) / 6
    }

    const link_entries = Object.entries(this._links)
    const link_n = link_entries.length

    for (let i = 0; i < link_n; i++) {
      const [link_id] = link_entries[i]
      const { source, target } = segmentLinkId(link_id)
      const a = this._nodes[source]
      const b = this._nodes[target]

      let { l, d } = surfaceDistance(b, a)
      l = Math.max(l, 1)
      d = Math.max(d, 1)

      const tl = LINK_DISTANCE

      const ax = a.x
      const bx = b.x
      const ay = a.y
      const by = b.y

      const k = alpha / d
      const ll = (l - tl) * k

      const x = (bx - ax) * ll
      const y = (by - ay) * ll

      b.vx -= x
      b.vy -= y
      a.vx += x
      a.vy += y

      const my = (ay + by) / 2

      b.vy += ((my - by) * alpha) / 3
      a.vy += ((my - ay) * alpha) / 3
    }
  }

  private _tick = () => {
    // console.log('Minigraph', '_tick')
    this._minimap.tick()
  }

  private _node_count: number = 0

  private _reset = (): void => {
    // console.log('Minigraph', '_render')
    const { specs } = this.$system

    const { bundle } = this.$props

    const { spec: spec = emptyGraphSpec, specs: _specs } = bundle

    const map_spec_id: Dict<string> = injectSpecs(specs, _specs)

    const { units = {}, merges } = spec

    const nodes: Dict<SimNode<any>> = mapObjVK(units, (unit_spec, unit_id) => {
      this._node_count++

      const { id, metadata = {} } = unit_spec

      const { position = { x: 0, y: 0 }, component = {} } = metadata

      const { x, y } = position

      let r = getSpecRadius(specs, id, true)
      let width = 2 * r
      let height = 2 * r

      const is_component = isComponent(specs, id)

      if (is_component) {
        const { width: _width, height: _height } = component
        const spec = getSpec(specs, id)
        const { component: _component = {} } = spec
        const { defaultWidth, defaultHeight } = _component
        width = _width ?? defaultWidth ?? 120
        height = _height ?? defaultHeight ?? 120
      }

      const shape: Shape = is_component ? 'rect' : 'circle'

      return {
        _x: x,
        _y: y,
        ax: 0,
        ay: 0,
        x,
        y,
        fx: undefined,
        fy: undefined,
        shape,
        r,
        width,
        height,
        vx: 0,
        vy: 0,
        hx: 0,
        hy: 0,
      }
    })

    const links: Dict<number> = {}

    const subgraph_to_node_id: Set<string>[] = []
    const node_id_to_subgraph: Dict<number> = {}

    for (const merge_id in merges) {
      const merge = merges[merge_id]

      const merge_input_unit: Dict<boolean> = {}
      const merge_output_unit: Dict<boolean> = {}

      for (let unit_id in merge) {
        const unit = merge[unit_id]
        const { input = {}, output = {} } = unit
        if (Object.keys(input).length > 0) {
          merge_input_unit[unit_id] = true
        }
        if (Object.keys(output).length > 0) {
          merge_output_unit[unit_id] = true
        }
      }

      for (let input_unit_id in merge_input_unit) {
        let input_unit_sub_graph_id = node_id_to_subgraph[input_unit_id]
        let input_unit_subgraph = subgraph_to_node_id[input_unit_sub_graph_id]
        for (let output_unit_id in merge_output_unit) {
          let output_unit_sub_graph_id = node_id_to_subgraph[output_unit_id]
          let output_unit_subgraph =
            subgraph_to_node_id[output_unit_sub_graph_id]

          if (
            input_unit_sub_graph_id !== undefined &&
            output_unit_sub_graph_id !== undefined
          ) {
            if (input_unit_sub_graph_id < output_unit_sub_graph_id) {
              for (const unit_id of output_unit_subgraph) {
                output_unit_subgraph.delete(unit_id)
                input_unit_subgraph.add(unit_id)
                node_id_to_subgraph[unit_id] = input_unit_sub_graph_id
              }
            } else if (input_unit_sub_graph_id > output_unit_sub_graph_id) {
              for (const unit_id of input_unit_subgraph) {
                input_unit_subgraph.delete(unit_id)
                output_unit_subgraph.add(unit_id)
                node_id_to_subgraph[unit_id] = output_unit_sub_graph_id
              }
            }
          } else if (input_unit_sub_graph_id !== undefined) {
            input_unit_subgraph.add(output_unit_id)
            node_id_to_subgraph[output_unit_id] = input_unit_sub_graph_id
          } else if (output_unit_sub_graph_id !== undefined) {
            output_unit_subgraph.add(input_unit_id)
            node_id_to_subgraph[input_unit_id] = output_unit_sub_graph_id
          } else {
            const subgraph = new Set<string>()
            subgraph_to_node_id.push(subgraph)
            const subgraph_id = subgraph_to_node_id.length - 1
            subgraph.add(input_unit_id)
            node_id_to_subgraph[input_unit_id] = subgraph_id
            subgraph.add(output_unit_id)
            node_id_to_subgraph[output_unit_id] = subgraph_id

            input_unit_sub_graph_id = subgraph_id
            input_unit_subgraph = subgraph
          }

          const merge_link_id = getLinkId(output_unit_id, input_unit_id)
          links[merge_link_id] = links[merge_link_id] || 0
          links[merge_link_id]++
        }
      }
    }

    this._subgraph_to_node_id = subgraph_to_node_id
    this._node_id_to_subgraph = node_id_to_subgraph

    this._nodes = nodes
    this._links = links

    mergeProps(this._minimap, {
      nodes,
      links,
    })

    this._simulation.nodes(nodes)

    if (this._node_count > 0) {
      this._simulation.start()
    }
  }
}
