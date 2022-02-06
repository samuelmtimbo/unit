import classnames from '../../../../client/classnames'
import { Element } from '../../../../client/element'
import parentElement from '../../../../client/platform/web/parentElement'
import { getTransform, Zoom } from '../../../../client/zoom'
import { Pod } from '../../../../pod'
import { System } from '../../../../system'
import { Dict } from '../../../../types/Dict'
import Div from '../Div/Component'
import SVGG from '../svg/G/Component'
import SVGSVG from '../svg/SVG/Component'

export type _Style = Dict<string>

export interface _Props {
  className?: string
  style?: _Style
  draggable?: boolean
}

export interface Props extends _Props {
  width: number
  height: number
  zoom: Zoom
}

const DEFAULT_STYLE = {
  position: 'absolute',
  width: '0',
  height: '0',
  top: '0',
}

export default class ZoomComponent extends Element<HTMLDivElement, Props> {
  public _root: Div

  public _html: Div
  public _svg: SVGSVG
  public _svg_g: SVGG

  constructor($props: Props, $system: System, $pod: Pod) {
    super($props, $system, $pod)

    const { className, style, width, height, draggable } = this.$props

    const widthStr = `${width}px`
    const heightStr = `${height}px`

    const zoom = new Div(
      {
        className: classnames('zoom', className),
        style: {
          ...DEFAULT_STYLE,
          ...style,
        },
        draggable,
      },
      this.$system,
      this.$pod
    )
    this._root = zoom

    const svg = new SVGSVG(
      {
        className: 'zoom-svg',
        style: {
          width: widthStr,
          height: heightStr,
          position: 'absolute',
          top: '0',
          left: '0',
        },
      },
      this.$system,
      this.$pod
    )
    zoom.registerParentRoot(svg)
    this._svg = svg

    const svg_g = new SVGG(
      { style: { width: '0', height: '0' } },
      this.$system,
      this.$pod
    )
    svg.registerParentRoot(svg_g)
    this._svg_g = svg_g

    const html = new Div(
      {
        className: 'zoom-html',
        style: {
          position: 'absolute',
          width: '0',
          height: '0',
          top: '0',
        },
      },
      this.$system,
      this.$pod
    )
    zoom.registerParentRoot(html)
    this._html = html

    const $element = parentElement($system)

    this.$element = $element
    this.$slot = {
      default: html,
      svg: svg_g,
    }
    this.$slotChildren = {
      default: [],
      svg: [],
    }
    this.$subComponent = {
      zoom,
      svg,
      svg_g,
    }
    this.$unbundled = false

    this.registerRoot(zoom)

    this._transform()
  }

  private _transform = () => {
    const { zoom } = this.$props
    const transform = getTransform(zoom)
    // mergeStyle(this._html, { transform })
    // mergeStyle(this._svg_g, {
    //   transform,
    // })
    this._html.$element.style.transform = transform
    this._svg_g.$element.style.transform = transform
  }

  onPropChanged(prop: string, current: any): void {
    // console.log('Zoom', 'onPropChanged', prop, current)
    if (prop === 'className') {
      this._root.setProp('className', current)
    } else if (prop === 'style') {
      this._root.setProp('style', { ...DEFAULT_STYLE, ...current })
    } else if (prop === 'zoom') {
      this._transform()
    } else if (prop === 'width') {
      // mergeStyle(this._svg, {
      //   width: `${current}px`,
      // })
      this._svg.$element.style.width = `${current}px`
    } else if (prop === 'height') {
      // mergeStyle(this._svg, {
      //   height: `${current}px`,
      // })
      this._svg.$element.style.height = `${current}px`
    } else if (prop === 'draggable') {
      this._root.setProp('draggable', current)
    }
  }
}
