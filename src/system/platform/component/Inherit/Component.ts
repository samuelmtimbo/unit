import { Component } from '../../../../client/component'
import { Element } from '../../../../client/element'
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

  private _base: Component[] = []
  private _unlisten: Unlisten[] = []

  private _registerChild = (child) => {
    let base = child.getRootBase()

    for (const leaf of base) {
      const [leaf_path, leaf_comp] = leaf

      const unlisten = leaf_comp.interceptProp('style', (leaf_style) => {
        const { style } = this.$props

        return {
          ...style,
          ...leaf_style,
        }
      })

      this._base.push(leaf_comp)
      this._unlisten.push(unlisten)

      leaf_comp.refreshProp('style')
    }
  }

  private _unregisterChild = (child: Component) => {
    let base = child.getRootBase()

    const base_length = base.length

    const first_leaf = base[0]

    if (first_leaf) {
      const [_, first_leaf_comp] = first_leaf

      const first_leaf_index = this._base.indexOf(first_leaf_comp)

      if (first_leaf_index > -1) {
        return
      }

      for (let i = 0; i < base_length; i++) {
        const j = first_leaf_index + i

        const unlisten = this._unlisten[j]
        const leaf_comp = this._base[j]

        unlisten()

        leaf_comp.refreshProp('style')
      }

      this._unlisten.splice(first_leaf_index, base.length)
      this._base.splice(first_leaf_index, base.length)
    }
  }

  domCommitAppendChild(child: Component, at: number) {
    this._registerChild(child)

    super.domCommitAppendChild(child, at)
  }

  domCommitInsertChild(child: Component, at: number) {
    this._registerChild(child)

    super.domCommitInsertChild(child, at)
  }

  domCommitRemoveChild(child: Component) {
    this._unregisterChild(child)

    super.domCommitRemoveChild(child)
  }

  onPropChanged(name: string, style) {
    // if (name === 'style') {
    for (const leaf_comp of this._base) {
      leaf_comp.refreshProp('style')
    }
    // }
  }
}
