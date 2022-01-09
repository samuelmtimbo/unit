import { EventEmitter, EventEmitter_EE } from '../EventEmitter'
import { deleteGlobalRef, setGlobalRef } from '../global'
import { Pod } from '../pod'
import { System } from '../system'
import { Dict } from '../types/Dict'

export type $_EE = { destroy: [] }

export type $Events<_EE extends Dict<any[]>> = EventEmitter_EE<_EE & $_EE> &
  $_EE

export class $<
  _EE extends $Events<_EE> & Dict<any[]> = $Events<$_EE>
> extends EventEmitter<_EE> {
  public __: string[] = []
  public __pod: Pod
  public __system: System
  public __global_id: string

  constructor(system: System, pod: Pod) {
    super()

    this.__system = system
    this.__pod = pod

    this.__global_id = setGlobalRef(this.__system, this)
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

  refPod(): Pod {
    return this.__pod
  }

  destroy() {
    deleteGlobalRef(this.__system, this.__global_id)

    this.emit('destroy')
  }
}
