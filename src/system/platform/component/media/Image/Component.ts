import applyStyle from '../../../../../client/applyStyle'
import { Element } from '../../../../../client/element'
import { Dict } from '../../../../../types/Dict'

export interface Props {
  className?: string
  style?: Dict<string>
  src?: string
}

export const DEFAULT_STYLE = {
  display: 'block',
  'max-width': '100%',
  'max-height': '100%',
  width: '100%',
  height: '100%',
  'object-fit': 'contain',
}

export const NO_IMAGE =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

export default class Image extends Element<HTMLImageElement, Props> {
  private _img_el: HTMLImageElement

  constructor($props: Props) {
    super($props)

    const { className, style = {}, src = NO_IMAGE } = this.$props

    const img_el = document.createElement('img')

    if (className) {
      img_el.className = className
    }
    applyStyle(img_el, { ...DEFAULT_STYLE, ...style })
    if (src !== undefined) {
      img_el.src = src
    }
    img_el.addEventListener('error', () => {
      img_el.src = NO_IMAGE
    })
    this._img_el = img_el

    this.$element = img_el
  }

  onPropChanged(prop: string, current: any): void {
    if (prop === 'className') {
      this._img_el.className = current
    } else if (prop === 'style') {
      applyStyle(this._img_el, { ...DEFAULT_STYLE, ...current })
    } else if (prop === 'src') {
      this._img_el.src = current || NO_IMAGE
    }
  }
}
