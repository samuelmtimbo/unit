import { Element } from '../../../../client/element'
import { htmlPropHandler, PropHandler } from '../../../../client/propHandler'
import { renderComponent } from '../../../../client/render/renderComponent'
import applyStyle from '../../../../client/style'
import { System } from '../../../../system'
import { Dict } from '../../../../types/Dict'
import { $Component } from '../../../../types/interface/async/$Component'
import { Unlisten } from '../../../../types/Unlisten'
import { removeChildren } from '../../../../util/element'

export interface Props {
  component?: $Component
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
  private _prop_handler: PropHandler

  private _unlisten: Unlisten

  constructor($props: Props, $system: System) {
    super($props, $system)

    const {
      component,
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
      ...htmlPropHandler(this, this.$element, DEFAULT_STYLE),
      component: (component: $Component) => {
        if (this._unlisten) {
          this._unlisten()

          this._unlisten = undefined

          removeChildren(this.$element)
        }

        if (component) {
          this._unlisten = renderComponent(
            this.$element,
            this.$system,
            component
          )
        }
      },
    }
  }

  onPropChanged(prop: string, current: any): void {
    // console.log('Render', 'onPropChanged', prop, current)
    this._prop_handler[prop](current)
  }
}
