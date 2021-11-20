import { Config } from '../../../../../Class/Unit/Config'
import { Primitive } from '../../../../../Primitive'

export interface I {}

export interface O {}

export default class _Notification extends Primitive<I, O> {
  private _notification: Notification | null = null

  constructor(config?: Config) {
    super(
      {
        i: [],
        o: [],
      },
      config
    )

    this._setup()
  }

  onDataInputData(name) {
    if (this.hasErr()) {
      this.takeErr()
    }
  }

  private _setup() {
    if ('Notification' in window) {
      const { permission } = Notification
      if (permission === 'default') {
        Notification.requestPermission().then(
          (_permission: NotificationPermission) => {
            this.err('not authorized')
          }
        )
      } else {
        this.err('not authorized')
      }
    } else {
      this.err('not authorized')
    }
  }

  $show(
    { title, opt }: { title: string; opt: NotificationOptions },
    callback: () => void
  ): void {
    this._notification = new Notification(title, opt)
    this._notification.onclick = () => {
      this.emit('ntf_click', {})
    }
    this._notification.onclose = () => {
      this.emit('ntf_close', {})
    }
    this._notification.onerror = () => {
      this.emit('ntf_error', {})
    }
    this._notification.onshow = () => {
      this.emit('ntf_show', {})
    }
    callback()
  }

  $close({}: {}, callback: () => void): void {
    if (this._notification) {
      this._notification.close()
    }
    callback()
  }
}
