import { $PO } from '../../../../async/$PO'
import applyStyle from '../../../../client/applyStyle'
import { Element } from '../../../../client/element'
import { renderPod } from '../../../../client/render/renderPod'
import { Dict } from '../../../../types/Dict'
import { Unlisten } from '../../../../Unlisten'
import { _removeChildren } from '../../../../util/element'
import { basePropHandler, PropHandler } from '../propHandler'

export interface Props {
  pod?: $PO
  id?: string
  className?: string
  style?: Dict<string>
  innerText?: string
  tabIndex?: number
  title?: string
  draggable?: boolean
  data?: Dict<string> // TODO
}

const DEFAULT_STYLE = {
  width: '100%',
  height: '100%',
  color: 'currentColor',
  boxSizing: 'border-box',
}

export default class Render extends Element<HTMLDivElement, Props> {
  private _div_el: HTMLDivElement

  private _prop_handler: PropHandler

  private _unlisten: Unlisten

  constructor($props: Props) {
    super($props)

    const {
      pod,
      id,
      className,
      style,
      innerText,
      tabIndex,
      title,
      draggable,
      data = {},
    } = this.$props

    const $element = document.createElement('div')

    if (id !== undefined) {
      $element.id = id
    }
    if (className !== undefined) {
      $element.className = className
    }
    applyStyle($element, { ...DEFAULT_STYLE, ...style })
    if (innerText) {
      $element.innerText = innerText
    }
    if (tabIndex !== undefined) {
      $element.tabIndex = tabIndex
    }
    if (title) {
      $element.title = title
    }
    if (draggable !== undefined) {
      $element.setAttribute('draggable', draggable.toString())
    }
    if (data !== undefined) {
      for (const key in data) {
        const d = data[key]
        $element.dataset[key] = d
      }
    }

    this._div_el = $element

    this._prop_handler = {
      ...basePropHandler(this._div_el, DEFAULT_STYLE),
      pod: (pod: $PO) => {
        if (pod) {
          this._unlisten = renderPod(this.$system, this._div_el, pod)
        } else {
          if (this._unlisten) {
            this._unlisten()
            this._unlisten = undefined
          }
          _removeChildren(this._div_el)
        }
      },
    }

    this.$element = $element
  }

  onPropChanged(prop: string, current: any): void {
    this._prop_handler[prop](current)
  }
}
