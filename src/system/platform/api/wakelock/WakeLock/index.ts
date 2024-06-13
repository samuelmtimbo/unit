import { Done } from '../../../../../Class/Functional/Done'
import { Semifunctional } from '../../../../../Class/Semifunctional'
import { System } from '../../../../../system'
import { ID_WAKE_LOCK } from '../../../../_ids'

export interface I {
  type: 'screen'
  done: any
}

export interface O {}

export default class WakeLock extends Semifunctional<I, O> {
  private _wake_lock: WakeLockSentinel

  constructor(system: System) {
    super(
      {
        fi: ['type'],
        fo: [],
        i: ['done'],
        o: [],
      },
      {},
      system,
      ID_WAKE_LOCK
    )
  }

  f({ type }: I, done: Done<O>) {
    this._lock(type)
  }

  d() {
    if (this._wake_lock) {
      this._wake_lock.release()

      this._wake_lock = undefined
    }
  }

  public onIterDataInputData(name: string, data: any): void {
    // if (name === 'done') {
    this.d()

    this._backward('type')

    this._backward('done')
    // }
  }

  private _lock = async (type: 'screen'): Promise<void> => {
    const {
      api: {
        screen: {
          wakeLock: { request },
        },
      },
    } = this.__system

    const wake_lock = await request(type)

    wake_lock.addEventListener('release', this._on_release)

    this._wake_lock = wake_lock
  }

  private _on_release = () => {
    // console.log('WakeLock', '_on_release')

    this._wake_lock = null
  }
}
