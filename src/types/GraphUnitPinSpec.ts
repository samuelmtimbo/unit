import { None } from './None'

export type GraphUnitPinSpec = {
  data?: string
  constant?: boolean | None
  ignored?: boolean | None
  ref?: boolean
  metadata?: {
    position?: { x: number; y: number }
  }
}
