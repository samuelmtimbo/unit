import { EE } from './EE'

export interface $_<_EE extends Record<string, any[]> = {}> extends EE<_EE> {
  getGlobalId(): string
  getInterface(): string[]
  destroy(): void
}
