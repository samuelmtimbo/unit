import { Component } from '../../../../../client/component'
import { LayoutNode } from '../../../../../client/LayoutNode'
import { Tree } from '../../../../../Tree'

export type LayoutLeaf = [string[], Component]
export type LayoutBase = LayoutLeaf[]
export type LayoutTree = Tree<Component>
export type TraitTree = Tree<LayoutNode>
