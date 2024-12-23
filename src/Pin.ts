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
  _invalid: boolean
  _constant: boolean
  _ignored: boolean
  _idle: boolean
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
  }

  public take(): T | undefined {
    const data = this._register

    if (this._register !== undefined) {
      this._disembody(data)

      this._register = undefined

      this.emit('drop', data)
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
      if (data instanceof Function) {
        this._embodied = true

        data = new data(this.__system)
      }

      if (data instanceof $) {
        if (data.__.includes('U')) {
          ;(data as Unit).play()
        }

        data.register()

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

  public push(data: any, backpropagation: boolean = false): void {
    this.invalidate()

    this._invalid = false

    this.start()

    data = this._embody(data)

    this._register = data

    this.emit('data', data, backpropagation)

    if (this._ref) {
      //
    } else {
      if (this._ignored && !this._constant) {
        this.take()
      }
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

  public snapshot(): Pin_M<T> {
    return {
      _register: this._register instanceof $ ? undefined : this._register,
      _invalid: this._invalid,
      _constant: this._constant,
      _ignored: this._ignored,
      _idle: this._idle,
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

  async read(): Promise<any> {
    if (this._register === undefined) {
      throw new Error('empty')
    }

    return this._register
  }

  async write(data: any): Promise<void> {
    this.push(data)
  }
}
