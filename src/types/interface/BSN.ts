import { AN } from './AN'

export interface BSN extends AN {
  start(when: number, offset: number, duration: number): void
}
