import Datum from '../../../../client/component/Datum/Component'
import { Element } from '../../../../client/element'
import parentElement from '../../../../client/parentElement'
import { getTree } from '../../../../spec/parser'
import { stringify } from '../../../../spec/stringify'
import { Dict } from '../../../../types/Dict'

export interface Props {
  style?: Dict<string>
  value?: any
}

export default class _Datum extends Element<HTMLDivElement, Props> {
  private _datum: Datum

  constructor($props: Props) {
    super($props)

    const { style, value = '' } = this.$props

    const data = getTree(value)

    const datum = new Datum({
      style,
      data,
    })
    this._datum = datum

    const $element = parentElement()

    this.$element = $element
    this.$subComponent = {
      datum,
    }
    this.$unbundled = false

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
