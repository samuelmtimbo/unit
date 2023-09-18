import { CH } from './CH'
import { EE } from './EE'

export interface W extends CH, EE<any> {
  window(): Window
  postMessage(data: any, target: string): void
}
