import { GraphSpecs } from '../types'
import { C } from './C'
import { G } from './G'
import { U } from './U'

export interface PO {
  refUnit(id: string): void

  refGraph(id: string): U & C & G

  addGraph(): string

  getSpecs(): GraphSpecs
}
