import { Dict } from '../types/Dict'
import { Listener } from '../types/Listener'
import { Unlisten } from '../types/Unlisten'

export interface EE<
  _EE extends Dict<any[]> = any,
  __EE extends Dict<any[]> = any
> {
  addListener<K extends keyof _EE>(
    event: K,
    listener: Listener<_EE[K]>
  ): Unlisten

  prependListener<K extends keyof _EE>(
    event: K,
    listener: Listener<_EE[K]>
  ): Unlisten

  removeListener<K extends keyof _EE>(
    event: K,
    listener: Listener<_EE[K]>
  ): void

  eventNames(): string[]

  emit<K extends keyof _EE>(event: K, ...args: _EE[K]): void

  listenerCount(name: keyof _EE): number

  refEmitter(): EE<__EE> | null
}
