import { addListener } from '../../../../../client/addListener'
import { Context } from '../../../../../client/context'
import { Element } from '../../../../../client/element'
import { makeCustomListener } from '../../../../../client/event/custom'
import { IOFocusEvent } from '../../../../../client/event/focus/FocusEvent'
import { IOKeyboardEvent } from '../../../../../client/event/keyboard'
import { makeResizeListener } from '../../../../../client/event/resize'
import { parentElement } from '../../../../../client/platform/web/parentElement'
import { parseFontSize } from '../../../../../client/util/style/getFontSize'
import { _evaluate } from '../../../../../spec/evaluate'
import {
  TreeNode,
  TreeNodeType,
  _getLastLeafPath,
  _getNodeAtPath,
  _getParent,
  _removeNodeAt,
  _updateNodeAt,
  getParentPath,
  getTree,
} from '../../../../../spec/parser'
import { stringify } from '../../../../../spec/stringify'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import { Unlisten } from '../../../../../types/Unlisten'
import { _keyUpdateTree } from '../../../../../util/keyUpdateTree'
import isEqual from '../../../../f/comparison/Equals/f'
import Div from '../../Div/Component'
import DataTree from '../DataTree/Component'

export interface Props {
  style: Dict<string>
  data: TreeNode
}

export interface _Props {
  style: Dict<string>
  value: any
}

export class Datum extends Element<HTMLDivElement, Props> {
  public _data_tree: DataTree
  public _root: TreeNode

  private _ignore_blur: boolean = false

  constructor($props: Props, $system: System) {
    super($props, $system)

    const { style = {}, data = getTree('') } = $props

    const $element = parentElement($system)

    this.$element = $element

    const fontSize = this._getFontSize()

    const data_tree = new DataTree(
      {
        style: { ...style, fontSize: `${fontSize}px` },
        data,
        path: [],
        parent: null,
        fontSize,
      },
      this.$system
    )

    this._root = data

    this._data_tree = data_tree

    this._data_tree.addEventListener(
      makeCustomListener('leafkeydown', this._onLeafKeyDown)
    )
    this._data_tree.addEventListener(
      makeCustomListener('leafinput', this._onLeafInput)
    )
    this._data_tree.addEventListener(
      makeCustomListener('leaffocus', this._onLeafFocus)
    )
    this._data_tree.addEventListener(
      makeCustomListener('leafblur', this._onLeafBlur)
    )
    this._data_tree.addEventListener(
      makeCustomListener('leafpaste', this._onLeafPaste)
    )

    this.$slot = data_tree.$slot

    this.$subComponent = {
      data_tree,
    }

    this.registerRoot(data_tree)
  }

  onPropChanged(prop: string, current: any): void {
    if (prop === 'data') {
      this._root = current
      this._data_tree.setProp('data', current)
    } else if (prop === 'style') {
      this._data_tree.setProp('style', current)

      this._refreshFont()
    }
  }

  public focus = (options?: FocusOptions | undefined) => {
    this._data_tree.focus(options)
  }

  public blur = () => {
    this._data_tree.blur()
  }

  public focusChild = (path: number[], options?: FocusOptions | undefined) => {
    this._data_tree.focusLeaf(path, options)
  }

  public blurChild = (path: number[]) => {
    this._data_tree.blurLeaf(path)
  }

  private _onLeafKeyDown = ({
    value,
    path,
    event,
    _event,
  }: {
    value: string
    path: number[]
    event: IOKeyboardEvent
    _event: KeyboardEvent
  }) => {
    // console.log('Datum', '_onLeafKeyDown')

    const { key, shiftKey } = event

    const leaf = this._data_tree.getChildAtPath(path)!
    const { start: selectionStart, end: selectionEnd } =
      leaf.getSelectionRange()

    const [
      preventDefault,
      {
        nextRoot,
        nextPath,
        nextSelectionStart,
        nextSelectionEnd,
        nextDirection: direction,
      },
    ] = _keyUpdateTree(
      this._root,
      path,
      value,
      key,
      selectionStart,
      selectionEnd,
      shiftKey
    )

    const diffPath = !isEqual(path, nextPath)

    if (preventDefault) {
      if (diffPath) {
        this._ignore_blur = true
      }
      _event.preventDefault()

      this._onChange(
        nextRoot,
        nextPath,
        nextSelectionStart,
        nextSelectionEnd,
        direction
      )
    }

    // const diffPath = !isEqual(path, nextPath)
    // const diffRoot = nextRoot.value !== this._root.value
    // const diffSelectionStart = !isEqual(selectionStart, nextSelectionStart)
    // const diffSelectionEnd = !isEqual(selectionEnd, nextSelectionEnd)

    // if (diffRoot || diffPath || diffSelectionStart || diffSelectionEnd) {
    //   if (diffPath) {
    //     this._ignore_blur = true
    //   }
    //   _event.preventDefault()
    //   this._onChange(
    //     nextRoot,
    //     nextPath,
    //     nextSelectionStart,
    //     nextSelectionEnd,
    //     direction
    //   )
    // }
  }

  private _onLeafFocus = ({
    path,
    _event,
  }: {
    value: string
    path: number[]
    event: IOFocusEvent
    _event: FocusEvent
  }) => {
    // console.log('Datum', '_onLeafFocus', path)

    if (this._ignore_blur) {
      return
    }

    const { relatedTarget } = _event

    if (
      relatedTarget === null ||
      (relatedTarget &&
        relatedTarget instanceof Node &&
        !this._data_tree.$element.contains(relatedTarget))
    ) {
      this.dispatchEvent('datumfocus', { data: this._root, path })
    }
  }

  private _onLeafBlur = ({
    path,
    _event,
  }: {
    path: number[]
    _event: FocusEvent
  }): void => {
    // console.log('Datum', '_onLeafBlur', this._ignore_blur)
    if (this._ignore_blur) {
      return
    }

    if (path.length > 0) {
      const parentPath = getParentPath(path)!
      const parent = _getNodeAtPath(this._root, parentPath)!
      if (path[path.length - 1] === parent.children.length - 1) {
        const data = _getNodeAtPath(this._root, path)!
        if (data.value === '') {
          const nextRoot = _removeNodeAt(this._root, path)
          this._onChange(nextRoot, [])
        }
      }
    }

    const { relatedTarget } = _event

    if (
      relatedTarget === null ||
      (relatedTarget &&
        relatedTarget instanceof Node &&
        !this._data_tree.$element.contains(relatedTarget))
    ) {
      this.dispatchEvent('datumblur', { data: this._root, path, event: _event })
    }
  }

  private _onLeafPaste = ({
    value,
    path,
    text,
  }: {
    value: string
    path: number[]
    text: string
  }): void => {
    // console.log('Datum', '_onLeafPaste', value, path, text, text.length)
    const leaf = this._data_tree.getChildAtPath(path)!

    const { start: selectionStart, end: selectionEnd } =
      leaf.getSelectionRange()

    const nextValue =
      value.slice(0, selectionStart) +
      text +
      value.slice(selectionEnd, value.length)

    const nextLeaf = getTree(nextValue)

    const nextRoot = _updateNodeAt(this._root, path, nextLeaf)

    const nextSelectionStart = selectionStart + text.length

    const nextSelectionEnd = nextSelectionStart

    let nextFocus = _getLastLeafPath(nextRoot)
    const nextFocusNode = _getNodeAtPath(nextRoot, nextFocus)
    // {} and [] first input should be focused
    if (
      nextFocusNode.type === TreeNodeType.ObjectLiteral ||
      nextFocusNode.type === TreeNodeType.ArrayLiteral
    ) {
      nextFocus.push(0)
    }

    this._onChange(
      nextRoot,
      nextFocus,
      nextSelectionStart,
      nextSelectionEnd,
      'forward'
    )
  }

  private _onLeafInput = ({
    value,
    path,
  }: {
    value: string
    path: number[]
  }) => {
    // console.log('Datum', '_onLeafInput')
    const leaf = this._data_tree.getChildAtPath(path)!
    const { start: selectionStart, end: selectionEnd } =
      leaf.getSelectionRange()
    const parent = _getParent(this._root, path)
    const ignoreKeyword = !!(
      parent &&
      (parent.type === TreeNodeType.KeyValue ||
        parent.type === TreeNodeType.ObjectLiteral)
    )
    const tree = getTree(value, false, ignoreKeyword)
    let nextRoot = _updateNodeAt(this._root, path, tree)
    let nextPath: number[] = path

    this._onChange(nextRoot, nextPath, selectionStart, selectionEnd)
  }

  private _onChange = (
    data: TreeNode,
    focus: number[],
    selectionStart?: number,
    selectionEnd?: number,
    direction?: 'forward' | 'backward' | 'none' | undefined
  ) => {
    // console.log(
    //   'Datum',
    //   '_onChange',
    //   data,
    //   focus,
    //   selectionStart,
    //   selectionEnd,
    //   direction
    // )
    this._root = data
    this._ignore_blur = true
    this._data_tree.setProp('data', data)
    this._data_tree.focusLeaf(focus)
    this._ignore_blur = false

    if (selectionStart !== undefined && selectionEnd !== undefined) {
      this._data_tree.setLeafSelectionRange(
        focus,
        selectionStart,
        selectionEnd,
        direction
      )
    }

    this.dispatchEvent('datumchange', { data })
  }

  private _getFontSize = () => {
    const { $width, $height } = this.$context
    const { style = {} } = this.$props

    const fontSize =
      (style.fontSize &&
        parseFontSize(style.fontSize, $width, $height, this.getFontSize())) ||
      this.getFontSize()

    return fontSize
  }

  private _refreshFont = () => {
    const fontSize = this._getFontSize()

    this._data_tree.setProp('fontSize', fontSize)
  }

  private _context_unlisten: Unlisten

  onMount(): void {
    this._refreshFont()

    this._context_unlisten = addListener(
      this.$context,
      makeResizeListener(this._refreshFont)
    )
  }

  onUnmount($context: Context): void {
    this._context_unlisten()
    this._context_unlisten = undefined
  }
}

export default class Datum_ extends Element<HTMLDivElement, _Props> {
  private _root: Datum

  constructor($props: _Props, $system: System) {
    super($props, $system)

    const { style = {}, value = undefined } = $props

    const data = this._get_tree(value)

    const root = new Datum({ data, style }, this.$system)

    root.addEventListener(
      makeCustomListener('datumchange', (event) => {
        const { data } = event

        try {
          const data_ = _evaluate(
            data,
            this.$system.specs,
            this.$system.classes
          )

          this.set('value', data_)
          this.dispatchEvent('change', data_)
        } catch (err) {
          //
        }
      })
    )

    const container = new Div({}, this.$system)

    container.registerParentRoot(root)

    this._root = root

    const $element = parentElement($system)

    this.$element = $element
    this.$slot = root.$slot
    this.$unbundled = false

    this.$subComponent = {
      container,
      root,
    }

    this.registerRoot(container)
  }

  private _get_tree = (value: any) => {
    const data_tree =
      (value !== undefined && getTree(stringify(value))) || getTree('')

    return data_tree
  }

  onPropChanged(prop: keyof _Props, current: any): void {
    if (prop === 'value') {
      const data = this._get_tree(current)

      this._root.setProp('data', data)
    } else if (prop === 'style') {
      this._root.setProp('style', current)
    } else {
      //
    }
  }
}
