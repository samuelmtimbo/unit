import { Spec } from '..'
import { Dict } from '../Dict'
import { GraphSpec } from '../GraphSpec'
import { GraphSpecs } from '../GraphSpecs'

export interface RE {
  newSpecId(): string
  hasSpec(id: string): boolean
  emptySpec(partial?: Partial<GraphSpec>): GraphSpec
  newSpec(spec: GraphSpec, id?: string): GraphSpec
  getSpec(id: string): Spec
  setSpec(id: string, spec: GraphSpec): void
  shouldFork(id: string): boolean
  forkSpec(spec: GraphSpec, specId?: string): [string, GraphSpec]
  injectSpecs(specs: GraphSpecs): Dict<string>
  deleteSpec(id: string): void
  registerUnit(id: string): void
  unregisterUnit(id: string): void
  lockSpec(id: string): void
  unlockSpec(id: string): void
}
