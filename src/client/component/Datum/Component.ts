import {
  getParentPath,
  // getTree,
  getValueTree as getTree,
  isCompositeType,
  TreeNode,
  TreeNodeType,
  _getLastLeafPath,
  _getNextLeafPath,
  _getNextNodePath,
  _getNodeAtPath,
  _getParent,
  _insertNodeAt,
  _isValidTree,
  _removeNodeAt,
  _updateNodeAt,
} from '../../../spec/parser'
import isEqual from '../../../system/f/comparison/Equals/f'
import { Dict } from '../../../types/Dict'
import { Element } from '../../element'
import { makeCustomListener } from '../../event/custom'
import { IOKeyboardEvent } from '../../event/keyboard'
import parentElement from '../../parentElement'
import DataTree from '../DataTree/Component'

export interface Props {
  style: Dict<string>
  data: TreeNode
}

export default class Datum extends Element<HTMLDivElement, Props> {
  private _data_tree: DataTree
  private _root: TreeNode

  private _ignore_blur: boolean = false

  constructor($props: Props) {
    super($props)

    const { style = {}, data } = $props

    const data_tree = new DataTree({ style, data, path: [], parent: null })

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

    const $element = parentElement()

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

    const {
      nextRoot,
      nextPath,
      nextSelectionStart,
      nextSelectionEnd,
      direction,
    } = _keyUpdateTree(
      this._root,
      path,
      value,
      key,
      selectionStart,
      selectionEnd,
      shiftKey
    )

    const diffPath = !isEqual(path, nextPath)
    const diffRoot = nextRoot.value !== this._root.value
    const diffSelectionStart = !isEqual(selectionStart, nextSelectionStart)
    const diffSelectionEnd = !isEqual(selectionEnd, nextSelectionEnd)

    if (diffRoot || diffPath || diffSelectionStart || diffSelectionEnd) {
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
  }

  private _onLeafFocus = ({ path }: { value: string; path: number[] }) => {
    // console.log('Datum', '_onLeafFocus', path)
    if (this._ignore_blur) {
      return
    }
    this.dispatchEvent('datumfocus', { data: this._root, path })
  }

  private _onLeafBlur = ({ path }: { path: number[] }): void => {
    // console.log('Datum', '_onLeafBlur', this._ignore_blur)
    if (this._ignore_blur) {
      // this._ignore_blur = false
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
    this.dispatchEvent('datumblur', { data: this._root, path })
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
    // console.log('Datum', '_onLeafPaste', value, path, text)
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

const _keyUpdateTree = (
  root: TreeNode,
  path: number[],
  value: string,
  key: string,
  selectionStart: number,
  selectionEnd: number,
  shiftKey: boolean
): {
  nextRoot: TreeNode
  nextPath: number[]
  nextSelectionStart: number
  nextSelectionEnd: number
  direction?: 'forward' | 'backward' | 'none' | undefined
} => {
  const data = getTree(value)

  const valid = _isValidTree(data)

  let nextRoot: TreeNode = root
  let nextPath = path
  let nextSelectionStart = selectionStart
  let nextSelectionEnd = selectionEnd

  let direction: 'forward' | 'backward' | 'none' | undefined = undefined

  if (key === 'Backspace') {
    if (value === '' && path.length > 0) {
      const parentPath = getParentPath(path) as number[]
      const parent = _getNodeAtPath(root, parentPath)!
      if (
        parent.type === TreeNodeType.ArrayLiteral ||
        parent.type === TreeNodeType.ObjectLiteral
      ) {
        if (parent.children.length === 0) {
          // `{|}` + Backspace = ``
          nextRoot = _updateNodeAt(root, parentPath, getTree(''))
          nextPath = parentPath
        } else {
          nextRoot = _removeNodeAt(root, path)
          nextPath = _getNextLeafPath(root, path, -1)!
        }
      } else if (parent.type === TreeNodeType.KeyValue) {
        nextRoot = _removeNodeAt(root, path)
        nextPath = parentPath
      }
      const nextFocusNode = _getNodeAtPath(nextRoot, nextPath)
      if (nextFocusNode) {
        nextSelectionStart = nextFocusNode.value.length
        nextSelectionEnd = nextSelectionStart
      }
    } else if (
      (value === `""` || value === `''` || value === '``') &&
      selectionStart === 1
    ) {
      nextRoot = _updateNodeAt(root, path, getTree(''))
    }
  } else if (key === 'ArrowLeft') {
    if (selectionStart === 0) {
      const parentPath = getParentPath(path) as number[]
      const leftLeafPath =
        _getNextLeafPath(root, path, -1) ||
        (parentPath && _getNextLeafPath(root, parentPath, -1))
      if (leftLeafPath) {
        const leftLeafNode = _getNodeAtPath(nextRoot, leftLeafPath)!
        if (value === '') {
          nextRoot = _removeNodeAt(nextRoot, path)
        }
        nextPath = leftLeafPath
        if (!nextPath || !_getNodeAtPath(nextRoot, nextPath)) {
          const parentPath = getParentPath(path) as number[]
          nextPath = parentPath
        }
        nextSelectionStart = leftLeafNode.value.length
        nextSelectionEnd = nextSelectionStart
      }
    }
  } else if (key === 'ArrowRight') {
    if (selectionStart === value.length) {
      const rightLeafPath = _getNextLeafPath(nextRoot, path, 1)
      if (rightLeafPath) {
        if (value === '') {
          nextRoot = _removeNodeAt(nextRoot, path)
        } else {
          nextPath = rightLeafPath
          if (!nextPath || !_getNodeAtPath(nextRoot, nextPath)) {
            const parentPath = getParentPath(path) as number[]
            nextPath = parentPath
          }
          const nextFocusNode = _getNodeAtPath(nextRoot, nextPath)
          if (
            nextFocusNode &&
            (nextFocusNode.type === TreeNodeType.ArrayLiteral ||
              nextFocusNode.type === TreeNodeType.ObjectLiteral) &&
            nextFocusNode.children.length === 0
          ) {
            nextPath = [...nextPath, 0]
          }
        }
        nextSelectionStart = 0
        nextSelectionEnd = 0
      }
    }
  } else if (key === 'ArrowUp') {
    // TODO
  } else if (key === 'ArrowDown') {
    // TODO
  } else if (key === 'Tab') {
    // TODO
  } else if (key === ',') {
    let parentPath = getParentPath(path)
    if (parentPath) {
      const parent = _getNodeAtPath(root, parentPath)!
      if (
        isCompositeType(parent.type) &&
        (data.type !== TreeNodeType.StringLiteral ||
          selectionStart === value.length)
      ) {
        if (
          parent.type === TreeNodeType.ArrayLiteral ||
          parent.type === TreeNodeType.ObjectLiteral
        ) {
          if (value === '') {
            nextRoot = _removeNodeAt(root, path)
          }
          nextPath = [...path]
          nextPath[nextPath.length - 1] += 1
          nextRoot = _insertNodeAt(root, nextPath, getTree(''))
          nextSelectionStart = 0
          nextSelectionEnd = 0
        } else if (parent.type === TreeNodeType.KeyValue) {
          if (value === '') {
            nextRoot = _removeNodeAt(root, path)
          }
          nextPath = [...parentPath]
          nextPath[nextPath.length - 1] += 1
          nextRoot = _insertNodeAt(nextRoot, nextPath, getTree(''))
          nextSelectionStart = 0
          nextSelectionEnd = 0
        }
      }
    }
  } else if ((key === ']' || key === '}') && (valid || value === '')) {
    let parentPath = getParentPath(path)
    if (parentPath) {
      const parent = _getNodeAtPath(root, parentPath)!
      const grandpaPath = getParentPath(parentPath)
      if (grandpaPath) {
        if (
          (parent.type === TreeNodeType.ArrayLiteral && key === ']') ||
          (parent.type === TreeNodeType.ObjectLiteral && key === '}')
        ) {
          const grandpa = _getNodeAtPath(nextRoot, grandpaPath)!
          if (value === '') {
            nextRoot = _removeNodeAt(nextRoot, path)
          }
          if (
            grandpa.type === TreeNodeType.ArrayLiteral ||
            grandpa.type === TreeNodeType.ObjectLiteral
          ) {
            nextPath = [...parentPath]
            nextPath[nextPath.length - 1] += 1
            nextRoot = _insertNodeAt(nextRoot, nextPath, getTree(''))
            nextSelectionStart = 0
            nextSelectionEnd = 0
          } else if (grandpa.type === TreeNodeType.KeyValue) {
            nextPath = [...grandpaPath]
            nextPath[nextPath.length - 1] += 1
            nextRoot = _insertNodeAt(nextRoot, nextPath, getTree(''))
            nextSelectionStart = 0
            nextSelectionEnd = 0
          }
        } else if (parent.type === TreeNodeType.KeyValue && key === '}') {
          const grangrandpaPath = getParentPath(grandpaPath)
          if (grangrandpaPath) {
            if (value === '') {
              nextRoot = _removeNodeAt(root, path)
            }
            nextPath = [...grandpaPath]
            nextPath[nextPath.length - 1] += 1

            const grangrandpa = _getNodeAtPath(nextRoot, grangrandpaPath)!
            if (
              grangrandpa.type === TreeNodeType.ArrayLiteral ||
              grangrandpa.type === TreeNodeType.ObjectLiteral
            ) {
              nextPath = [...grandpaPath]
              nextPath[nextPath.length - 1] += 1
              nextRoot = _insertNodeAt(nextRoot, nextPath, getTree(''))
              nextSelectionStart = 0
              nextSelectionEnd = 0
            } else if (grangrandpa.type === TreeNodeType.KeyValue) {
              nextPath = [...grangrandpaPath]
              nextPath[nextPath.length - 1] += 1
              nextRoot = _insertNodeAt(nextRoot, nextPath, getTree(''))
              nextSelectionStart = 0
              nextSelectionEnd = 0
            }
          }
        }
      }
    } else {
      if (value === '') {
        nextPath = [...path, 0]
        nextRoot = _updateNodeAt(root, path, getTree(shiftKey ? '{}' : `[]`))
        nextSelectionStart = 1
        nextSelectionEnd = 1
      }
    }
  } else if (key === ':') {
    const parent = _getParent(root, path)
    if (
      parent &&
      parent.type === TreeNodeType.ObjectLiteral
      // && _isValidObjKey(data)
    ) {
      nextRoot = _updateNodeAt(root, path, getTree(`${data.value}:`))
      nextPath = [...path, 1]
      nextRoot = _updateNodeAt(nextRoot, nextPath, getTree(''))
    }
  } else if (key === '[' || key === '{') {
    if (value === '') {
      const parentPath = getParentPath(path)
      const parent = parentPath && _getNodeAtPath(root, parentPath)
      const lastIndex = path[path.length - 1]
      if (
        !parent ||
        ((parent.type !== TreeNodeType.KeyValue ||
          (parent.type === TreeNodeType.KeyValue && lastIndex !== 0)) &&
          (parent.type !== TreeNodeType.ObjectLiteral ||
            (parent.type === TreeNodeType.ObjectLiteral && lastIndex !== 0)))
      ) {
        nextPath = [...path, 0]
        nextRoot = _updateNodeAt(root, path, getTree(key === '{' ? '{}' : `[]`))
        nextSelectionStart = 1
        nextSelectionEnd = 1
      }
    } else if (selectionStart === 0 && selectionEnd === value.length) {
      const nextValue = key === `[` ? `[${value}]` : `{${value}}`
      nextRoot = _updateNodeAt(root, path, getTree(nextValue))
      nextPath = _getNextNodePath(nextRoot, path, 1)
      nextSelectionStart = 1
      nextSelectionEnd = value.length + 1
      direction = 'forward'
    }
  } else if (key === `'` || key === `"`) {
    if (value === '') {
      const nextValue = key === `'` ? `''` : `""`
      nextRoot = _updateNodeAt(root, path, getTree(nextValue))
      nextPath = path
      nextSelectionStart = 1
      nextSelectionEnd = 1
    } else if (selectionStart === 0 && selectionEnd === value.length) {
      const nextValue = key === `'` ? `'${value}'` : `"${value}"`
      nextRoot = _updateNodeAt(root, path, getTree(nextValue))
      nextSelectionStart = 1
      nextSelectionEnd = value.length + 1
      direction = 'forward'
    } else {
      const enclosing = key === `'` ? `'` : `"`
      if (
        value.endsWith(enclosing) &&
        selectionStart === value.length - 1 &&
        value[selectionStart - 1] !== '\\'
      ) {
        nextSelectionStart = value.length
        nextSelectionEnd = nextSelectionStart
      }
    }
  } else if (key === `\``) {
    if (!shiftKey) {
      if (value === '') {
        const nextValue = `\`\``
        nextRoot = _updateNodeAt(root, path, getTree(nextValue))
        nextPath = path
        nextSelectionStart = 1
        nextSelectionEnd = nextSelectionStart
      } else {
        const enclosing = `\``
        if (
          value.endsWith(enclosing) &&
          selectionStart === value.length - 1 &&
          value[selectionStart - 1] !== '\\'
        ) {
          nextSelectionStart = value.length
          nextSelectionEnd = nextSelectionStart
        }
      }
    }
  }

  return {
    nextRoot,
    nextPath,
    nextSelectionStart,
    nextSelectionEnd,
    direction,
  }
}

const keydownUpdateTree = (
  root: string,
  focus: number[],
  value: string,
  key: string,
  selectionStart: number,
  shiftKey: boolean
): { nextRoot: string; nextPath: number[]; nextSelectionStart: number } => {
  const _root = getTree(root)
  const {
    nextRoot: _nextRoot,
    nextPath,
    nextSelectionStart,
  } = _keyUpdateTree(
    _root,
    focus,
    value,
    key,
    selectionStart,
    selectionStart,
    shiftKey
  )
  return {
    nextRoot: _nextRoot.value,
    nextPath,
    nextSelectionStart,
  }
}

// assert.deepEqual(keydownUpdateTree('', [], '', '[', 0, false), {
//   nextRoot: '[]',
//   nextPath: [0],
//   nextSelectionStart: 1,
// })

// assert.deepEqual(keydownUpdateTree('', [], '', '{', 0, true), {
//   nextRoot: '{}',
//   nextPath: [0],
//   nextSelectionStart: 1,
// })

// assert.deepEqual(keydownUpdateTree('', [], '', `'`, 0, false), {
//   nextRoot: `''`,
//   nextPath: [],
//   nextSelectionStart: 1,
// })

// assert.deepEqual(keydownUpdateTree('', [], '', `"`, 0, true), {
//   nextRoot: '""',
//   nextPath: [],
//   nextSelectionStart: 1,
// })

// assert.deepEqual(keydownUpdateTree('', [], '', '{', 0, true), {
//   nextRoot: '{}',
//   nextPath: [0],
//   nextSelectionStart: 1,
// })

// assert.deepEqual(keydownUpdateTree('{}', [0], '', 'Backspace', 0, false), {
//   nextRoot: '',
//   nextPath: [],
//   nextSelectionStart: 0,
// })

// assert.deepEqual(keydownUpdateTree('[1]', [0], '1', ',', 1, false), {
//   nextRoot: '[1,]',
//   nextPath: [1],
//   nextSelectionStart: 0,
// })

// // assert.deepEqual(keydownUpdateTree('0', [], '0', 'Backspace', 1, false), {
// //   nextRoot: '',
// //   nextPath: [],
// //   nextSelectionStart: 0,
// // })

// assert.deepEqual(keydownUpdateTree('{}', [0], '', 'Backspace', 0, false), {
//   nextRoot: '',
//   nextPath: [],
//   nextSelectionStart: 0,
// })

// assert.deepEqual(keydownUpdateTree('{a:}', [0, 1], '', 'Backspace', 0, false), {
//   nextRoot: '{a}',
//   nextPath: [0],
//   nextSelectionStart: 1,
// })

// // assert.deepEqual(keydownUpdateTree('{a}', [0], 'a', 'Backspace', 1, false), {
// //   nextRoot: '{}',
// //   nextPath: [0],
// //   nextSelectionStart: 0,
// // })

// assert.deepEqual(keydownUpdateTree('[1,]', [1], '', 'Backspace', 0, false), {
//   nextRoot: '[1]',
//   nextPath: [0],
//   nextSelectionStart: 1,
// })

// // assert.deepEqual(keydownUpdateTree('[1,2]', [1], '2', 'Backspace', 1, false), {
// //   nextRoot: '[1,]',
// //   nextPath: [1],
// //   nextSelectionStart: 0,
// // })

// // assert.deepEqual(keydownUpdateTree('{*}', [0], '*', ';', 1, true), {
// //   nextRoot: '{*:}',
// //   nextPath: [0],
// //   nextSelectionStart: 2,
// // })
