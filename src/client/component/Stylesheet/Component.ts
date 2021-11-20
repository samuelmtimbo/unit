import { Dict } from '../../../types/Dict'
import applyStyle from '../../applyStyle'
import { Element } from '../../element'

export interface Props {
  className?: string
  style?: Dict<string>
  css?: string
}

export default class Stylesheet extends Element<HTMLStyleElement, Props> {
  private _style_el: HTMLStyleElement

  constructor($props: Props) {
    super($props)

    const { className, style = {}, css = '' } = $props

    const style_el = document.createElement('style')
    if (className) {
      style_el.className = className
    }
    if (css) {
      style_el.textContent = css
    }
    applyStyle(style_el, style)

    this._style_el = style_el

    this.$element = style_el
  }

  onPropChanged(prop: string, current: any): void {
    if (prop === 'className') {
      this.$element.className = current
    } else if (prop === 'style') {
      applyStyle(this.$element, current)
    } else if (prop === 'css') {
      this._style_el.textContent = current
    }
  }
}
