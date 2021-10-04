import TextInput from '../../../system/platform/component/value/TextInput/Component'
import { Dict } from '../../../types/Dict'
import classnames from '../../classnames'
import { Element } from '../../element'
import parentElement from '../../parentElement'
import { NONE } from '../../theme'

export interface Props {
  className?: string
  style?: Dict<any>
  value?: string
  disabled?: boolean
  maxLength?: number
}

const HEIGHT: number = 39

const DEFAULT_STYLE = {
  height: `${HEIGHT}px`,
  width: '309px',
  color: 'currentColor',
  borderTopWidth: '0',
  borderTopStyle: 'solid',
  borderTopColor: 'currentColor',
  backgroundColor: NONE,
  borderRadius: '3px 3px 0 0',
  fontSize: '16px',
  textAlign: 'center',
}

export default class SearchInput extends Element<HTMLDivElement, Props> {
  public _input: TextInput

  constructor($props: Props) {
    super($props)

    const { className, style, disabled } = this.$props

    const input = new TextInput({
      className: classnames('search-input', className),
      style: {
        ...DEFAULT_STYLE,
        ...style,
      },
      maxLength: 30,
      disabled,
      tabIndex: -1,
    })
    this._input = input

    const $element = parentElement()

    this.$element = $element
    this.$slot['default'] = input.$slot['default']

    this.registerRoot(input)
  }

  onPropChanged(prop: string, current: any) {
    if (prop === 'style') {
      this._input.setProp('style', { ...DEFAULT_STYLE, ...current })
    } else if (prop === 'disabled') {
      this._input.setProp('disabled', current)
    } else if (prop === 'tabIndex') {
      this._input.setProp('tabIndex', current)
    } else if (prop === 'value') {
      this._input.setProp('value', current)
    }
  }

  setSelectionRange(
    start: number,
    end: number,
    direction?: 'forward' | 'backward' | 'none' | undefined
  ) {
    this._input.setSelectionRange(start, end, direction)
  }
}
