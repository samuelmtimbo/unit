import { Component } from '../../../../client/component'
import HTMLElement_ from '../../../../client/html'
import {
  $renderComponent,
  renderComponent,
} from '../../../../client/render/renderComponent'
import { System } from '../../../../system'
import { Dict } from '../../../../types/Dict'
import { $Component } from '../../../../types/interface/async/$Component'
import { UCGEE } from '../../../../types/interface/UCGEE'
import { Unlisten } from '../../../../types/Unlisten'

export interface Props {
  component?: $Component
  style?: Dict<string>
  attr?: Dict<string>
}

const DEFAULT_STYLE = {
  width: '100%',
  height: '100%',
  color: 'currentColor',
  boxSizing: 'border-box',
}

export default class Render extends HTMLElement_<HTMLDivElement, Props> {
  private _unlisten: Unlisten
  private _component: Component

  public $input = {
    component: UCGEE,
  }

  constructor($props: Props, $system: System) {
    super(
      $props,
      $system,
      $system.api.document.createElement('div'),
      DEFAULT_STYLE,
      {},
      {
        component: (component: $Component) => {
          if (this._unlisten) {
            this._unlisten()

            this._unlisten = undefined
          }

          if (component) {
            this._unlisten = $renderComponent(
              this.$system,
              this.$context,
              this.$element,
              component,
              (component_) => {
                this._component = component_
              }
            )
          }
        },
      }
    )
  }

  onUnmount(): void {
    if (this._unlisten) {
      this._unlisten()

      this._unlisten = undefined
    }
  }

  onMount(): void {
    if (this._unlisten) {
      this._unlisten()

      this._unlisten = undefined
    }

    if (this._component) {
      this._unlisten = renderComponent(
        this.$system,
        this.$context,
        this.$element,
        this._component
      )
    }
  }

  focus() {
    if (this._component) {
      this._component.focus()

      return
    }

    const child = this.$element.childNodes.item(0) as HTMLElement

    if (child) {
      child.focus()
    }
  }
}
