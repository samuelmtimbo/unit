import { Pod } from '../pod'
import { System } from '../system'
import { EE } from './EE'

export interface _<_EE extends Record<string, any[]> = {}> extends EE<_EE> {
  getGlobalId(): string

  getInterface(): string[]

  refSystem(): System | null

  refPod(): Pod | null

  destroy(): void
}
