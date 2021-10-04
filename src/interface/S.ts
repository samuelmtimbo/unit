import { GraphSpec } from './../types/index'
import { Unlisten } from './../Unlisten'
import { PO } from './PO'

export interface S extends PO {
  pod(): PO

  mount($root: HTMLElement): Unlisten

  start(spec: GraphSpec): void

  stop(): void

  restart(): void
}
