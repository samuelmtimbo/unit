import { Element } from '../../../../client/element'
import { htmlPropHandler, PropHandler } from '../../../../client/propHandler'
import { renderGraph } from '../../../../client/render/renderGraph'
import applyStyle from '../../../../client/style'
import { System } from '../../../../system'
import { Dict } from '../../../../types/Dict'
import { IHTMLDivElement } from '../../../../types/global/dom'
import { $Graph } from '../../../../types/interface/async/$Graph'
import { Unlisten } from '../../../../types/Unlisten'
import { removeChildren } from '../../../../util/element'

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
  private _prop_handler: PropHandler

  private _unlisten: Unlisten

  constructor($props: Props, $system: System) {
    super($props, $system)

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

    this.$element = this.$system.api.document.createElement('div')

    if (id !== undefined) {
      this.$element.id = id
    }
    if (className !== undefined) {
      this.$element.className = className
    }
    applyStyle(this.$element, { ...DEFAULT_STYLE, ...style })
    if (innerText) {
      this.$element.innerText = innerText
    }
    if (tabIndex !== undefined) {
      this.$element.tabIndex = tabIndex
    }
    if (title) {
      this.$element.title = title
    }
    if (draggable !== undefined) {
      this.$element.setAttribute('draggable', draggable.toString())
    }
    if (data !== undefined) {
      for (const key in data) {
        const d = data[key]
        this.$element.dataset[key] = d
      }
    }

    this._prop_handler = {
      ...htmlPropHandler(this, DEFAULT_STYLE),
      graph: (graph: $Graph) => {
        if (graph) {
          this._unlisten = renderGraph(this.$element, this.$system, graph)
        } else {
          if (this._unlisten) {
            this._unlisten()
            this._unlisten = undefined
          }

          removeChildren(this.$element)
        }
      },
    }
  }

  onPropChanged(prop: string, current: any): void {
    this._prop_handler[prop](current)
  }
}
