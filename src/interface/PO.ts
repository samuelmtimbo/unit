import { C } from './C'
import { G } from './G'
import { U } from './U'

export interface PO<I = any, O = any> {
  refGlobalUnit(id: string): void

  graph(): U & C & G
}
