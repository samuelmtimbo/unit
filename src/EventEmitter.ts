import { ListenerNotFoundError } from './Class/ListenerNotFoundError'
import { EE } from './interface/EE'
import { Dict } from './types/Dict'
import { Unlisten } from './Unlisten'

export class EventEmitter_ implements EE {
  private __listeners: Dict<Function[]> = {}

  constructor() {}

  private _removeListener = (
    event: string,
    listener: (...data: any[]) => void
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

  prependListener(event: string, listener: (...data: any[]) => void): Unlisten {
    this.__listeners[event] = this.__listeners[event] || []
    this.__listeners[event].unshift(listener)

    this.emit('listen', { event })

    return () => {
      this._removeListener(event, listener)
    }
  }

  removeListener(event: string, listener: (...data: any) => void): void {
    this._removeListener(event, listener)
  }

  addListener(event: string, listener: (...data: any[]) => void): Unlisten {
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

  listenerCount(name: string): number {
    return (this.__listeners[name] || []).length
  }

  emit(event: string, ...args: any[]): void {
    const listeners = [...(this.__listeners[event] || [])]

    for (const listener of listeners) {
      listener.call(this, ...args)
    }
  }
}
