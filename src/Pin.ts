import { $, $Events } from './Class/$'
import { Unit } from './Class/Unit'
import { System } from './system'
import { PI } from './types/interface/PI'
import { V } from './types/interface/V'
import { Unlisten } from './types/Unlisten'

export type PinEvent =
  | '_data'
  | 'data'
  | 'drop'
  | 'invalid'
  | 'start'
  | 'end'
  | 'constant'
  | 'ignored'

export type Pin_EE<T> = {
  _data: [T]
  data: [T, boolean]
  pull: []
  drop: [T]
  start: []
  end: []
  invalid: []
  ref: [boolean]
  ignored: [boolean]
  constant: [boolean]
  edit: any[]
}

export type Pin_M<T = any> = {
  _register: T | undefined
  _invalid?: boolean
  _constant?: boolean
  _ignored?: boolean
  _idle?: boolean
}

export type PinEvents<T> = $Events<Pin_EE<T>> & Pin_EE<T>

export type PinConstructor = {
  data?: any
  constant?: boolean
  ignored?: boolean
  ref?: boolean
}

export class Pin<T = any> extends $<PinEvents<T>> implements V<T>, PI<T> {
  __ = ['V', 'PI']

  private _constant: boolean = false
  private _ignored: boolean = false
  private _ref: boolean = false
  private _invalid: boolean = false
  private _idle: boolean = true
  private _register: T | undefined = undefined

  constructor(
    { data, constant, ignored, ref }: PinConstructor = {},
    $system: System
  ) {
    super($system)

    if (data !== undefined) {
      this._idle = false
    }

    this._register = data
    this._constant = constant || false
    this._ignored = ignored || false
    this._ref = ref || false

    if (this._ref) {
      this._push = this._push_ref
    } else {
      this._push = this._push_data
    }
  }

  public take(propagate: boolean = true): T | undefined {
    const data = this._register

    if (this._register !== undefined) {
      this._disembody(data)

      this._register = undefined

      if (propagate) {
        this.emit('drop', data)
      }
    }

    this.end()

    return data
  }

  public invalidate() {
    const data = this._register

    if (data !== undefined) {
      this._disembody(data)

      if (!this._invalid) {
        this._invalid = true
        this._idle = true

        this.emit('invalid')
      }
    }
  }

  public start() {
    if (this._idle) {
      this._idle = false

      this.emit('start')
    }
  }

  public end() {
    if (this._register === undefined && !this._idle) {
      this._idle = true

      this.emit('end')
    }
  }

  public pull(): T | undefined {
    const data = this._register

    if (data !== undefined) {
      if (this._constant) {
        this.emit('_data', data)
      } else {
        this.take()
      }
    }
    return data
  }

  private _unlisten: Unlisten

  private _embodied: boolean = false

  private _embody = (data: any) => {
    if (this._ref) {
      this.__embody(data)
    }

    return data
  }

  private __embody = (data: any) => {
    if (data instanceof Function) {
      this._embodied = true

      data = new data(this.__system)
    }

    if (data instanceof $) {
      if (data.__.includes('U')) {
        ;(data as Unit).play()
      }

      data.register()

      if (data.__.includes('G')) {
        this._unlisten = data.addListener('edit', () => {
          this.emit('edit', data)
        })
      }
    }

    return data
  }

  private _disembody = (data: any) => {
    if (this._ref) {
      if (this._unlisten) {
        this._unlisten()

        this._unlisten = undefined
      }

      if (data instanceof $) {
        data.unregister()
      }

      if (this._embodied) {
        data.unregister()
        data.destroy()

        data = data.constructor as T

        this._embodied = false
      }
    }

    return data
  }

  private _push: Function

  public push(
    data: any,
    backpropagation: boolean = false,
    propagate: boolean = true
  ): void {
    this._push(data, backpropagation, propagate)
  }

  private _push_data(
    data: any,
    backpropagation: boolean = false,
    propagate: boolean = true
  ): void {
    this.invalidate()

    this._invalid = false

    this.start()

    this._register = data

    if (propagate) {
      this.emit('data', data, backpropagation)
    }

    if (this._ignored && !this._constant) {
      this.take()
    }
  }

  private _push_ref(
    data: any,
    backpropagation: boolean = false,
    propagate: boolean = true
  ): void {
    this.invalidate()

    this._invalid = false

    this.start()

    data = this.__embody(data)

    this._register = data

    if (propagate) {
      this.emit('data', data, backpropagation)
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

      if (this._ignored && !this._constant && !this._ref) {
        this.take()
      }

      this.emit('ignored', this._ignored)
    }

    return this._ignored
  }

  public ref(value?: boolean): boolean {
    if (value !== undefined) {
      if (this._register) {
        if (value && !this._ref) {
          this._register = this._embody(this._register)
        } else if (!value && this._ref) {
          this._register = this._disembody(this._register)
        }
      }

      this._ref = value

      this.emit('ref', this._ref)
    }

    return this._ref
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

  public embodied(): boolean {
    return this._embodied
  }

  public snapshot(): Pin_M<T> {
    return {
      _register: this._register instanceof $ ? undefined : this._register,
      ...(this._invalid ? { _invalid: true } : {}),
      ...(this._constant ? { _constant: true } : {}),
      ...(this._ignored ? { _ignored: true } : {}),
      ...(this._idle ? {} : { _idle: false }),
    }
  }

  public restore(state: Pin_M<T>): void {
    const { _register, _invalid, _constant, _ignored, _idle } = state

    this._register = _register
    this._invalid = _invalid
    this._constant = _constant
    this._ignored = _ignored
    this._idle = _idle

    if (_register instanceof $) {
      this.emit('_data', _register)
    }
  }

  read(): T {
    return this._register
  }

  write(data: T): void {
    this.push(data)
  }
}
