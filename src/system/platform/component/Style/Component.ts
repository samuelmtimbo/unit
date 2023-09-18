import { Element } from '../../../../client/element'
import { htmlPropHandler, PropHandler } from '../../../../client/propHandler'
import { System } from '../../../../system'
import { Dict } from '../../../../types/Dict'

export interface Props {
  id?: string
  attr?: Dict<string>
}

const DEFAULT_STYLE = {}

export default class Style_ extends Element<HTMLStyleElement, Props> {
  private _prop_handler: PropHandler

  constructor($props: Props, $system: System) {
    super($props, $system)

    const { id, attr = {} } = this.$props

    this.$element = this.$system.api.document.createElement('style')

    if (id !== undefined) {
      this.$element.id = id
    }

    this._prop_handler = {
      ...htmlPropHandler(this, this.$element, DEFAULT_STYLE),
      value: (current: string) => {
        this.$element.innerHTML = current
      },
    }
  }

  onPropChanged(prop: string, current: any): void {
    this._prop_handler[prop](current)
  }
}
