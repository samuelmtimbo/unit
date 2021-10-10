import { EventEmitter2 } from 'eventemitter2'

export type PinEvent =
  | 'data'
  | 'drop'
  | 'invalid'
  | 'start'
  | 'end'
  | 'constant'
  | 'ignored'

export class Pin<T> extends EventEmitter2 {
  private _constant: boolean = false
  private _ignored: boolean = false

  private _invalid: boolean = false

  private _idle: boolean = true

  protected _register: T | undefined = undefined

  constructor({
    value,
    constant,
    ignored,
  }: {
    value?: any
    constant?: boolean
    ignored?: boolean
  } = {}) {
    super()

    this.setMaxListeners(16)

    if (value !== undefined) {
      this._idle = false
    }
    this._register = value

    this._constant = constant || false
    this._ignored = ignored || false
  }

  public take(): T | undefined {
    const data = this._register
    if (this._register !== undefined) {
      this._register = undefined
      this.emit('drop', data)
      this.emit('_drop', data)
    }
    this.end()
    return data
  }

  public invalidate() {
    if (this._register !== undefined && !this._invalid) {
      this._invalid = true
      this._idle = true
      this.emit('invalid')
      this.emit('_invalid')
    }
  }

  public start() {
    if (this._idle) {
      this._idle = false
      this.emit('start')
      this.emit('_start')
    }
  }

  public end() {
    if (this._register === undefined && !this._idle) {
      this._idle = true
      this.emit('end')
      this.emit('_end')
    }
  }

  public pull(): T | undefined {
    const data = this._register
    if (data !== undefined) {
      this.emit('pull', data)
      if (this._constant) {
        this.emit('data', data)
        this.emit('_data', data)
      } else {
        this.take()
      }
    }
    return data
  }

  public push(data: T): void {
    this.invalidate()
    this._invalid = false
    this.start()
    this._register = data
    this.emit('data', data)
    this.emit('_data', data)
    if (this._ignored) {
      this.take()
    }
  }

  public peak(): T | undefined {
    return this._register
  }

  public empty(): boolean {
    return this._register === undefined
  }

  public active(): boolean {
    return !this.empty()
  }

  public ignored(value?: boolean): boolean {
    if (value !== undefined) {
      this._ignored = value
      if (this._ignored && !this._constant) {
        this.take()
      }
      this.emit('ignored', this._ignored)
    }
    return this._ignored
  }

  public constant(value?: boolean): boolean {
    if (value !== undefined) {
      this._constant = value
    }
    return this._constant
  }

  public invalid(): boolean {
    return this._invalid
  }
}
