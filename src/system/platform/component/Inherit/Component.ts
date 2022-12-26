import { Component } from '../../../../client/component'
import { Element } from '../../../../client/element'
import parentElement from '../../../../client/platform/web/parentElement'
import { System } from '../../../../system'
import { IHTMLDivElement } from '../../../../types/global/dom'
import { Unlisten } from '../../../../types/Unlisten'
import { Style } from '../../Props'

export interface Props {
  style: Style
}

export const DEFAULT_STYLE = {}

export default class Inherit extends Element<IHTMLDivElement, Props> {
  $wrap = true

  constructor(props: Props, $system: System) {
    super(props, $system)

    const $element = parentElement($system)

    $element.className = 'default-style'

    this.$element = $element

    this.$slot = {
      default: this,
    }
  }

  private _base: Component[] = []
  private _unlisten: Unlisten[] = []

  private _registerChild = (child) => {
    let base = child.getRootBase()

    for (const parent_root of child.$parentRoot) {
      const parent_child_base = parent_root.getRootBase()

      base = [...base, ...parent_child_base]
    }

    for (const parent_child of child.$parentChildren) {
      const parent_child_base = parent_child.getRootBase()

      base = [...base, ...parent_child_base]
    }

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

    for (const parent_child of child.$parentChildren) {
      const parent_child_base = parent_child.getRootBase()

      base = [...base, ...parent_child_base]
    }

    const base_length = base.length

    const first_leaf = base[0]

    if (first_leaf) {
      const [_, first_leaf_comp] = first_leaf

      const first_leaf_index = this._base.indexOf(first_leaf_comp)

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

  domAppendParentChildAt(
    child: Component,
    slotName: string,
    at: number,
    _at: number
  ) {
    this._registerChild(child)

    super.domAppendParentChildAt(child, slotName, at, _at)
  }

  domAppendParentRoot(child: Component, slotName: string, at: number) {
    this._registerChild(child)

    super.domAppendParentRoot(child, slotName, at)
  }

  domRemoveParentRootAt(
    component: Component,
    slotName: string,
    at: number,
    _at: number
  ) {
    this._unregisterChild(component)

    super.domRemoveParentRootAt(component, slotName, at, _at)
  }

  domRemoveParentChildAt(
    child: Component,
    slotName: string,
    at: number,
    _at: number
  ) {
    this._unregisterChild(child)

    super.domRemoveParentChildAt(child, slotName, at, _at)
  }

  onPropChanged(name: string, style) {
    // if (name === 'style') {
    for (const leaf_comp of this._base) {
      leaf_comp.refreshProp('style')
    }
    // }
  }
}
