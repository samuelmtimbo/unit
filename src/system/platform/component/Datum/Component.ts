import { Element } from '../../../../client/element'
import parentElement from '../../../../client/platform/web/parentElement'
import { getTree } from '../../../../spec/parser'
import { stringify } from '../../../../spec/stringify'
import { System } from '../../../../system'
import { Dict } from '../../../../types/Dict'
import Datum from '../app/Datum/Component'

export interface Props {
  style?: Dict<string>
  value?: any
}

export default class _Datum extends Element<HTMLDivElement, Props> {
  private _datum: Datum

  constructor($props: Props, $system: System) {
    super($props, $system)

    const { style, value = '' } = this.$props

    const data = getTree(value)

    const datum = new Datum(
      {
        style,
        data,
      },
      this.$system
    )
    this._datum = datum

    const $element = parentElement($system)

    this.$element = $element
    this.$unbundled = false
    this.$primitive = true

    this.setSubComponents({
      datum,
    })

    this.appendRoot(datum)
  }

  onPropChanged(prop: string, current: any): void {
    if (prop === 'value') {
      if (current) {
        const _value = stringify(current)
        const data = getTree(_value)
        this._datum.setProp('data', data)
      } else {
        this._datum.setProp('data', getTree(''))
      }
    } else if (prop === 'style') {
      this._datum.setProp('style', current)
    }
  }
}
