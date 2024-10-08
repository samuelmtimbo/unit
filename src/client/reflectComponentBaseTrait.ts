import { Style } from '../system/platform/Style'
import { Dict } from '../types/Dict'
import { LayoutNode } from './LayoutNode'
import { Component } from './component'
import { joinPath } from './component/app/graph/joinLeafPath'
import { LayoutBase } from './layout'

export const getBaseStyle = (
  base: LayoutBase,
  parentPath: string[],
  extractStyle: (leafId: string, leafComp: Component) => Style
) => {
  const base_style = base.map(([leaf_path, leaf_comp]) => {
    const leaf_id = joinPath([...parentPath, ...leaf_path])

    const leaf_style = extractStyle(leaf_id, leaf_comp)

    return leaf_style
  })

  return base_style
}

export const getParentPath = (component: Component, root: Component) => {
  let parent_path = []
  let p = component

  while (p.$parent && p !== root) {
    const sub_component_id = p.$parent.getSubComponentId(p)

    parent_path = [sub_component_id, ...parent_path]

    p = p.$parent
  }

  return parent_path
}

export type ExpandChildFunction = (
  leafId: string,
  component: Component
) => Style

export const expandSlot = (
  component: Component,
  slot_id: string,
  path: number[],
  extractStyle: ExpandChildFunction
) => {
  let child_leaf_path = (slot_id && slot_id.split('/')) || []

  let sub_component = component.pathGetSubComponent(child_leaf_path)

  let sub = sub_component

  let j = 0

  for (let i of path) {
    if (j === 0) {
      sub = sub.$parentChildren[i]?.getFirstRootLeaf()
    } else {
      sub = sub.$parentChildren[i] ?? sub.$parentRoot[i] ?? sub.$root[i]
    }

    j++
  }

  if (!sub) {
    return []
  }

  let children: Component[]

  if (path.length < 2) {
    children = sub.$parentChildren
  } else {
    children = sub.$parentRoot
  }

  const base = children.reduce((acc, child) => {
    const sub_component_id = child.$parent.getSubComponentId(child)

    return [
      ...acc,
      ...child
        .getRootBase()
        .map(([leaf_path, leaf_comp]) => [
          [sub_component_id, ...leaf_path],
          leaf_comp,
        ]),
    ]
  }, [])

  const base_style = getBaseStyle(base, [], extractStyle)

  return base_style
}

export const reflectComponentBaseTrait = (
  root: Component,
  root_prefix: string,
  prefix_leaf_id: string,
  component: Component,
  base: LayoutBase,
  style: Style,
  trait: LayoutNode,
  extractStyle: (leafId: string, component: Component) => Style,
  expand: boolean = true,
  path_: number[] = []
): Dict<LayoutNode> => {
  const {
    api: {
      layout: { reflectChildrenTrait },
    },
  } = root.$system

  const sub_component_id_slot: Dict<string> = {}

  const root_sub_sub_component_id: string[] = []

  const all_root_style = []

  const root_leaf_id: string[] = []
  const all_slot_base_id: Dict<Dict<string[]>> = {}

  const all_leaf_style: Dict<Style> = {}
  const all_slot_root_style: Dict<Dict<Style[]>> = {}
  const all_leaf_trait: Dict<LayoutNode> = {}
  const all_leaf_slot_path = {}
  const all_slot_base: Dict<string[]> = {}

  const expand_slot = (slot_id: string, path: number[]): Style[] => {
    if (!expand) {
      return []
    }

    return expandSlot(component, slot_id, path, (leaf_id, leaf_comp) => {
      return extractStyle(
        (root_prefix && `${root_prefix}/${leaf_id}`) || leaf_id,
        leaf_comp
      )
    })
  }

  for (const leaf of base) {
    const [leaf_path, leaf_comp] = leaf

    const leaf_id = joinPath(leaf_path)

    const sub_component_id = leaf_path[0]

    const sub_component = component.getSubComponent(sub_component_id)

    const leaf_parent_path = leaf_path.slice(0, leaf_path.length - 1)
    const leaf_parent_sub_id = leaf_path[leaf_path.length - 1]

    const leaf_parent_id = joinPath(leaf_parent_path)

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

    all_leaf_slot_path[leaf_id] = leaf_parent_slot_path

    const leaf_slot_id = joinPath(leaf_parent_slot_path)

    const is_root = leaf_slot_id === leaf_parent_id

    if (!is_root) {
      all_slot_base[leaf_slot_id] = all_slot_base[leaf_slot_id] || []
      all_slot_base[leaf_slot_id].push(leaf_id)
    }

    const leaf_style = extractStyle(
      `${prefix_leaf_id}${
        leaf_id === '' ? '' : `${prefix_leaf_id ? '/' : ''}${leaf_id}`
      }`,
      leaf_comp
    )

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
    [],
    (path) => {
      let children = root_leaf_id

      const [head, ...tail] = path

      const slot_id = children[head]

      return expand_slot(slot_id, [...path_, ...tail])
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
      [],
      (path) => {
        return expand_slot(slot_id, [...path_, ...path])
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
