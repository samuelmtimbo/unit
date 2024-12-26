import HTMLElement_ from '../../../../client/html'
import { renderComponent } from '../../../../client/render/renderComponent'
import { System } from '../../../../system'
import { Dict } from '../../../../types/Dict'
import { $Component } from '../../../../types/interface/async/$Component'
import { Unlisten } from '../../../../types/Unlisten'
import { removeChildren } from '../../../../util/element'

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

  public $input = {
    component: ['C'],
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
    )
  }
}
