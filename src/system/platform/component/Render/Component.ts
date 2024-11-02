import HTMLElement_ from '../../../../client/html'
import { renderComponent } from '../../../../client/render/renderComponent'
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
  data?: Dict<string>
}

const DEFAULT_STYLE = {
  width: '100%',
  height: '100%',
  color: 'currentColor',
  boxSizing: 'border-box',
}

export default class Render extends HTMLElement_<HTMLDivElement, Props> {
  private _unlisten: Unlisten

  constructor($props: Props, $system: System) {
    super(
      $props,
      $system,
      $system.api.document.createElement('div'),
      DEFAULT_STYLE
    )

    const { component, id, className, innerText, tabIndex, title, draggable } =
      this.$props

    if (id !== undefined) {
      this.$element.id = id
    }
    if (className !== undefined) {
      this.$element.className = className
    }
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

    this.$propHandler = {
      ...this.$propHandler,
      unit: (component: $Component) => {
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
}
