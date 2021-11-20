import { PO } from './PO'

export interface S {
  refPod: (id: string) => PO

  newPod(): string
}
