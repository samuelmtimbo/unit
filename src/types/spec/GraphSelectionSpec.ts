import { IO } from '../IO'

export type GraphSelectionSpec = {
  unitId: string
  type: IO
  pinId: string
  mergeId: string
  oppositePinId: string
}
