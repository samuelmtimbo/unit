import { Element } from '../../../../client/element'
import { htmlPropHandler, PropHandler } from '../../../../client/propHandler'
import { applyDynamicStyle } from '../../../../client/style'
import { System } from '../../../../system'
import { Dict } from '../../../../types/Dict'

export interface Props {
  style?: Dict<string>
  attr?: Dict<string>
}

export default class TableHeader extends Element<HTMLElement, Props> {
  private _prop_handler: PropHandler

  constructor($props: Props, $system: System) {
    super($props, $system)

    const { style, attr = {} } = this.$props

    this.$element = this.$system.api.document.createElement('th')

    if (attr !== undefined) {
      for (const key in attr) {
        const a = attr[key]

        this.$element.setAttribute(key, a)
      }
    }

    applyDynamicStyle(this, this.$element, style)

    this._prop_handler = {
      ...htmlPropHandler(this, this.$element, {}),
    }
  }

  onPropChanged(prop: string, current: any): void {
    this._prop_handler[prop](current)
  }
}
