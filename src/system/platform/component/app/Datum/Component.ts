import { Element } from '../../../../../client/element'
import { makeCustomListener } from '../../../../../client/event/custom'
import IOFocusEvent from '../../../../../client/event/focus/FocusEvent'
import { IOKeyboardEvent } from '../../../../../client/event/keyboard'
import parentElement from '../../../../../client/platform/web/parentElement'
import { Pod } from '../../../../../pod'
import {
  getParentPath,
  getTree,
  TreeNode,
  TreeNodeType,
  _getLastLeafPath,
  _getNodeAtPath,
  _getParent,
  _insertNodeAt,
  _removeNodeAt,
  _updateNodeAt,
} from '../../../../../spec/parser'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import { _keyUpdateTree } from '../../../../../util/keyUpdateTree'
import isEqual from '../../../../f/comparisson/Equals/f'
import DataTree from '../DataTree/Component'

export interface Props {
  style: Dict<string>
  data: TreeNode
}

export default class Datum extends Element<HTMLDivElement, Props> {
  private _data_tree: DataTree
  private _root: TreeNode

  private _ignore_blur: boolean = false

  constructor($props: Props, $system: System, $pod: Pod) {
    super($props, $system, $pod)

    const { style = {}, data } = $props

    const data_tree = new DataTree(
      { style, data, path: [], parent: null },
      this.$system,
      this.$pod
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

    const $element = parentElement($system)

    this.$element = $element
    this.$slot = data_tree.$slot

    this.registerRoot(data_tree)
  }

  onPropChanged(prop: string, current: any): void {
    if (prop === 'data') {
      this._root = current
      this._data_tree.setProp('data', current)
      this.dispatchEvent('datumchange', { data: current })
    } else if (prop === 'style') {
      this._data_tree.setProp('style', current)
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
      this.dispatchEvent('datumblur', { data: this._root, path })
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
    const { start: selectionStart } = leaf.getSelectionRange()
    const parent = _getParent(this._root, path)
    const ignoreKeyword = !!(
      parent &&
      (parent.type === TreeNodeType.KeyValue ||
        parent.type === TreeNodeType.ObjectLiteral)
    )
    const tree = getTree(value, false, ignoreKeyword)
    let nextRoot = _updateNodeAt(this._root, path, tree)
    let nextPath: number[] = path

    this._onChange(nextRoot, nextPath, selectionStart, selectionStart)
  }

  private _insert_element_after = (path: number[]): void => {
    const nextPath = [...path]
    const parent = _getParent(this._root, path)
    if (parent) {
      nextPath[nextPath.length - 1] = nextPath[nextPath.length - 1] + 1
      const nextRoot = _insertNodeAt(this._root, nextPath, getTree(''))
      this._onChange(nextRoot, nextPath)
    }
  }

  private _onChange = (
    data: TreeNode,
    focus: number[],
    selectionStart?: number,
    selectionEnd?: number,
    direction?: 'forward' | 'backward' | 'none' | undefined
  ) => {
    // console.log('Datum', '_onChange')
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
}
