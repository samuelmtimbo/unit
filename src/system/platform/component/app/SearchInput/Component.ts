import classnames from '../../../../../client/classnames'
import { Element } from '../../../../../client/element'
import parentElement from '../../../../../client/platform/web/parentElement'
import { COLOR_NONE } from '../../../../../client/theme'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import TextField from '../../value/TextField/Component'

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
  width: '100%',
  color: 'currentColor',
  borderTopWidth: '0',
  borderTopStyle: 'solid',
  borderTopColor: 'currentColor',
  backgroundColor: COLOR_NONE,
  borderRadius: '3px 3px 0 0',
  fontSize: '16px',
  textAlign: 'center',
}

export default class SearchInput extends Element<HTMLDivElement, Props> {
  public _input: TextField

  constructor($props: Props, $system: System) {
    super($props, $system)

    const { className, style, disabled } = this.$props

    const input = new TextField(
      {
        className: classnames('search-input', className),
        style: {
          ...DEFAULT_STYLE,
          ...style,
        },
        maxLength: 30,
        disabled,
        tabIndex: -1,
      },
      this.$system
    )
    this._input = input

    const $element = parentElement($system)

    this.$element = $element
    this.$unbundled = false
    this.$slot = {
      default: input,
    }

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
