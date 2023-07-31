import classnames from '../../../../client/classnames'
import { Element } from '../../../../client/element'
import parentElement from '../../../../client/platform/web/parentElement'
import { getTransform, Zoom, zoomIdentity } from '../../../../client/zoom'
import { System } from '../../../../system'
import { Style } from '../../Props'
import Div from '../Div/Component'
import SVGG from '../svg/Group/Component'
import SVGSVG from '../svg/SVG/Component'

export interface Props {
  className?: string
  style?: Style
  draggable?: boolean
  width?: number
  height?: number
  zoom: Zoom
}

const DEFAULT_STYLE = {
  position: 'absolute',
  width: '0',
  height: '0',
  top: '0',
}

const DEFAULT_WIDTH = 240
const DEFAULT_HEIGHT = 240

export default class Zoom_ extends Element<HTMLDivElement, Props> {
  public _root: Div

  public _html: Div
  public _svg: SVGSVG
  public _svg_g: SVGG

  constructor($props: Props, $system: System) {
    super($props, $system)

    const {
      className,
      style,
      width = DEFAULT_WIDTH,
      height = DEFAULT_HEIGHT,
      draggable,
    } = this.$props

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
      this.$system
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
      this.$system
    )
    zoom.registerParentRoot(svg)
    this._svg = svg

    const svg_g = new SVGG({ style: { width: '0', height: '0' } }, this.$system)
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
      this.$system
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
    this.$unbundled = false
    this.$primitive = true

    this.setSubComponents({
      zoom,
      html,
      svg,
      svg_g,
    })

    this.registerRoot(zoom)

    this._transform()
  }

  private _transform = () => {
    const { zoom = zoomIdentity } = this.$props

    const transform = getTransform(zoom)

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
      this._svg.$element.style.width = `${current}px`
    } else if (prop === 'height') {
      this._svg.$element.style.height = `${current}px`
    } else if (prop === 'draggable') {
      this._root.setProp('draggable', current)
    }
  }
}
