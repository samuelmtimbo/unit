import { Callback } from '../Callback'

export interface MS {
  get(callback: Callback<MediaStream>): void
}
