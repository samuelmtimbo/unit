import { Component } from '../../../../client/component'
import { Element } from '../../../../client/element'
import { mergeStyle } from '../../../../client/style'
import { System } from '../../../../system'
import { Unlisten } from '../../../../types/Unlisten'
import { Style } from '../../Style'

export interface Props {
  style: Style
}

export const DEFAULT_STYLE = {}

export default class Inherit extends Element<HTMLDivElement, Props> {
  constructor(props: Props, $system: System) {
    super(props, $system)

    const {
      api: {
        document: { createElement },
      },
    } = $system

    const $element = createElement('div')

    $element.classList.add('inherit')

    $element.style.display = 'contents'

    this.$wrap = true
    this.$element = $element
    this.$primitive = true

    this.$slot = {
      default: this,
    }
  }

  private _unlisten: Unlisten[] = []
  private _styles: Style[] = []

  private _registerChild = (child) => {
    const { style } = this.$props

    if (child.$wrapElement) {
      const wrap_style = { ...child.$wrapElement.style }

      this._styles.push(wrap_style)

      mergeStyle(child.$wrapElement, style)
    } else {
      const base = child.getRootLeaves()

      for (const leaf of base) {
        const unlisten = leaf.interceptProp('style', (leaf_style: Style) => {
          const { style } = this.$props

          const i = this._unlisten.indexOf(unlisten)

          this._styles[i] = leaf_style

          return {
            ...style,
            ...leaf_style,
          }
        })

        const leaf_style = leaf.getProp('style') ?? {}

        this._styles.push(leaf_style)
        this._unlisten.push(unlisten)

        leaf.refreshProp('style')
      }
    }
  }

  private _unregisterChild = (child: Component, at: number) => {
    if (child.$wrapElement) {
      this._styles.splice(at, 1)
    } else {
      const base = child.getRootLeaves()

      for (let i = 0; i < base.length; i++) {
        const j = at + i

        const unlisten = this._unlisten[j]
        const leaf = base[i]

        unlisten()

        leaf.refreshProp('style')
      }

      this._unlisten.splice(at, base.length)
      this._styles.splice(at, base.length)
    }
  }

  protected _insertAt(parent: Component, child: Component, at: number) {
    super._insertAt(parent, child, at)

    this._registerChild(child)
  }

  protected _removeChild(child: Component, at: number) {
    this._unregisterChild(child, at)

    super._removeChild(child, at)
  }

  onPropChanged(name: string, style: Style) {
    // if (name === 'style') {
    for (const child of this.$domChildren) {
      if (child.$wrapElement) {
        mergeStyle(child.$wrapElement, style)
      } else {
        const base = child.getRootLeaves()

        for (const leaf_comp of base) {
          leaf_comp.refreshProp('style')
        }
      }
    }
    // }
  }
}
