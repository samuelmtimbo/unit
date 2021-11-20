import { Callback } from '../Callback'
import { BC } from './BC'

export interface BSE {
  getCharacteristic(name: string, callback: Callback<BC>): void
}
