import { EventEmitter2 } from 'eventemitter2'
import { deleteGlobalRef, setGlobalRef } from '../client/globalUnit'
import { $_ } from '../interface/$_'
import { PO } from '../interface/PO'
import { S } from '../interface/S'
import { System } from '../system'
import { Unlisten } from '../Unlisten'
import { Dict } from './../types/Dict'

export class $ extends EventEmitter2 implements $_ {
  static id: string

  public $system: System | null = null
  public $pod: PO | null = null

  public globalId: string

  public _: string[] = []

  protected _listener_count: Dict<number> = {}

  constructor() {
    super()

    this.globalId = setGlobalRef(this)
  }

  getGlobalId(): string {
    return this.globalId
  }

  getInterface(): string[] {
    return this._
  }

  refSystem(): S {
    return this.$system
  }

  refPod(): PO {
    return this.$pod
  }

  attach($system: System, $pod: PO): void {
    // console.log('$', 'attach', $system, $pod)

    this.$system = $system
    this.$pod = $pod

    this.emit('_attach', $system, $pod)
  }

  dettach(): void {
    this.$system = null
    this.$pod = null

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
    return Object.keys(this._listener_count)
  }

  destroy() {
    deleteGlobalRef(this.globalId)

    this.emit('destroy')
  }

  listen(event: string, listener: (data: any) => void): Unlisten {
    this._listener_count[event] = this._listener_count[event] ?? 0

    this._listener_count[event]++

    this.addListener(event, listener)

    if (this._listener_count[event] === 1) {
      this.emit('listen', { event })
    }

    return () => {
      this._listener_count[event]--
      if (this._listener_count[event] === 0) {
        delete this._listener_count[event]
        this.emit('unlisten', { event })
      }
      this.removeListener(event, listener)
    }
  }

  listenerCount(name: string) {
    return this.listenerCount(name)
  }
}
