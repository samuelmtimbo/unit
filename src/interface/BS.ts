import { Callback } from '../Callback'
import { BSE } from './BSE'

export interface BS {
  getPrimaryService(name: string, callback: Callback<BSE>): void
}
