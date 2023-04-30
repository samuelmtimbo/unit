import {
  getLeafId,
  LayoutBase,
} from '../system/platform/component/app/Editor/Component'
import { Style } from '../system/platform/Props'
import { Tree } from '../Tree'
import { Dict } from '../types/Dict'
import { Component } from './component'
import { LayoutNode } from './LayoutNode'
import { reflectChildrenTrait } from './reflectChildrenTrait'
import { Size } from './util/geometry'

export const reflectStyleTreeTrait = (
  trait: LayoutNode,
  tree: Tree<Style>
): Tree<LayoutNode> => {
  return {
    value: trait,
    parent: null,
    children: [],
  }
}

export const reflectComponentBaseTrait = (
  component: Component,
  base: LayoutBase,
  style: Style,
  trait: LayoutNode,
  measureText: (text: string, fontSize: number) => Size,
  extractStyle: (leafId: string, component: Component) => Style
): Dict<LayoutNode> => {
  const sub_component_id_slot: Dict<string> = {}

  const root_sub_sub_component_id: string[] = []

  const all_root_style = []

  const root_leaf_id: string[] = []
  const all_slot_base_id: Dict<Dict<string[]>> = {}

  const all_leaf_style: Dict<Style> = {}
  const all_slot_root_style: Dict<Dict<Style[]>> = {}
  const all_slot_trait: Dict<Dict<LayoutNode[]>> = {}
  const all_leaf_trait: Dict<LayoutNode> = {}
  const all_leaf_slot_path = {}
  const all_leaf_slot_trait = {}
  const all_slot_base: Dict<string[]> = {}

  const expand_slot = (slot_id: string, path: number[]): Style[] => {
    if (slot_id === '') {
      return []
    }

    const slot_base = all_slot_base[slot_id] ?? []

    let _slot_base = slot_base

    const _component =
      slot_id === ''
        ? component
        : component.pathGetSubComponent(slot_id.split('/'))

    let base: LayoutBase = _component.$parentChildren.reduce((acc, c) => {
      return [...acc, ...c.getRootBase()]
    }, [])

    if (slot_id !== '') {
      for (const p of path) {
        const leaf_id = _slot_base[p]
        const leaf_path = leaf_id.split('/')

        let sub_component = component.pathGetSubComponent(leaf_path)

        _slot_base = all_slot_base[leaf_id]

        base = sub_component.$parentChildren.reduce((acc, c) => {
          return [...acc, ...c.getRootBase()]
        }, [])
      }
    }

    const children_styles = base.map(([leaf_path, leaf_comp]) => {
      const leaf_id = getLeafId(leaf_path)

      return extractStyle(leaf_id, leaf_comp)
    })

    return children_styles
  }

  for (const leaf of base) {
    const [leaf_path, leaf_comp] = leaf

    const leaf_id = getLeafId(leaf_path)

    const sub_component_id = leaf_path[0]

    const sub_component = component.getSubComponent(sub_component_id)

    const leaf_parent_path = leaf_path.slice(0, leaf_path.length - 1)
    const leaf_parent_sub_id = leaf_path[leaf_path.length - 1]

    const leaf_parent_id = getLeafId(leaf_parent_path)

    const sub_component_parent_id: string =
      component.getSubComponentParentId(sub_component_id)

    const leaf_parent_comp = component.pathGetSubComponent(leaf_parent_path)

    const leaf_parent_parent_id =
      leaf_parent_comp.getSubComponentParentId(leaf_parent_sub_id)

    let leaf_parent_slot_path

    if (sub_component_parent_id) {
      const sub_component_parent = component.getSubComponent(
        sub_component_parent_id
      )

      leaf_parent_slot_path = [sub_component_parent_id]

      let c = sub_component
      let p = sub_component_parent

      let s = p.getParentRootSlotId(c)

      while (p) {
        const slot_sub_component_id = p.getSlotSubComponentId(s)
        const slot_target = p.$slotTarget[s]

        if (slot_sub_component_id) {
          const slot_sub_component_parent_id = p.getSubComponentParentId(
            slot_sub_component_id
          )

          // leaf_parent_slot_path.push(
          //   slot_sub_component_parent_id ?? slot_sub_component_id
          // )
          leaf_parent_slot_path.push(slot_sub_component_id)

          p = p.getSubComponent(slot_sub_component_id)

          s = slot_target
        } else {
          break
        }
      }
    } else {
      leaf_parent_slot_path = leaf_parent_parent_id
        ? [...leaf_parent_path, leaf_parent_parent_id]
        : leaf_parent_path
    }

    const slot = component.pathGetSubComponent(leaf_parent_slot_path)

    all_leaf_slot_path[leaf_id] = leaf_parent_slot_path

    const leaf_slot_id = getLeafId(leaf_parent_slot_path)

    const is_root = leaf_slot_id === leaf_parent_id

    if (!is_root) {
      all_slot_base[leaf_slot_id] = all_slot_base[leaf_slot_id] || []
      all_slot_base[leaf_slot_id].push(leaf_id)
    }

    const leaf_style = extractStyle(leaf_id, leaf_comp)

    all_leaf_style[leaf_id] = leaf_style

    if (sub_component_parent_id) {
      const sub_component_parent = component.getSubComponent(
        sub_component_parent_id
      )

      const sub_parent_root_index =
        sub_component_parent.$parentRoot.indexOf(sub_component)
      const sub_component_slot_name =
        sub_component_parent.$parentRootSlotName[sub_parent_root_index]

      sub_component_id_slot[sub_component_id] = sub_component_slot_name

      all_slot_root_style[sub_component_parent_id] =
        all_slot_root_style[sub_component_parent_id] || {}
      all_slot_root_style[sub_component_parent_id][sub_component_slot_name] =
        all_slot_root_style[sub_component_parent_id][sub_component_slot_name] ||
        []
      all_slot_root_style[sub_component_parent_id][
        sub_component_slot_name
      ].push(leaf_style)

      all_slot_base_id[sub_component_parent_id] =
        all_slot_base_id[sub_component_parent_id] || {}
      all_slot_base_id[sub_component_parent_id][sub_component_slot_name] =
        all_slot_base_id[sub_component_parent_id][sub_component_slot_name] || []
      all_slot_base_id[sub_component_parent_id][sub_component_slot_name].push(
        leaf_id
      )
    } else if (is_root) {
      root_sub_sub_component_id.push(sub_component_id)

      all_root_style.push(leaf_style)
      root_leaf_id.push(leaf_id)
    }
  }

  const all_root_trait = reflectChildrenTrait(
    trait,
    style,
    all_root_style,
    (path) => {
      let children = root_leaf_id

      const [head, ...tail] = path

      const slot_id = children[head]

      return expand_slot(slot_id, tail)
    }
  )

  let root_leaf_i = 0
  for (const leaf_id of root_leaf_id) {
    all_leaf_trait[leaf_id] = all_root_trait[root_leaf_i]

    root_leaf_i++
  }

  for (const slot_id in all_slot_base) {
    const slot_base = all_slot_base[slot_id]

    const slot_style = all_leaf_style[slot_id] || {}
    const slot_all_style = slot_base.map(
      (leaf_id) => all_leaf_style[leaf_id],
      []
    )

    const slot_trait: LayoutNode = all_leaf_trait[slot_id] || trait

    const slot_base_trait = reflectChildrenTrait(
      slot_trait,
      slot_style,
      slot_all_style,
      (path) => {
        return expand_slot(slot_id, path)
      }
    )

    let leaf_i = 0
    for (const leaf_id of slot_base) {
      const leaf_slot_trait = slot_base_trait[leaf_i]

      all_leaf_trait[leaf_id] = leaf_slot_trait

      leaf_i++
    }
  }

  return all_leaf_trait
}
