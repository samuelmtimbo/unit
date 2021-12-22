import { EventEmitter_ } from '../EventEmitter'
import { deleteGlobalRef, setGlobalRef } from '../global'
import { $_ } from '../interface/$_'
import { PO } from '../interface/PO'
import { System } from '../system'
import { Unlisten } from '../Unlisten'
import { Dict } from './../types/Dict'

export class $ extends EventEmitter_ implements $_ {
  public __: string[] = []
  public __id: string

  public __pod: PO | null = null
  public __system: System | null = null
  public __global_id: string

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

  destroy() {
    if (this.__system) {
      deleteGlobalRef(this.__system, this.__global_id)
    }

    this.emit('destroy')
  }
}
