import applyStyle from '../../../../client/applyStyle'
import { Element } from '../../../../client/element'
import { System } from '../../../../system'
import { Dict } from '../../../../types/Dict'

export interface Props {
  id?: string
  className?: string
  style?: Dict<string>
  src?: string
  srcdoc?: string
}

export const DEFAULT_STYLE = {
  display: 'block',
  width: '100%',
  height: '100%',
  border: 'none',
}

export default class Iframe extends Element<HTMLIFrameElement, Props> {
  private _iframe_el: HTMLIFrameElement

  constructor($props: Props, $system: System) {
    super($props, $system)

    const { id, className, style = {}, src = '', srcdoc } = this.$props

    const iframe_el = document.createElement('iframe')
    this._iframe_el = iframe_el

    if (id !== undefined) {
      iframe_el.id = id
    }
    if (className) {
      iframe_el.className = className
    }
    if (srcdoc !== undefined) {
      iframe_el.srcdoc = srcdoc
    }
    iframe_el.src = src

    // @ts-ignore
    iframe_el.allowTransparency = 'true'

    applyStyle(iframe_el, { ...DEFAULT_STYLE, ...style })

    this.$element = iframe_el
  }

  onPropChanged(prop: string, current: any): void {
    if (prop === 'className') {
      this._iframe_el.className = current
    } else if (prop === 'style') {
      applyStyle(this._iframe_el, { ...DEFAULT_STYLE, ...current })
    } else if (prop === 'src') {
      this._iframe_el.src = current || ''
    } else if (prop === 'srcdoc') {
      this._iframe_el.srcdoc = current || ''
    }
  }
}
