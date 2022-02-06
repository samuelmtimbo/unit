import classnames from '../../../../../client/classnames'
import {
  childrenOverflow,
  CONTAINER_COLUMN_LEFT_MARGIN,
  CONTAINER_COLUMN_RIGHT_MARGIN,
  CONTAINER_ROW_MARGIN,
} from '../../../../../client/component/getDatumSize'
import mergePropStyle from '../../../../../client/component/mergeStyle'
import { Element } from '../../../../../client/element'
import parentElement from '../../../../../client/platform/web/parentElement'
import { COLOR_NONE } from '../../../../../client/theme'
import { Pod } from '../../../../../pod'
import {
  getTree,
  isCompositeType,
  TreeNode,
  TreeNodeType,
  _isValidObjKey,
} from '../../../../../spec/parser'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import Div from '../../Div/Component'
import DataTreeLeaf from '../DataLeaf/Component'

export interface Props {
  className?: string
  style?: Dict<string>
  path?: number[]
  data: TreeNode
  parent?: TreeNode | null
  appendChildren?: Element[]
}

const STYLE_SEPARATOR = {
  display: 'flex',
  alignItems: 'center',
  textAlign: 'center',
  height: '16px',
  width: '7px',
  fontSize: '12px',
}

const STYLE_DELIMITER = {
  display: 'flex',
  textAlign: 'center',
  height: '16px',
  width: '7px',
  fontSize: '14px',
}

const STYLE_PARENT = (overflow: boolean) => {
  return {
    display: 'flex',
    // textAlign: 'left',
    height: 'fit-content',
    width: 'fit-content',
    flexDirection: overflow ? 'column' : 'row',
  }
}

const STYLE_CONTAINER = (overflow: boolean) => {
  return {
    display: 'flex',
    flexDirection: overflow ? 'column' : 'row',
    marginLeft: overflow
      ? `${CONTAINER_COLUMN_LEFT_MARGIN}px`
      : `${CONTAINER_ROW_MARGIN}px`,
    marginRight: overflow
      ? `${CONTAINER_COLUMN_RIGHT_MARGIN}px`
      : `${CONTAINER_ROW_MARGIN}px`,
    height: 'fit-content',
    width: 'fit-content',
  }
}

const STYLE_COMMA = {
  display: 'flex',
  height: '16px',
  width: '7px',
  textAlign: 'left',
  fontSize: '14px',
}

const STYLE_SPACE = {
  display: 'inline-block',
  width: '2px',
}

export const DEFAULT_STYLE = {
  width: 'fit-content',
}

export default class DataTree extends Element<HTMLDivElement, Props> {
  private _data: TreeNode

  private _root: Div

  private _child: Dict<DataTree> = {}

  private _leaf: DataTreeLeaf | null = null

  constructor($props: Props, $system: System, $pod: Pod) {
    super($props, $system, $pod)

    const { className, style } = $props

    const root = new Div(
      {
        className: classnames('root', className),
        style: { ...DEFAULT_STYLE, ...style },
      },
      this.$system,
      this.$pod
    )
    this._root = root

    this._reset()

    const $element = parentElement($system)

    this.$element = $element

    this.registerRoot(root)
  }

  private __primitive = (data: TreeNode) => this._primitive(data)
  private __key_value = (data: TreeNode) => this._key_value(data)
  private __array_expression = (data: TreeNode) => this._array_expression(data)
  private __object_expression = (data: TreeNode) =>
    this._object_expression(data)
  private __expression = (data: TreeNode) => this._expression(data)
  private __object_literal = (data: TreeNode) => this._object_literal(data)
  private __array_literal = (data: TreeNode) => this._array_literal(data)
  private __and = (data: TreeNode) => this._and(data)
  private __or = (data: TreeNode) => this._or(data)

  private NODE_TYPE_TO_ELEMENT: Dict<
    (data: TreeNode) => {
      style: Dict<string>
      children: Element[]
    }
  > = {
    [TreeNodeType.Any]: this.__primitive,
    [TreeNodeType.Invalid]: this.__primitive,
    [TreeNodeType.Generic]: this.__primitive,
    [TreeNodeType.Null]: this.__primitive,
    [TreeNodeType.Identifier]: this.__primitive,
    [TreeNodeType.Object]: this.__primitive,
    [TreeNodeType.String]: this.__primitive,
    [TreeNodeType.Number]: this.__primitive,
    [TreeNodeType.Boolean]: this.__primitive,
    [TreeNodeType.StringLiteral]: this.__primitive,
    [TreeNodeType.BooleanLiteral]: this.__primitive,
    [TreeNodeType.NumberLiteral]: this.__primitive,
    [TreeNodeType.Regex]: this.__primitive,
    [TreeNodeType.RegexLiteral]: this.__primitive,
    [TreeNodeType.Unit]: this.__primitive,
    [TreeNodeType.Class]: this.__primitive,
    [TreeNodeType.ClassLiteral]: this.__primitive,
    [TreeNodeType.ArithmeticExpression]: this.__primitive,
    [TreeNodeType.KeyValue]: this.__key_value,
    [TreeNodeType.ArrayExpression]: this.__array_expression,
    [TreeNodeType.ObjectExpression]: this.__object_expression,
    [TreeNodeType.Expression]: this.__expression,
    [TreeNodeType.ObjectLiteral]: this.__object_literal,
    [TreeNodeType.ArrayLiteral]: this.__array_literal,
    [TreeNodeType.And]: this.__and,
    [TreeNodeType.Or]: this.__or,
  }

  private _reset = () => {
    // console.log('DataTree', 'reset')

    const { data, style: _style } = this.$props

    this._data = data

    this._child = {}

    const element = this.NODE_TYPE_TO_ELEMENT[data.type](data)

    const { style, children } = element

    this._root.setProp('style', { ...DEFAULT_STYLE, ...style, ..._style })
    this._root.setChildren(children)
  }

  private _child_element = (
    index: number,
    data: TreeNode,
    appendChildren?: Element[],
    className?: string,
    style?: Dict<string>
  ): DataTree => {
    const { path = [], data: parent_data } = this.$props
    const child = new DataTree(
      {
        className,
        style,
        data,
        path: [...path, index],
        parent: parent_data,
        appendChildren,
      },
      this.$system,
      this.$pod
    )
    this._child[index] = child
    return child
  }

  private _object_literal = (
    data: TreeNode
  ): {
    style: Dict<string>
    children: Element[]
  } => {
    const { appendChildren = [], parent } = this.$props
    const empty = data.children.length === 0
    const overflow = childrenOverflow(data)
    const style = STYLE_PARENT(overflow)
    const object_literal_open_delimiter = this._delimiter(
      {
        display:
          overflow && parent && parent.type === TreeNodeType.KeyValue
            ? 'none'
            : 'flex',
      },
      '{'
    )
    const object_literal_container = new Div(
      {
        className: 'object-literal-container',
        style: STYLE_CONTAINER(overflow),
      },
      this.$system,
      this.$pod
    )
    for (let i = 0; i < data.children.length; i++) {
      const child = data.children[i]
      const comma = this._comma()
      const space = this._space()
      if (child.type === TreeNodeType.KeyValue) {
        const key_value = child
        const key_value_tree = this._child_element(
          i,
          key_value,
          i < data.children.length - 1 ? [comma, space] : [],
          'comma-space'
        )
        object_literal_container.appendChild(key_value_tree)
      } else if (_isValidObjKey(child)) {
        const key = child
        const key_tree = this._child_element(
          i,
          key,
          i < data.children.length - 1 ? [comma, space] : [],
          'comma-space'
        )
        mergePropStyle(key_tree, { display: 'flex' })
        object_literal_container.appendChild(key_tree)
      } else if (child.value === '') {
        const empty_tree = this._child_element(
          i,
          child,
          i < data.children.length - 1 ? [comma, space] : []
        )
        object_literal_container.appendChild(empty_tree)
      } else {
        const invalid_tree = this._child_element(
          i,
          child,
          i < data.children.length - 1 ? [comma, space] : []
        )
        object_literal_container.appendChild(invalid_tree)
      }
    }
    if (empty) {
      const empty_tree = this._child_element(0, getTree(''))
      object_literal_container.appendChild(empty_tree)
    }
    const object_literal_close_delimiter = this._delimiter({}, `}`)
    const object_literal_end = new Div(
      {
        className: 'object-literal',
        style: { display: 'flex', width: 'fit-content' },
      },
      this.$system,
      this.$pod
    )
    object_literal_end.setChildren([
      object_literal_close_delimiter,
      ...appendChildren,
    ])
    const children = [
      object_literal_open_delimiter,
      object_literal_container,
      object_literal_end,
    ]
    return { style, children }
  }

  private _array_literal = (
    data: TreeNode
  ): {
    style: Dict<string>
    children: Element[]
  } => {
    const { appendChildren = [], parent } = this.$props
    const empty = data.children.length === 0
    const overflow = childrenOverflow(data)
    const style = STYLE_PARENT(overflow)
    const array_literal_open_delimiter = this._delimiter(
      {
        display:
          overflow && parent && parent.type === TreeNodeType.KeyValue
            ? 'none'
            : 'flex',
      },
      '['
    )
    const array_literal_container = new Div(
      {
        className: 'array-literal-container',
        style: {
          ...STYLE_CONTAINER(overflow),
        },
      },
      this.$system,
      this.$pod
    )
    for (let i = 0; i < data.children.length; i++) {
      const element = data.children[i]
      const comma = this._comma()
      const space = this._space()
      const array_literal_element_tree = this._child_element(
        i,
        element,
        i < data.children.length - 1 ? [comma, space] : []
      )
      array_literal_container.appendChild(array_literal_element_tree)
    }
    if (empty) {
      const array_literal_empty_tree = this._child_element(
        0,
        getTree(''),
        [],
        'key-value-value-tree'
      )
      array_literal_container.appendChild(array_literal_empty_tree)
    }
    const array_literal_close_delimiter = this._delimiter({}, `]`)
    const array_literal_end = new Div(
      {
        style: { display: 'flex', width: 'fit-content' },
      },
      this.$system,
      this.$pod
    )
    array_literal_end.setChildren([
      array_literal_close_delimiter,
      ...appendChildren,
    ])
    const children = [
      array_literal_open_delimiter,
      array_literal_container,
      array_literal_end,
    ]
    return { style, children }
  }

  private _expression = (
    data: TreeNode
  ): {
    style: Dict<string>
    children: Element[]
  } => {
    const { path = [], appendChildren = [] } = this.$props
    const empty = data.children.length === 0
    const overflow = childrenOverflow(data)
    const style = STYLE_PARENT(overflow)
    const expression_open_delimiter = this._delimiter(
      { display: overflow && path[path.length - 1] > 0 ? 'none' : 'block' },
      '('
    )
    const expression_container = new Div(
      {
        style: {
          className: 'expression-container',
          ...STYLE_CONTAINER(overflow),
        },
      },
      this.$system,
      this.$pod
    )
    for (let i = 0; i < data.children.length; i++) {
      const element = data.children[i]
      const comma = this._comma()
      const space = this._space()
      const expression_element_tree = this._child_element(
        i,
        element,
        i < data.children.length - 1 ? [comma, space] : []
      )
      expression_container.appendChild(expression_element_tree)
    }
    if (empty) {
      const array_literal_empty_tree = this._child_element(
        0,
        getTree(''),
        [],
        'expression'
      )
      expression_container.appendChild(array_literal_empty_tree)
    }
    const expression_close_delimiter = this._delimiter({}, `)`)
    const expression_literal_end = new Div(
      {
        style: { display: 'flex', width: 'fit-content' },
      },
      this.$system,
      this.$pod
    )
    expression_literal_end.setChildren([
      expression_close_delimiter,
      ...appendChildren,
    ])
    const children = [
      expression_open_delimiter,
      expression_container,
      expression_literal_end,
    ]
    return { style, children }
  }

  private _key_value = (
    data: TreeNode
  ): { style: Dict<string>; children: Element[] } => {
    const { appendChildren = [] } = this.$props
    const value_tree = data.children[1]
    const key_tree = data.children[0]
    const value_overflow = childrenOverflow(value_tree)
    const style = {
      display: 'flex',
      flexDirection: value_overflow ? 'column' : 'row',
    }
    const key_value_key = new Div(
      {
        className: 'key-value-key',
        style: { display: 'flex', width: 'fit-content' },
      },
      this.$system,
      this.$pod
    )
    const key_value_key_tree = this._child_element(
      0,
      key_tree,
      [],
      'key-value-key-tree'
    )
    key_value_key.appendChild(key_value_key_tree)

    if (value_overflow) {
      const key_value_overflow_colon = this._delimiter({}, ':')
      const key_value_overflow_space = this._space()
      key_value_key.appendChild(key_value_overflow_colon)
      key_value_key.appendChild(key_value_overflow_space)
      if (value_tree.type === TreeNodeType.ObjectLiteral) {
        const key_value_key_delimiter = this._delimiter({}, '{')
        key_value_key.appendChild(key_value_key_delimiter)
      } else if (value_tree.type === TreeNodeType.ArrayLiteral) {
        const key_value_key_delimiter = this._delimiter({}, '[')
        key_value_key.appendChild(key_value_key_delimiter)
      } else if (value_tree.type === TreeNodeType.Expression) {
        const key_value_key_delimiter = this._delimiter({}, '(')
        key_value_key.appendChild(key_value_key_delimiter)
      }
    }
    const key_value_colon = this._delimiter(
      { display: value_overflow ? 'none' : 'block' },
      ':'
    )
    const key_value_space = this._space()
    const key_value_value = new Div(
      {
        className: 'key-value-value',
        style: { display: 'flex', width: 'fit-content' },
      },
      this.$system,
      this.$pod
    )
    const key_value_value_tree = this._child_element(
      1,
      value_tree,
      appendChildren,
      'key-value-value-tree'
    )

    key_value_value.appendChild(key_value_value_tree)

    const children = [
      key_value_key,
      key_value_colon,
      key_value_space,
      key_value_value,
    ]

    return { style, children }
  }

  private _primitive = (
    data: TreeNode
  ): { style: Dict<string>; children: Element[] } => {
    const { path = [], parent, appendChildren = [] } = this.$props

    const style = { display: 'flex' }

    this._leaf = new DataTreeLeaf(
      {
        style: {
          padding: '0',
          textAlign: 'center',
          resize: 'none',
          height: '16px',
          maxWidth: '210px',
          fontWeight: 'inherit',
          wordWrap: 'normal',
          whiteSpace: 'nowrap',
          background: COLOR_NONE,
          backgroundColor: COLOR_NONE,
        },
        value: data.value,
        path,
        parent,
      },
      this.$system,
      this.$pod
    )

    const children: Element[] = [this._leaf, ...appendChildren]

    return { style, children }
  }

  private _array_expression = (
    data: TreeNode
  ): {
    style: Dict<string>
    children: Element[]
  } => {
    const { appendChildren = [] } = this.$props

    const style = { display: 'flex', width: 'fit-content' }

    const array_expression_open_delimiter = this._delimiter({}, '[')
    const array_expression_close_delimiter = this._delimiter({}, ']')
    const array_expression_open_close = new Div(
      {
        style: { display: 'flex', width: 'fit-content' },
      },
      this.$system,
      this.$pod
    )
    array_expression_open_close.setChildren([
      array_expression_open_delimiter,
      array_expression_close_delimiter,
      ...appendChildren,
    ])
    const array_expression_tree = this._child_element(
      0,
      data.children[0],
      [array_expression_open_close],
      'array-expression'
    )

    const children = [array_expression_tree]

    return { style, children }
  }

  private _object_expression = (
    data: TreeNode
  ): {
    style: Dict<string>
    children: Element[]
  } => {
    const {} = this.$props

    const style = { display: 'flex' }

    const object_expression_open_delimiter = this._delimiter({}, '{')
    const object_expression_close_delimiter = this._delimiter({}, '}')
    const object_expression_open_close = new Div(
      {
        style: { display: 'flex', width: 'fit-content' },
      },
      this.$system,
      this.$pod
    )
    object_expression_open_close.setChildren([
      object_expression_open_delimiter,
      object_expression_close_delimiter,
    ])
    const object_expression_tree = this._child_element(
      0,
      data.children[0],
      [object_expression_open_close],
      'object-expression'
    )

    const children = [object_expression_tree]

    return { style, children }
  }

  private _or = (
    data: TreeNode
  ): { style: Dict<string>; children: Element[] } => {
    const {} = this.$props
    const overflow = childrenOverflow(data)
    const style = { ...STYLE_PARENT(overflow), alignItems: 'center' }
    const children: Element[] = []
    for (let i = 0; i < data.children.length; i++) {
      const element = data.children[i]
      const or_delimiter = this._separator({}, '|')
      const or_element_tree = this._child_element(
        i,
        element,
        i < data.children.length - 1 ? [or_delimiter] : [],
        'or'
      )
      children.push(or_element_tree)
    }
    return { style, children }
  }

  private _and = (
    data: TreeNode
  ): { style: Dict<string>; children: Element[] } => {
    const {} = this.$props
    const style = { display: 'flex', alignItems: 'center' }
    const children: Element[] = []
    for (let i = 0; i < data.children.length; i++) {
      const element = data.children[i]
      const and_delimiter = this._separator({}, '&')
      const and_element_tree = this._child_element(
        i,
        element,
        i < data.children.length - 1 ? [and_delimiter] : [],
        'and',
        { alignItems: 'center' }
      )
      children.push(and_element_tree)
    }
    return { style, children }
  }

  private _space = (): Div => {
    return new Div(
      {
        style: {
          ...STYLE_SPACE,
        },
        innerText: ' ',
      },
      this.$system,
      this.$pod
    )
  }

  private _comma = (): Div => {
    return new Div(
      {
        style: {
          ...STYLE_COMMA,
        },
        innerText: ',',
      },
      this.$system,
      this.$pod
    )
  }

  private _separator = (style: Dict<string>, innerText: string): Div => {
    return new Div(
      {
        className: 'separator',
        style: {
          ...STYLE_SEPARATOR,
          ...style,
        },
        innerText,
      },
      this.$system,
      this.$pod
    )
  }

  private _delimiter = (style: Dict<string>, innerText: string): Div => {
    return new Div(
      {
        className: 'delimiter',
        style: {
          ...STYLE_DELIMITER,
          ...style,
        },
        innerText,
      },
      this.$system,
      this.$pod
    )
  }

  public update(data: TreeNode): void {
    console.log('DataTree', 'update', data)

    if (data.type === this._data.type) {
      // this._data.value = data.value

      if (isCompositeType(data.type)) {
        const l = data.children.length
        const _l = this._data.children.length

        const L = Math.max(l, _l)

        for (let i = 0; i < L; i++) {
          const _child = this._data.children[i]
          const child = data.children[i]

          if (_child && child) {
            const _child_comp = this._root.$children[i] as DataTree
            _child_comp.update(child)
          } else if (_child && !child) {
            for (let j = _l - 1; j >= i; j--) {
              this._root.removeChildAt(j)
            }
            break
          } else if (!_child && child) {
            // const child_comp = new DataTree({ data: child })
            // this._root.appendChild(child_comp)
            const { style, children } =
              this.NODE_TYPE_TO_ELEMENT[child.type](child)
            for (const childd of children) {
              this._root.appendChild(childd)
            }
          } else {
            throw new Error('something impossible just happened')
          }
        }
      } else {
        this._leaf.setProp('value', data.value)
      }
    } else {
      this._data = data
      this._reset()
    }
  }

  onPropChanged(prop: string, current: any): void {
    if (prop === 'data') {
      this._reset()
      // this.update(current || EMPTY_TREE)
    } else if (prop === 'style') {
      this._root.setProp('style', { ...DEFAULT_STYLE, ...current })
    }
  }

  public focus = (options?: FocusOptions | undefined) => {
    if (this._leaf) {
      this._leaf.focus(options)
    }
  }

  public blur = () => {
    if (this._leaf) {
      this._leaf.blur()
    }
  }

  public getSelectionRange = (): { start: number; end: number } => {
    if (this._leaf) {
      // TODO `leaf` should `extend` input
      const start = this._leaf._input.$element.selectionStart || 0
      const end = this._leaf._input.$element.selectionEnd || 0
      return { start, end }
    }
    return { start: 0, end: 0 }
  }

  public setSelectionRange = (
    start: number,
    end: number,
    direction?: 'forward' | 'backward' | 'none' | undefined
  ) => {
    if (this._leaf) {
      this._leaf.setSelectionRange(start, end, direction)
    }
  }

  public focusLeaf = (path: number[], options?: FocusOptions | undefined) => {
    const child = this.getChildAtPath(path)
    if (child) {
      child.focus(options)
    }
  }

  public blurLeaf = (path: number[]) => {
    const child = this.getChildAtPath(path)
    if (child) {
      child.blur()
    }
  }

  public getChild = (index: number): DataTree | null => {
    return this._child[index] || null
  }

  public getChildAtPath = (path: number[]): DataTree | null => {
    let child: DataTree | null = this
    for (let index of path) {
      if (child) {
        child = child.getChild(index)
      } else {
        throw new Error(`There is no child at ${path}`)
      }
    }
    return child
  }

  public setLeafSelectionRange(
    path: number[],
    start: number,
    end: number,
    direction?: 'forward' | 'backward' | 'none' | undefined
  ) {
    const child = this.getChildAtPath(path)
    if (child) {
      child.setSelectionRange(start, end, direction)
    }
  }
}
