import { GraphSpecs } from '../types'
import { C } from './C'
import { G } from './G'
import { S } from './S'
import { U } from './U'

export interface PO {
  refGlobalUnit(id: string): void

  graph(): U & C & G

  attach($system: S): void

  getSpecs(): GraphSpecs
}
