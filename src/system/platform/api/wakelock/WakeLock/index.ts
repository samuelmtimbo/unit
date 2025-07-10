import { Done } from '../../../../../Class/Functional/Done'
import { Holder } from '../../../../../Class/Holder'
import { System } from '../../../../../system'
import { ID_WAKE_LOCK } from '../../../../_ids'

export interface I {
  type: 'screen'
  done: any
}

export interface O {}

export default class WakeLock extends Holder<I, O> {
  private _wake_lock: WakeLockSentinel

  constructor(system: System) {
    super(
      {
        fi: ['type'],
        fo: [],
        i: [],
        o: [],
      },
      {},
      system,
      ID_WAKE_LOCK
    )
  }

  async f({ type }: I, done: Done<O>) {
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

  d() {
    if (this._wake_lock) {
      void this._wake_lock.release()

      this._wake_lock = undefined
    }
  }

  private _on_release = () => {
    // console.log('WakeLock', '_on_release')

    this._wake_lock = null
  }
}
