import { ListenerNotFoundError } from './exception/ListenerNotFoundError'
import { EE } from './interface/EE'
import { Dict } from './types/Dict'
import { Listener } from './types/Listener'
import { Unlisten } from './types/Unlisten'

export type EventEmitter_EE<_EE extends Dict<any[]>> = {
  listen: [{ event: 'listen' | keyof _EE }]
  unlisten: [{ event: 'unlisten' | keyof _EE }]
}

export class EventEmitter<
  _EE extends EventEmitter_EE<_EE> & Dict<any[]> = Dict<any> & {
    listen: [{ event: 'listen' }]
    unlisten: [{ event: 'unlisten' }]
  }
> implements EE<_EE>
{
  private __listeners: {
    [K in keyof _EE]?: Listener<_EE[K]>[]
  } = {}

  private _removeListener = <K extends keyof _EE>(
    event: K,
    listener: Listener<_EE[K]>
  ) => {
    const listeners = this.__listeners[event]

    if (!listeners) {
      throw new ListenerNotFoundError()
    }

    const i = listeners.indexOf(listener)

    if (i < 0) {
      throw new ListenerNotFoundError()
    }

    listeners.splice(i, 1)

    if (listeners.length === 0) {
      delete this.__listeners[event]

      this.emit('unlisten', { event })
    }
  }

  prependListener<K extends keyof _EE>(
    event: K,
    listener: Listener<_EE[K]>
  ): Unlisten {
    this.__listeners[event] = this.__listeners[event] || []
    this.__listeners[event].unshift(listener)

    this.emit('listen', { event })

    return () => {
      this._removeListener(event, listener)
    }
  }

  removeListener<K extends keyof _EE>(
    event: K,
    listener: Listener<_EE[K]>
  ): void {
    this._removeListener(event, listener)
  }

  addListener<K extends keyof _EE>(
    event: K,
    listener: Listener<_EE[K]>
  ): Unlisten {
    this.__listeners[event] = this.__listeners[event] || []
    this.__listeners[event].push(listener)

    this.emit('listen', { event })

    return () => {
      this._removeListener(event, listener)
    }
  }

  eventNames(): string[] {
    return Object.keys(this.__listeners)
  }

  listenerCount<K extends keyof _EE>(name: K): number {
    return (this.__listeners[name] || []).length
  }

  emit<K extends keyof _EE>(event: K, ...args: _EE[K]): void {
    const listeners = this.__listeners[event]

    if (!listeners) {
      return
    }

    for (const listener of listeners) {
      listener.call(this, ...args)
    }
  }

  refEmitter(): EE<any, any> {
    return null
  }
}
