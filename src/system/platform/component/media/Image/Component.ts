import { Element } from '../../../../../client/element'
import { applyStyle } from '../../../../../client/style'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'

export interface Props {
  className?: string
  style?: Dict<string>
  src?: string
}

export const DEFAULT_STYLE = {
  display: 'block',
  width: '100%',
  height: '100%',
  'object-fit': 'contain',
}

export default class Image_ extends Element<HTMLImageElement, Props> {
  private _img_el: HTMLImageElement

  constructor($props: Props, $system: System, $element?: HTMLImageElement) {
    super($props, $system)

    const { className, style = {}, src } = this.$props

    const img_el = $element ?? this.$system.api.document.createElement('img')

    if (className) {
      img_el.className = className
    }
    applyStyle(img_el, { ...DEFAULT_STYLE, ...style })
    if (src !== undefined) {
      img_el.src = src
    }
    img_el.draggable = false
    this._img_el = img_el

    this.$element = img_el
  }

  onPropChanged(prop: string, current: any): void {
    if (prop === 'className') {
      this._img_el.className = current
    } else if (prop === 'style') {
      applyStyle(this._img_el, { ...DEFAULT_STYLE, ...current })
    } else if (prop === 'src') {
      this._img_el.src = current
    }
  }
}
