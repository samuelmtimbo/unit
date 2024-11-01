import { Element } from '../../../../../client/element'
import { htmlPropHandler, PropHandler } from '../../../../../client/propHandler'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'

export interface Props {
  className?: string
  style?: Dict<any>
  value?: string
  disabled?: boolean
}

export default class Option extends Element<HTMLOptionElement, Props> {
  private _prop_handler: PropHandler

  constructor($props: Props, $system: System) {
    super($props, $system, $system.api.document.createElement('option'))

    const DEFAULT_STYLE = $system.style['option']

    this._prop_handler = {
      ...htmlPropHandler(this, this.$element, DEFAULT_STYLE),
      value: (current) => {
        this.$element.value = current
      },
    }
  }

  onPropChanged<K extends keyof Props>(prop: K, current: any): void {
    this._prop_handler[prop](current)
  }
}
