import { Callback } from '../Callback'
import { BS } from './BS'

export interface BD {
  getServer(callback: Callback<BS>): void
}
