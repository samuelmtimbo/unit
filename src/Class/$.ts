import { EventEmitter2 } from 'eventemitter2'
import { deleteGlobalRef, setGlobalRef } from '../global'
import { $_ } from '../interface/$_'
import { PO } from '../interface/PO'
import { System } from '../system'
import { Unlisten } from '../Unlisten'
import { Dict } from './../types/Dict'

export class $ extends EventEmitter2 implements $_ {
  public __: string[] = []
  public __id: string

  public __pod: PO | null = null
  public __system: System | null = null
  public __global_id: string
  public __listener_count: Dict<number> = {}

  constructor(__system: System = null) {
    super()

    this.__system = __system

    if (this.__system) {
      this.__global_id = setGlobalRef(this.__system, this)
    }
  }

  getGlobalId(): string {
    return this.__global_id
  }

  getInterface(): string[] {
    return this.__
  }

  refSystem(): System {
    return this.__system
  }

  refPod(): PO {
    return this.__pod
  }

  attach(__system: System): void {
    // console.log('$', 'attach', __system, $pod)

    if (__system === this.__system) {
      return
    }

    this.__system = __system

    this.__global_id = setGlobalRef(this.__system, this)

    this.emit('_attach', __system)
  }

  dettach(): void {
    if (this.__system) {
      deleteGlobalRef(this.__system, this.__global_id)
      this.__global_id = undefined
    }

    this.__system = null
    this.__pod = null

    this.emit('_dettach')
  }

  _prependListener(
    event: string,
    listener: (...data: any[]) => void
  ): Unlisten {
    this.prependListener(event, listener)
    return () => {
      this.removeListener(event, listener)
    }
  }

  _addListener(event: string, listener: (...data: any[]) => void): Unlisten {
    this.addListener(event, listener)
    return () => {
      this.removeListener(event, listener)
    }
  }

  getListeners(): string[] {
    return Object.keys(this.__listener_count)
  }

  destroy() {
    if (this.__system) {
      deleteGlobalRef(this.__system, this.__global_id)
    }

    this.emit('destroy')
  }

  listen(event: string, listener: (data: any) => void): Unlisten {
    this.__listener_count[event] = this.__listener_count[event] ?? 0

    this.__listener_count[event]++

    this.addListener(event, listener)

    if (this.__listener_count[event] === 1) {
      this.emit('listen', { event })
    }

    return () => {
      this.__listener_count[event]--
      if (this.__listener_count[event] === 0) {
        delete this.__listener_count[event]
        this.emit('unlisten', { event })
      }
      this.removeListener(event, listener)
    }
  }

  listenerCount(name: string) {
    return this.listenerCount(name)
  }
}
