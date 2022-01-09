import { Done } from '../../../../../Class/Functional/Done'
import { Semifunctional } from '../../../../../Class/Semifunctional'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'
import { IWakeLock, IWakeLockOpt } from '../../../../../types/global/IWakeLock'

export interface I {
  lock: any
  done: any
}

export interface O {}

export default class WakeLock extends Semifunctional<I, O> {
  private _wake_lock: IWakeLock

  constructor(system: System, pod: Pod) {
    super(
      {
        fi: ['lock'],
        fo: [],
        i: ['done'],
        o: [],
      },
      {},
      system,
      pod
    )
  }

  f({ lock }: I, done: Done<O>) {
    this._lock({ type: 'screen' })
  }

  d() {
    this._release()
  }

  public onIterDataInputData(name: string, data: any): void {
    // if (name === 'done') {
    this._release()
    // }
  }

  private _lock = async (opt: IWakeLockOpt): Promise<void> => {
    const {
      api: {
        screen: { requestWakeLock },
      },
    } = this.__system
    // console.log('WakeLock', '_lock')
    const wake_lock = await requestWakeLock(opt)
    wake_lock.addListener('done', this._on_release)
    this._wake_lock = wake_lock
  }

  private _release = (): void => {
    // console.log('WakeLock', '_release')
    if (this._wake_lock) {
      this._wake_lock.done()
    }
  }

  private _on_release = () => {
    // console.log('WakeLock', '_on_release')
    this._wake_lock = null
  }
}
