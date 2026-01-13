import { Style, Tag } from '../system/platform/Style'
import { Tree } from '../tree'
import { Dict } from '../types/Dict'
import { mapObjVK } from '../util/object'
import { LayoutNode } from './LayoutNode'
import { extractComponentAttr } from './attr'
import { Component } from './component'
import { joinPath } from './component/app/graph/joinLeafPath'
import { LayoutBase } from './layout'
import { rawExtractStyle } from './rawExtractStyle'
import { extractTextContent } from './textContent'

export function buildTree(
  prefix: string,
  component: Component,
  base: LayoutBase,
  trait: LayoutNode,
  extractStyle: ExtractStyleFunction
): { tree: Tree<Tag>[]; map: Dict<Tree<Tag>>; root: string[] } {
  const tree: Tree<Tag>[] = []
  const map: Dict<Tree<Tag>> = {}
  const root: string[] = []

  const all_slot_base: Dict<string[]> = {}
  const all_leaf_parent_slot_id: Dict<string> = {}

  const leaf_id_set = new Set(
    base.map((leaf) => {
      const leaf_path = joinPath(leaf[0])

      return leaf_path
    })
  )

  const add = (
    leaf_id: string,
    leaf_comp: Component,
    leaf_slot_parent: Component
  ) => {
    const leaf_style = extractStyle(
      prefix ? (leaf_id ? `${prefix}/${leaf_id}` : prefix) : leaf_id,
      leaf_comp,
      leaf_slot_parent
    )

    const leaf_attr = extractComponentAttr(leaf_comp, trait)

    const textContent = extractTextContent(leaf_comp)

    const tag = {
      name: leaf_comp.$element.nodeName,
      style: leaf_style,
      attr: leaf_attr,
      textContent,
    }

    const node = {
      value: tag,
      children: [],
    }

    map[leaf_id] = node
  }

  for (const leaf of base) {
    const [leaf_path] = leaf

    const leaf_id = joinPath(leaf_path)

    let leaf_slot_id_cursor = leaf_id
    let leaf_slot_id_cursor_prev = null

    while (leaf_slot_id_cursor) {
      const leaf_slot_path = leaf_slot_id_cursor.split('/')

      const leaf_slot_parent_path = leaf_slot_path.slice(0, -1)
      const leaf_slot_sub_component_id =
        leaf_slot_path[leaf_slot_path.length - 1]

      const leaf_slot_parent = component.pathGetSubComponent(
        leaf_slot_parent_path
      )

      const leaf_slot_sub_component = leaf_slot_parent.getSubComponent(
        leaf_slot_sub_component_id
      )

      const leaf_slot_sub_component_parent_id =
        leaf_slot_parent.getSubComponentParentId(leaf_slot_sub_component_id)

      if (leaf_slot_sub_component_parent_id) {
        const leaf_slot_sub_component_parent = leaf_slot_parent.getSubComponent(
          leaf_slot_sub_component_parent_id
        )
        const leaf_slot_sub_component_parent_slot_name =
          leaf_slot_parent.getParentRootSlotId(leaf_slot_sub_component) ??
          'default'

        const leaf_slot_sub_component_parent_slot_path =
          leaf_slot_sub_component_parent.getSlotPath(
            leaf_slot_sub_component_parent_slot_name
          )

        const leaf_slot_sub_component_parent_slot =
          leaf_slot_sub_component_parent.pathGetSubComponent(
            leaf_slot_sub_component_parent_slot_path
          )

        const parent_leaf_slot_id_cursor = joinPath([
          ...leaf_slot_parent_path,
          leaf_slot_sub_component_parent_id,
          ...leaf_slot_sub_component_parent_slot_path,
        ])

        all_slot_base[parent_leaf_slot_id_cursor] =
          all_slot_base[parent_leaf_slot_id_cursor] ?? []

        const last_leaf_slot_id = leaf_slot_id_cursor_prev ?? leaf_id

        if (
          !map[parent_leaf_slot_id_cursor] &&
          !leaf_slot_sub_component_parent_slot.isParent()
        ) {
          add(
            parent_leaf_slot_id_cursor,
            leaf_slot_sub_component_parent_slot,
            leaf_slot_sub_component_parent_slot
          )
        }

        if (
          !all_slot_base[parent_leaf_slot_id_cursor].includes(last_leaf_slot_id)
        ) {
          all_slot_base[parent_leaf_slot_id_cursor].push(last_leaf_slot_id)
          all_leaf_parent_slot_id[last_leaf_slot_id] =
            parent_leaf_slot_id_cursor
        }

        leaf_slot_id_cursor_prev = parent_leaf_slot_id_cursor
        leaf_slot_id_cursor = parent_leaf_slot_id_cursor
      } else {
        if (leaf_slot_parent_path.length > 0) {
          leaf_slot_id_cursor = joinPath(leaf_slot_parent_path)
        } else {
          leaf_slot_id_cursor = null
        }
      }
    }
  }

  for (const leaf of base) {
    const [leaf_path, leaf_comp] = leaf

    const leaf_id = joinPath(leaf_path)

    const leaf_parent_slot_id = all_leaf_parent_slot_id[leaf_id] ?? ''
    const leaf_parent_slot_path = leaf_parent_slot_id.split('/')
    const leaf_parent_slot = component.pathGetSubComponent(
      leaf_parent_slot_path
    )

    let p = all_leaf_parent_slot_id[leaf_id]

    let is_root = !p || !leaf_id_set.has(p)

    while (p) {
      if (leaf_id_set.has(p)) {
        is_root = false

        break
      }

      p = all_leaf_parent_slot_id[p]
    }

    if (!map[leaf_id]) {
      add(leaf_id, leaf_comp, leaf_parent_slot)
    }

    if (is_root) {
      root.push(leaf_id)

      const node = map[leaf_id]

      tree.push(node)
    }
  }

  for (const slot_id in all_slot_base) {
    const slot_base = all_slot_base[slot_id]

    if (!map[slot_id]) {
      const slot_path = slot_id.split('/')

      add(slot_id, component.pathGetSubComponent(slot_path), null)
    }

    const slot_node = map[slot_id]

    for (const leaf_id of slot_base) {
      if (!map[leaf_id]) {
        const leaf_path = leaf_id.split('/')

        add(leaf_id, component.pathGetSubComponent(leaf_path), null)
      }

      const leaf_node = map[leaf_id]

      slot_node.children.push(leaf_node)
    }
  }

  return { tree, map, root }
}

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

export type ExtractStyleFunction = (
  leafId: string,
  component: Component,
  parent: Component
) => Style

export const getChildLeaves = (component: Component): Component[] => {
  let leaves: Component[] = []

  component.$parentChildren.forEach((child) => {
    const base = child.getRootLeaves()

    leaves.push(...base)
  })

  for (const child of component.$domChildren) {
    if (!leaves.includes(child)) {
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
  extractStyle: ExtractStyleFunction
): Tag[] => {
  const slot_path = slotId.split('/')

  let slot = component.pathGetSubComponent(slot_path)

  if (expand) {
    if (!slot.isBase()) {
      slot = slot.getFirstRootLeaf()
    }
  }

  let parent = slot

  for (let i of path) {
    const all = parent.isBase()
      ? getChildLeaves(parent)
      : parent.getRootLeaves()

    parent = all[i]

    if (!parent) {
      return []
    }
  }

  const leaves = []
  const styles: Tag[] = []

  const sub_parent_path = getParentPath(parent, component)

  const sub_sub_component_id = sub_parent_path[0]

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
        const leaf_attr = extractComponentAttr(leaf_comp, trait)

        const textContent = extractTextContent(leaf_comp)

        styles.push({
          name: leaf_comp.$element.nodeName,
          attr: leaf_attr,
          style: leaf_style,
          textContent,
        })
      }
    }
  })

  parent.$domChildren.forEach((child) => {
    if (!leaves.includes(child)) {
      const attr = extractComponentAttr(child, trait)
      const style = rawExtractStyle(
        child.$element,
        trait,
        component.$system.api.text.measureText
      )

      const textContent = extractTextContent(child)

      styles.push({
        name: child.$element.nodeName,
        attr,
        style,
        textContent,
      })
    }
  })

  return styles
}

export const reflectComponentBaseTrait = (
  root: Component,
  prefix: string,
  component: Component,
  base: LayoutBase,
  trait: LayoutNode,
  extractStyle: ExtractStyleFunction,
  expand: boolean = true
): Dict<LayoutNode> => {
  const {
    api: {
      layout: { reflectTreeTrait },
    },
  } = root.$system

  const expandSlot_ = (slot_id: string, path: number[]): Tag[] => {
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

  const {
    tree,
    map,
    root: root_,
  } = buildTree(prefix, component, base, trait, extractStyle)

  reflectTreeTrait(root.$system, trait, tree, (path) => {
    const [head, ...tail] = path

    const slot_id = root_[head]

    return expandSlot_(slot_id, tail)
  })

  const traits = mapObjVK(
    map,
    (node: Tree<Tag & { trait: LayoutNode }>) => node.value.trait
  )

  return traits
}
