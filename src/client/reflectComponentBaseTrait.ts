import { joinLeafPath } from '../system/platform/component/app/Editor/Component'
import { LayoutBase } from '../system/platform/component/app/Editor/layout'
import { Style } from '../system/platform/Props'
import { Tree } from '../Tree'
import { Dict } from '../types/Dict'
import { Component } from './component'
import { LayoutNode } from './LayoutNode'
import { reflectChildrenTrait } from './reflectChildrenTrait'

export const getBaseStyle = (
  base: LayoutBase,
  parentPath: string[],
  extractStyle: (leafId: string, component: Component) => Style
) => {
  const base_style = base.map(([leaf_path, leaf_comp]) => {
    const leaf_id = joinLeafPath([...parentPath, ...leaf_path])

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
  root: Component,
  component: Component,
  slot_id: string,
  path: number[],
  parent_slot_base: Dict<string[]>,
  extractStyle: ExpandChildFunction
) => {
  let slot_base_ids = parent_slot_base[slot_id]

  let child_leaf_id = slot_id
  let child_leaf_path = (slot_id && slot_id.split('/')) || []

  if (!slot_base_ids) {
    const sub_component = component.pathGetSubComponent(child_leaf_path)

    let sub = sub_component

    let j = 0

    for (let i of path) {
      if (j === 1) {
        sub = sub.$parentRoot[i] ?? sub.$root[i]
      } else if (j == 2) {
        sub = sub.$parentRoot[i]
      } else {
        sub = sub.$parentChildren[i]
      }

      j++
    }

    if (!sub) {
      return []
    }

    let base

    if (path.length >= 1) {
      const parent_path = getParentPath(sub, root)

      base = sub.getRootBase().map(([leaf_path, leaf_comp]) => {
        return [[...parent_path, ...leaf_path], leaf_comp]
      })
    } else {
      base = sub.$parentChildren.reduce((acc, parentChild) => {
        const sub_component_id =
          parentChild.$parent.getSubComponentId(parentChild)

        return [
          ...acc,
          ...parentChild
            .getRootBase()
            .map(([leaf_path, leaf_comp]) => [
              [sub_component_id, ...leaf_path],
              leaf_comp,
            ]),
        ]
      }, [])
    }

    const base_style = getBaseStyle(base, [], extractStyle)

    return base_style
  }

  if (path.length === 0) {
    const sub_component = component.pathGetSubComponent(child_leaf_path)

    const base = sub_component.$parentChildren.reduce((acc, parentChild) => {
      const sub_component_id =
        parentChild.$parent.getSubComponentId(parentChild)

      return [
        ...acc,
        ...parentChild
          .getRootBase()
          .map(([leaf_path, leaf_comp]) => [
            [sub_component_id, ...leaf_path],
            leaf_comp,
          ]),
      ]
    }, [])

    const base_style = base.map(([leaf_path, leaf_comp]) => {
      const leaf_id = joinLeafPath(leaf_path)

      const leaf_style = extractStyle(leaf_id, leaf_comp)

      return leaf_style
    })

    return base_style
  }

  for (const i of path) {
    if (child_leaf_id === slot_base_ids[i]) {
      return []
    }

    child_leaf_id = slot_base_ids[i]
    child_leaf_path = child_leaf_id.split('/')

    slot_base_ids = parent_slot_base[child_leaf_id]

    if (!slot_base_ids) {
      const child_leaf_path = child_leaf_id.split('/')

      const child_leaf_comp = component.pathGetSubComponent(child_leaf_path)

      slot_base_ids = child_leaf_comp.$parentChildren.reduce(
        (acc, parentChild) => {
          let i = 0

          let parent_sub_component_id = null
          let parent = parentChild.$parent
          let child = parentChild
          let parent_path = []

          while (parent && parent !== component.$parent) {
            parent_path.unshift(parent.getSubComponentId(child))

            child = parent
            parent = parent.$parent
          }

          while (!parent_sub_component_id && parent) {
            parent_sub_component_id = component.getSubComponentId(parent)

            parent_path.unshift

            parent = parent.$parent

            i++
          }

          const parent_leaf_path = child_leaf_path.slice(
            0,
            child_leaf_path.indexOf(parent_sub_component_id) + i
          )

          const sub_component_id =
            parentChild.$parent.getSubComponentId(parentChild)

          return [
            ...acc,
            ...parentChild
              .getRootBase()
              .map(([leaf_path]) =>
                joinLeafPath([...parent_path, ...leaf_path])
              ),
          ]
        },
        []
      )
    }
  }

  const base_style = slot_base_ids.map((leaf_id) => {
    const leaf_path = leaf_id.split('/')

    const leaf_comp = component.pathGetSubComponent(leaf_path)

    const leaf_style = extractStyle(leaf_id, leaf_comp)

    return leaf_style
  })

  return base_style
}

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
  root: Component,
  root_prefix: string,
  prefix_leaf_id: string,
  component: Component,
  base: LayoutBase,
  style: Style,
  trait: LayoutNode,
  extractStyle: (leafId: string, component: Component) => Style,
  expand_children: boolean = true
): Dict<LayoutNode> => {
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
    return expandSlot(
      root,
      component,
      slot_id,
      path,
      all_slot_base,
      (leaf_id, leaf_comp) => {
        return extractStyle(
          (root_prefix && `${root_prefix}/${leaf_id}`) || leaf_id,
          leaf_comp
        )
      }
    )
  }

  for (const leaf of base) {
    const [leaf_path, leaf_comp] = leaf

    const leaf_id = joinLeafPath(leaf_path)

    const sub_component_id = leaf_path[0]

    const sub_component = component.getSubComponent(sub_component_id)

    const leaf_parent_path = leaf_path.slice(0, leaf_path.length - 1)
    const leaf_parent_sub_id = leaf_path[leaf_path.length - 1]

    const leaf_parent_id = joinLeafPath(leaf_parent_path)

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

    const leaf_slot_id = joinLeafPath(leaf_parent_slot_path)

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

  const [all_root_trait, root_size] = reflectChildrenTrait(
    trait,
    style,
    all_root_style,
    (path) => {
      let children = root_leaf_id

      const [head, ...tail] = path

      const slot_id = children[head]

      return expand_slot(slot_id, tail)
    },
    [],
    null,
    expand_children
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

    const [slot_base_trait] = reflectChildrenTrait(
      slot_trait,
      slot_style,
      slot_all_style,
      (path) => {
        return expand_slot(slot_id, path)
      },
      [],
      null
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
