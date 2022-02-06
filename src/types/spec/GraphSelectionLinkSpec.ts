import { IO } from '../IO'

export type GraphSelectionLinkSpec = {
  unitId: string
  type: IO
  pinId: string
  mergeId: string
  oppositePinId: string
}
