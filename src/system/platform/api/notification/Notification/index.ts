import { Pod } from '../../../../../pod'
import { Primitive, PrimitiveEvents } from '../../../../../Primitive'
import { System } from '../../../../../system'

export interface I {}

export interface O {}

export type Notification_EE = {
  click: []
  close: []
  error: []
  show: []
}

export type NotificationEvents = PrimitiveEvents<Notification_EE> &
  Notification_EE

export default class _Notification extends Primitive<I, O, NotificationEvents> {
  private _notification: Notification | null = null

  constructor(system: System, pod: Pod) {
    super(
      {
        i: [],
        o: [],
      },
      {},
      system,
      pod
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
      this.emit('click')
    }
    this._notification.onclose = () => {
      this.emit('close')
    }
    this._notification.onerror = () => {
      this.emit('error')
    }
    this._notification.onshow = () => {
      this.emit('show')
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
