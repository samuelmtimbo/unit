import { Done } from '../../../../../Class/Functional/Done'
import { Semifunctional } from '../../../../../Class/Semifunctional'

export interface I {
  lock: any
  done: any
}

export interface O {}

export default class WakeLock extends Semifunctional<I, O> {
  private _wake_lock: any

  constructor() {
    super({
      fi: ['lock'],
      fo: [],
      i: ['done'],
      o: [],
    })
  }

  f({ lock }: I, done: Done<O>) {
    this._lock()
  }

  d() {
    this._release()
  }

  public onIterDataInputData(name: string, data: any): void {
    // if (name === 'done') {
    this._release()
    // }
  }

  private _lock = (): void => {
    // console.log('WakeLock', '_lock')
    if ('wakeLock' in navigator) {
      // @ts-ignore
      navigator.wakeLock
        .request('screen')
        .then((wake_lock) => {
          // console.log('WakeLock', '_on_acquire')
          wake_lock.addEventListener('done', this._on_release)
          this._wake_lock = wake_lock
        })
        .catch((err) => {
          // The Wake Lock request has failed - usually system related, such as battery.
          if (
            err.message ===
            "Failed to execute 'request' on 'WakeLock': The requesting page is not visible"
          ) {
            this.err('page is not visible')
          }
        })
    } else {
      this.err('Wake Lock API not supported on this browser')
    }
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
