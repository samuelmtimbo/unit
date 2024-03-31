import { CH } from './CH'

export interface W extends CH {
  postMessage(data: any, target: string, transferables: Transferable[]): void
}
