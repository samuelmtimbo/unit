// import mergeStyle from '../mergeStyle'
import classnames from '../../../../../client/classnames'
import {
  getLeafWidth,
  LEAF_HEIGHT,
} from '../../../../../client/component/getDatumSize'
import { Element } from '../../../../../client/element'
import { makeBlurListener } from '../../../../../client/event/focus/blur'
import { makeFocusListener } from '../../../../../client/event/focus/focus'
import IOFocusEvent from '../../../../../client/event/focus/FocusEvent'
import { makeInputListener } from '../../../../../client/event/input'
import {
  IOKeyboardEvent,
  makeKeydownListener,
} from '../../../../../client/event/keyboard'
import { makePasteListener } from '../../../../../client/event/paste'
import parentElement from '../../../../../client/platform/web/parentElement'
import { Pod } from '../../../../../pod'
import { TreeNode } from '../../../../../spec/parser'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import TextInput from '../../value/TextInput/Component'

export interface Props {
  className?: string
  style: Dict<string>
  path: number[]
  value: string
  parent: TreeNode | null
}

export default class DataTreeLeaf extends Element<HTMLDivElement, Props> {
  public _input: TextInput

  constructor($props: Props, $system: System, $pod: Pod) {
    super($props, $system, $pod)

    const { className, style, value } = $props

    const width = getLeafWidth(value)
    const height = LEAF_HEIGHT

    const input = new TextInput(
      {
        className: classnames('data-tree-leaf', className),
        style: {
          position: 'relative',
          display: 'flex',
          width: `${width}px`,
          height: `${height}px`,
          caretColor: 'inherit',
          fontSize: '12px',
          overflowY: 'hidden',
          textOverflow: 'ellipsis',
          // ...userSelect('none'),
          ...style,
        },
        value,
      },
      this.$system,
      this.$pod
    )

    this._input = input

    input.addEventListener(makeInputListener(this._on_input))
    input.addEventListener(makeFocusListener(this._on_focus))
    input.addEventListener(makeBlurListener(this._on_blur))
    input.addEventListener(makeKeydownListener(this._on_keydown))
    input.addEventListener(makePasteListener(this._on_paste))
    input.preventDefault('paste')

    const $element = parentElement($system)

    this.$element = $element
    this.$slot = input.$slot
    this.$subComponent = {
      input,
    }
    this.$unbundled = false

    this.registerRoot(input)
  }

  public onPropChanged(prop: string, current: any) {
    if (prop === 'data') {
      const width = getLeafWidth(current.value)
      this._input.setProp('value', current.value)
      // mergeStyle(this._input, {
      //   width: `${width}px`,
      // })
      this._input.$element.style.width = `${width}px`
    }
  }

  private _on_input = (value: string): void => {
    const { path } = this.$props

    const width = getLeafWidth(value)
    // mergeStyle(this._input, {
    //   width: `${width}px`,
    // })
    this._input.$element.style.width = `${width}px`

    this.dispatchEvent('leafinput', {
      value,
      path,
    })
  }

  private _on_keydown = (
    event: IOKeyboardEvent,
    _event: KeyboardEvent
  ): void => {
    // console.log('DataLeaf', '_on_keydown')
    const { path } = this.$props
    const { value } = this._input.$element
    // TODO `getSelectionStart`
    const { selectionStart } = this._input.$element
    this.dispatchEvent(
      'leafkeydown',
      {
        value,
        path,
        event,
        _event,
        selectionStart,
      },
      true
    )
  }

  private _on_focus = (event: IOFocusEvent, _event: FocusEvent): void => {
    const { path, value } = this.$props

    this.dispatchEvent('leaffocus', { path, value, event, _event })
  }

  private _on_blur = (event: IOFocusEvent, _event: FocusEvent): void => {
    const { path, value } = this.$props

    this.dispatchEvent('leafblur', { path, value, event, _event })
  }

  private _on_paste = (text): void => {
    // console.log('Leaf', '_on_paste')
    const { path, value } = this.$props
    this.dispatchEvent('leafpaste', { path, value, text })
  }

  public focus = (options?: FocusOptions | undefined) => {
    this._input.$element.focus(options)
  }

  public blur = () => {
    this._input.$element.blur()
  }

  setSelectionRange(
    start: number,
    end: number,
    direction?: 'forward' | 'backward' | 'none' | undefined
  ) {
    this._input.setSelectionRange(start, end, direction)
  }
}
