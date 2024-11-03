import { EventEmitter_, EventEmitter_EE } from '../EventEmitter'
import { deleteGlobalRef, setGlobalRef } from '../global'
import { System } from '../system'
import { Dict } from '../types/Dict'

export type $_EE = { destroy: [string[]]; register: [string]; unregister: [] }

export type $Events<_EE extends Dict<any[]>> = EventEmitter_EE<_EE & $_EE> &
  $_EE

export class $<
  _EE extends $Events<_EE> & Dict<any[]> = $Events<$_EE>,
> extends EventEmitter_<_EE> {
  public __: string[] = []
  public $__: string[] = []
  public __system: System
  public __global_id: string
  public __done: boolean

  constructor(system: System) {
    super()

    this.__system = system
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

  register(): void {
    if (!this.__global_id) {
      this.__global_id = setGlobalRef(this.__system, this)

      this.emit('register', this.__global_id)
    }
  }

  unregister(): void {
    if (this.__global_id) {
      deleteGlobalRef(this.__system, this.__global_id)

      this.__global_id = undefined

      this.emit('unregister')
    }
  }

  destroy() {
    if (this.__done) {
      return
    }

    this.__done = true

    this.emit('destroy', [])
  }

  raw(): any {
    throw new Error("object doesn't have raw form")
  }
}
