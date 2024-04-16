import { Tree } from '../Tree'
import { LayoutNode } from './LayoutNode'
import { Component } from './component'

export type LayoutLeaf = [string[], Component]
export type LayoutBase = LayoutLeaf[]
export type LayoutTree = Tree<Component>
export type TraitTree = Tree<LayoutNode>
