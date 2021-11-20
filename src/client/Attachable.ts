import { System } from '../system'
import { Unlisten } from '../Unlisten'

export interface Attachable {
  attach: ($system: System) => void
  dettach: Unlisten
}
