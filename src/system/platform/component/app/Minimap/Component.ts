import namespaceURI from '../../../../../client/component/namespaceURI'
import { Element } from '../../../../../client/element'
import { segmentLinkId } from '../../../../../client/id'
import parentElement from '../../../../../client/platform/web/parentElement'
import { COLOR_NONE } from '../../../../../client/theme'
import {
  describeCircle,
  describeRect,
  oppositeVector,
  pointInNode,
  Size,
  Thing,
  unitVector,
} from '../../../../../client/util/geometry'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import { isEmptyObject } from '../../../../../util/object'
import SVGG from '../../svg/G/Component'
import SVGPath from '../../svg/Path/Component'
import SVGSVG from '../../svg/SVG/Component'

const MINIMAP_AREA = 180 * 180

export const getMinimapSize = ($width: number, $height: number): Size => {
  const screen_ratio: number = $width / $height
  const width = Math.sqrt(MINIMAP_AREA * screen_ratio)
  const height = Math.sqrt(MINIMAP_AREA / screen_ratio)
  return { width, height }
}

export interface Props {
  width: number
  height: number
  nodes?: Dict<Thing>
  links?: Dict<any>
  style?: Dict<string>
  padding?: number
}

export const DEFAULT_STYLE = {}

export const MINIMAP_WIDTH = 200
export const MINIMAP_HEIGHT = 150

export default class Minimap extends Element<HTMLDivElement, Props> {
  public _map_el: SVGSVG
  private _map_graph: SVGG
  private _map_children: SVGG

  private _node_component: Dict<SVGPath> = {}
  private _link_el: Dict<SVGLineElement> = {}

  public _min_x: number = 1000000
  public _max_x: number = -1000000
  public _min_y: number = 1000000
  public _max_y: number = -1000000

  public _width: number
  public _height: number

  constructor($props: Props, $system: System, $pod: Pod) {
    super($props, $system, $pod)

    const { style, width, height } = $props

    const map_graph = new SVGG(
      { className: 'minimap-graph' },
      this.$system,
      this.$pod
    )
    this._map_graph = map_graph

    // TODO bring "minimap screen" to minimap
    const map_children = new SVGG(
      { className: 'minimap-children' },
      this.$system,
      this.$pod
    )
    this._map_children = map_children

    const svg = new SVGSVG(
      {
        className: 'minimap',
        width,
        height,
        style: {
          ...DEFAULT_STYLE,
          ...style,
        },
        viewBox: '0 0 0 0',
        tabIndex: -1,
      },
      this.$system,
      this.$pod
    )
    svg.preventDefault('mousedown')
    svg.preventDefault('touchdown')
    this._map_el = svg

    this.tick()

    const $element = parentElement($system)

    this.$element = $element
    this.$slot = map_children.$slot
    this.$subComponent = {
      svg,
      map_graph,
      map_children,
    }
    this.$unbundled = false

    this.registerRoot(svg)

    svg.registerParentRoot(map_graph)
    svg.registerParentRoot(map_children)

    svg.$element.onfocus = () => {
      console.log('Minimap', 'onFocus')
    }
  }

  onPropChanged(prop: string, current: any): void {
    // console.log('Minimap', 'onPropChanged', prop, current)
    if (prop === 'style') {
      this._map_el.setProp('style', {
        ...DEFAULT_STYLE,
        ...current,
      })
    }
  }

  public tick(): void {
    const { nodes = {}, links = {}, padding = 0 } = this.$props

    for (let node_id in this._node_component) {
      if (!nodes[node_id]) {
        const node_el = this._node_component[node_id]
        this._map_graph.$element.removeChild(node_el.$element)
        delete this._node_component[node_id]
      }
    }

    for (let link_id in this._link_el) {
      if (!links[link_id]) {
        const link_el = this._link_el[link_id]
        this._map_graph.$element.removeChild(link_el)
        delete this._link_el[link_id]
      }
    }

    if (isEmptyObject(nodes)) {
      return
    }

    let min_x = Number.MAX_SAFE_INTEGER
    let max_x = Number.MIN_SAFE_INTEGER
    let min_y = Number.MAX_SAFE_INTEGER
    let max_y = Number.MIN_SAFE_INTEGER

    for (let node_id in nodes) {
      const node = nodes[node_id]
      const { x, y, width, height, r, shape } = node

      min_x = Math.min(min_x, x - width / 2)
      max_x = Math.max(max_x, x + width / 2)
      min_y = Math.min(min_y, y - height / 2)
      max_y = Math.max(max_y, y + height / 2)

      let node_component = this._node_component[node_id]

      if (!node_component) {
        node_component = new SVGPath(
          {
            style: {
              fill: COLOR_NONE,
              pointerEvents: 'none',
              strokeWidth: 'inherit',
            },
          },
          this.$system,
          this.$pod
        )

        this._node_component[node_id] = node_component

        this._map_graph.appendChild(node_component)
      }

      const d =
        shape === 'circle'
          ? describeCircle(x, y, r)
          : describeRect(x - width / 2, y - height / 2, width, height)

      node_component.setProp('d', d)
    }

    for (let link_id in links) {
      const { source, target } = segmentLinkId(link_id)
      let link_el = this._link_el[link_id]
      if (!link_el) {
        link_el = this.$system.api.document.createElementNS(
          namespaceURI,
          'line'
        )
        // link_el.setAttribute('stroke', 'currentColor')
        link_el.style.pointerEvents = 'none'
        this._link_el[link_id] = link_el
        // TODO use Component appendChild
        this._map_graph.$element.appendChild(link_el)
      }
      const sourceNode = nodes[source]
      const targetNode = nodes[target]
      const { x: x0, y: y0 } = sourceNode
      const { x: x1, y: y1 } = targetNode
      const u = unitVector(x0, y0, x1, y1)
      const nu = oppositeVector(u)
      const { x: _x0, y: _y0 } = pointInNode(sourceNode, u)
      const { x: _x1, y: _y1 } = pointInNode(targetNode, nu)
      link_el.setAttribute('x1', `${_x0}`)
      link_el.setAttribute('y1', `${_y0}`)
      link_el.setAttribute('x2', `${_x1}`)
      link_el.setAttribute('y2', `${_y1}`)
    }

    min_x -= padding
    min_y -= padding
    max_x += padding
    max_y += padding

    const width = max_x - min_x
    const height = max_y - min_y

    this._min_x = min_x
    this._min_y = min_y
    this._max_x = max_x
    this._max_y = max_y
    this._width = width
    this._height = height

    const strokeWidth = width / MINIMAP_WIDTH + height / MINIMAP_HEIGHT

    this._map_el.setProp('strokeWidth', strokeWidth)
    this._map_el.setProp('viewBox', `${min_x} ${min_y} ${width} ${height}`)
  }
}
