import { Style, Tag } from '../system/platform/Style'
import { Dict } from '../types/Dict'
import { LayoutNode } from './LayoutNode'
import { Component } from './component'
import { joinPath } from './component/app/graph/joinLeafPath'
import { extractTrait } from './extractTrait'
import { LayoutBase } from './layout'
import { rawExtractStyle } from './rawExtractStyle'

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
  component: Component,
  parent: Component
) => Style

export const getChildLeaves = (
  component: Component,
  expand: boolean
): Component[] => {
  let leaves: Component[] = []

  const base = component.$parentChildren.reduce((acc, child) => {
    const base = child.getRootLeaves()

    return [...acc, ...base]
  }, [])

  if (expand) {
    for (const leaf_comp of base) {
      leaves.push(leaf_comp)
    }
  }

  for (const child of component.$domChildren) {
    if (!leaves.includes(child) && !base.includes(child)) {
      leaves.push(child)
    }
  }

  return leaves
}

export const expandSlot = (
  component: Component,
  trait: LayoutNode,
  slotId: string,
  path: number[],
  expand: boolean,
  extractStyle: ExpandChildFunction
): Tag[] => {
  const slot_path = slotId.split('/')

  const slot = component.pathGetSubComponent(slot_path)

  let parent = slot

  for (let i of path) {
    const all = getChildLeaves(parent, true)

    parent = all[i]

    if (!parent) {
      return []
    }
  }

  const leaves = []
  const styles: Tag[] = []

  const sub_parent_path = getParentPath(parent, component)

  const sub_sub_component_id = sub_parent_path[0]

  // if (expand || path.length === 0) {
  parent.$parentChildren.forEach((child) => {
    const parent_path = getParentPath(child, component)

    const child_sub_component_id = parent_path[0]

    if (child_sub_component_id === sub_sub_component_id || expand) {
      const base = child
        .getRootBase()
        .map(([leaf_path, leaf_comp]) => [
          [...parent_path, ...leaf_path],
          leaf_comp,
        ]) as LayoutBase

      for (const [leaf_path, leaf_comp] of base) {
        leaves.push(leaf_comp)

        const leaf_id = joinPath(leaf_path)
        const leaf_style = extractStyle(leaf_id, leaf_comp, parent)

        styles.push({
          name: leaf_comp.$element.nodeName,
          style: leaf_style,
          textContent:
            ((leaf_comp.$element as HTMLElement).children?.length ?? 1) > 0
              ? ''
              : leaf_comp.$element.textContent,
        })
      }
    }
  })
  // }

  for (const child of parent.$domChildren) {
    if (!leaves.includes(child)) {
      const style = rawExtractStyle(
        child.$element,
        trait,
        component.$system.api.text.measureText
      )

      styles.push({
        name: child.$element.nodeName,
        style,
        textContent: child.$element.textContent,
      })
    }
  }

  return styles
}

export const reflectComponentBaseTrait = (
  root: Component,
  prefix: string,
  component: Component,
  base: LayoutBase,
  style: Style,
  trait: LayoutNode,
  extractStyle: ExpandChildFunction,
  expand: boolean = true
): Dict<LayoutNode> => {
  const {
    api: {
      layout: { reflectChildrenTrait },
      text: { measureText },
    },
  } = root.$system

  const sub_component_id_slot: Dict<string> = {}

  const root_sub_sub_component_id: string[] = []

  const all_root_style: Tag[] = []

  const root_leaf_id: string[] = []
  const all_slot_base_id: Dict<Dict<string[]>> = {}

  const all_leaf_style: Dict<Tag> = {}
  const all_slot_root_style: Dict<Dict<Style[]>> = {}
  const all_leaf_trait: Dict<LayoutNode> = {}
  const all_leaf_slot_path = {}
  const all_slot_base: Dict<string[]> = {}
  const all_slot_base_parent: Dict<string> = {}
  const all_slot_wrap: Dict<boolean> = {}

  const expand_slot = (slot_id: string, path: number[]): Tag[] => {
    return expandSlot(
      root,
      trait,
      (prefix && slot_id && `${prefix}/${slot_id}`) || prefix || slot_id,
      path,
      expand,
      (leaf_id, leaf_comp, leaf_parent) => {
        return extractStyle(leaf_id, leaf_comp, leaf_parent)
      }
    )
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

    let leaf_parent_slot_path: string[] = []
    let leaf_parent_slot: Component = component

    if (sub_component_parent_id) {
      const sub_component_parent = component.getSubComponent(
        sub_component_parent_id
      )

      leaf_parent_slot_path = [sub_component_parent_id]
      leaf_parent_slot = sub_component

      let p = sub_component_parent

      let s = p.getParentRootSlotId(leaf_parent_slot)

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

    leaf_parent_slot = component.pathGetSubComponent(leaf_parent_slot_path)

    const leaf_slot_id = joinPath(leaf_parent_slot_path)

    const is_root = leaf_slot_id === leaf_parent_id

    if (!is_root) {
      all_slot_base[leaf_slot_id] = all_slot_base[leaf_slot_id] || []
      all_slot_base[leaf_slot_id].push(leaf_id)
      all_slot_wrap[leaf_slot_id] = leaf_parent_slot.$wrap

      all_slot_base_parent[leaf_id] = leaf_slot_id
    }

    const leaf_style = extractStyle(
      `${prefix}${leaf_id === '' ? '' : `${prefix ? '/' : ''}${leaf_id}`}`,
      leaf_comp,
      leaf_parent_slot
    )

    all_leaf_style[leaf_id] = {
      name: leaf_comp.$element.nodeName,
      style: leaf_style,
      textContent: leaf_comp.$element.textContent,
    }

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

      all_root_style.push({
        name: leaf_comp.$element.nodeName,
        style: leaf_style,
        textContent: '',
      })
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

    let slot_style = all_leaf_style[slot_id].style || {}

    let effective_slot_id = slot_id

    do {
      const slot_parent_id = all_slot_base_parent[effective_slot_id]

      if (slot_parent_id) {
        slot_style = all_leaf_style[slot_parent_id].style || {}
      }

      effective_slot_id = slot_parent_id
    } while (all_slot_wrap[effective_slot_id])

    const slot_all_style = slot_base.map(
      (leaf_id) => all_leaf_style[leaf_id],
      []
    )

    let slot_trait: LayoutNode = all_leaf_trait[slot_id]

    if (!slot_trait) {
      const slot_path = slot_id.split('/')

      const slot = component.pathGetSubComponent(slot_path)

      if (slot.isBase()) {
        slot_trait = extractTrait(slot, measureText)
      } else {
        slot_trait = trait
      }
    }

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
