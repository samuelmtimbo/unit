import applyStyle from '../../../../client/applyStyle'
import { Element } from '../../../../client/element'
import { htmlPropHandler, PropHandler } from '../../../../client/propHandler'
import { renderGraph } from '../../../../client/render/renderPod'
import { $Graph } from '../../../../types/interface/async/$Graph'
import { $P } from '../../../../types/interface/async/$P'
import { Pod } from '../../../../pod'
import { System } from '../../../../system'
import { Dict } from '../../../../types/Dict'
import { IHTMLDivElement } from '../../../../types/global/dom'
import { Unlisten } from '../../../../types/Unlisten'
import { _removeChildren } from '../../../../util/element'

export interface Props {
  graph?: $Graph
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

export default class Render extends Element<IHTMLDivElement, Props> {
  private _div_el: IHTMLDivElement

  private _prop_handler: PropHandler

  private _unlisten: Unlisten

  constructor($props: Props, $system: System, $pod: Pod) {
    super($props, $system, $pod)

    const {
      graph,
      id,
      className,
      style,
      innerText,
      tabIndex,
      title,
      draggable,
      data = {},
    } = this.$props

    const $element = this.$system.api.document.createElement('div')

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
      ...htmlPropHandler(this._div_el, DEFAULT_STYLE),
      pod: (pod: $P) => {
        if (pod) {
          this._unlisten = renderGraph(
            this._div_el,
            this.$system,
            this.$pod,
            graph
          )
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
