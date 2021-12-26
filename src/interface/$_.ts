import { System } from '../system'
import Pod from '../system/platform/method/process/Pod'
import { EE } from './EE'

export interface $_ extends EE {
  getGlobalId(): string

  getInterface(): string[]

  refSystem(): System | null

  refPod(): Pod | null

  attach(__system: System): void

  dettach(): void

  destroy(): void
}
