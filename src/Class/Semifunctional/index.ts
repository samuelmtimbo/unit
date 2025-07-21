import { Pin } from '../../Pin'
import { PinOpt } from '../../PinOpt'
import { Primitive, PrimitiveEvents } from '../../Primitive'
import { System } from '../../system'
import { Dict } from '../../types/Dict'
import { Functional } from '../Functional'
import { Done } from '../Functional/Done'
import { Fail } from '../Functional/Fail'
import { Opt } from '../Unit'

export type Semifunctional_EE = {}

export type SemifunctionalEvents<_EE extends Dict<any[]>> = PrimitiveEvents<
  _EE & Semifunctional_EE
> &
  Semifunctional_EE

export interface SFIO {
  fi?: string[]
  fo?: string[]
  i?: string[]
  o?: string[]
}

export class Semifunctional<
  I extends Dict<any> = any,
  O extends Dict<any> = any,
  EE extends SemifunctionalEvents<
    Dict<any>
  > = SemifunctionalEvents<Semifunctional_EE>,
> extends Primitive<I, O, EE> {
  protected _f_i: Set<string>
  protected _f_o: Set<string>

  protected _functional: Functional<any, any>
  protected _primitive: Primitive<I, O>

  constructor(
    { fi = [], fo = [], i = [], o = [] }: SFIO,
    opt: Opt = {},
    system: System,
    id: string
  ) {
    super({ i: [...fi, ...i], o: [...fo, ...o] }, opt, system, id)

    const self = this

    const functional = new (class _Functional extends Functional<I, O> {
      constructor(system: System) {
        super(
          {
            i: fi,
            o: fo,
          },
          {},
          system,
          `_${id}`
        )
      }

      f(i: Partial<I>, done: Done<O>, fail: Fail) {
        self.f(i, done, fail)
      }

      d() {
        self.d()
      }

      b() {
        self.b()
      }
    })(this.__system)

    this._functional = functional

    functional.play()

    const primitive = new (class _Primitive extends Primitive<I, O> {
      constructor(system: System) {
        super(
          {
            i,
            o,
          },
          {},
          system,
          `_${id}`
        )
      }

      onDataInputData<K extends keyof I>(name: K, data) {
        self.onIterDataInputData(name, data)
      }

      onRefInputData<K extends keyof I>(name: K, data) {
        self.onIterRefInputData(name, data)
      }

      onDataInputDrop<K extends keyof I>(name: K): void {
        self.onIterDataInputDrop(name)
      }

      onRefInputDrop<K extends keyof I>(name: K): void {
        self.onIterRefInputDrop(name)
      }

      onDataOutputDrop<K extends keyof O>(name: K): void {
        self.onIterDataOutputDrop(name)
      }

      onRefOutputDrop<K extends keyof O>(name: K): void {
        self.onIterRefOutputDrop(name)
      }

      onDataInputInvalid<K extends keyof I>(name: K) {
        self.onIterDataInputInvalid(name)
      }

      onRefInputInvalid<K extends keyof I>(name: K) {
        self.onIterRefInputInvalid(name)
      }
    })(this.__system)

    primitive.play()

    this._primitive = primitive

    for (const name of fi) {
      functional.setInput(
        name as keyof I,
        this.getInput(name),
        this.getInputOpt(name)
      )
    }

    for (const name of fo) {
      functional.setOutput(
        name as keyof O,
        this.getOutput(name),
        this.getOutputOpt(name)
      )
    }

    for (const name of i) {
      primitive.setInput(
        name as keyof I,
        this.getInput(name as keyof I),
        this.getInputOpt(name)
      )
    }

    for (const name of o) {
      primitive.setOutput(
        name as keyof O,
        this.getOutput(name),
        this.getOutputOpt(name)
      )
    }

    // assuming primitive side will not throw error

    functional.addListener('err', (err) => {
      this.err(err)
    })

    functional.addListener('take_err', () => {
      this.takeErr()
    })

    this.addListener('take_err', () => {
      functional.takeErr()
    })

    this.addListener('take_caught_err', () => {
      functional.takeCaughtErr()
    })

    this._f_i = new Set(fi)
    this._f_o = new Set(fo)

    this.addListener(
      'set_input',
      (name: string, pin: Pin<any>, opt: PinOpt, propagate) => {
        this._f_i.add(name)

        functional.addInput(name, pin, opt)
      }
    )
    this.addListener(
      'set_output',
      (name: string, pin: Pin<any>, opt: PinOpt, propagate) => {
        this._f_o.add(name)

        functional.addOutput(name, pin, opt)
      }
    )
  }

  f(i: Partial<I>, done: Done<O>, fail: Fail) {}

  d() {}

  b() {}

  protected _done: Done<O> = (data) => {
    this._functional._done(data)
  }

  public onIterDataInputData<K extends keyof I>(name: K, data: any): void {}

  public onIterRefInputData<K extends keyof I>(name: K, data: any): void {}

  public onIterDataInputDrop<K extends keyof I>(name: K): void {}

  public onIterRefInputDrop<K extends keyof I>(name: K): void {}

  public onIterDataOutputDrop<K extends keyof O>(name: K): void {}

  public onIterRefOutputDrop<K extends keyof O>(name: K): void {}

  public onIterDataInputInvalid<K extends keyof I>(name: K) {}

  public onIterRefInputInvalid<K extends keyof I>(name: K) {}

  public destroy(): void {
    this._functional.destroy()
    this._primitive.destroy()

    super.destroy()
  }

  protected _backward_f(): void {
    for (const fi of this._f_i) {
      if (!this._ref_input[fi]) {
        this._backward(fi)
      }
    }
  }

  protected _forward_empty_f(): void {
    for (const fo of this._f_o) {
      this._forward_empty(fo)
    }
  }

  public snapshotSelf(): Dict<any> {
    return {
      ...super.snapshotSelf(),
      _primitive: this._primitive.snapshotSelf(),
      _functional: this._functional.snapshotSelf(),
    }
  }

  public restoreSelf(state: Dict<any>): void {
    const { _primitive, _functional, ...rest } = state

    super.restoreSelf(rest)

    _primitive && this._primitive.restoreSelf(_primitive)
    _functional && this._functional.restoreSelf(_functional)
  }
}
