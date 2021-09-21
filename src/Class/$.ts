import { EventEmitter2 } from 'eventemitter2'
import { deleteGlobalUnit, setGlobalUnit } from '../client/globalUnit'
import { $_ } from '../interface/$_'
import { PO } from '../interface/PO'
import { Unlisten } from '../Unlisten'
import { Dict } from './../types/Dict'

export class $ extends EventEmitter2 implements $_ {
  public globalId: string

  public pod: PO

  public _: string[] = []

  protected _listener_count: Dict<number> = {}

  constructor() {
    super()

    this.globalId = setGlobalUnit(this)
  }

  getGlobalId(): string {
    return this.globalId
  }

  getInterface(): string[] {
    return this._
  }

  getPod(): PO<any, any> {
    return this.pod
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
    deleteGlobalUnit(this.globalId)

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
}
