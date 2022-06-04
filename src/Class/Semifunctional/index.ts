import { Pin } from '../../Pin'
import { PinOpt } from '../../PinOpt'
import { Pod } from '../../pod'
import { Primitive, PrimitiveEvents } from '../../Primitive'
import { System } from '../../system'
import { Dict } from '../../types/Dict'
import { Functional } from '../Functional'
import { Done } from '../Functional/Done'
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
  I = {},
  O = {},
  _EE extends SemifunctionalEvents<_EE> = SemifunctionalEvents<Semifunctional_EE>
> extends Primitive<I, O, _EE> {
  private _f_i: Set<string>
  private _f_o: Set<string>

  private _functional: Functional<any, any>
  private _primitive: Primitive

  private _i_input_err = false

  constructor(
    { fi = [], fo = [], i = [], o = [] }: SFIO,
    opt: Opt = {},
    system: System,
    pod: Pod
  ) {
    super({ i: [...fi, ...i], o: [...fo, ...o] }, opt, system, pod)

    const self = this

    const functional = new (class _Functional extends Functional<I, O> {
      constructor(system: System, pod: Pod) {
        super(
          {
            i: fi,
            o: fo,
          },
          {},
          system,
          pod
        )
      }

      f(i: Partial<I>, done: Done<O>) {
        self.f(i, done)
      }

      d() {
        self.d()
      }
    })(this.__system, this.__pod)

    this._functional = functional

    functional.play()

    const primitive = new (class _Primitive extends Primitive<I, O> {
      constructor(system: System, pod: Pod) {
        super(
          {
            i,
            o,
          },
          {},
          system,
          pod
        )
      }

      onDataInputData(name: string, data: any) {
        self.onIterDataInputData(name, data)
      }

      onRefInputData(name: string, data: any) {
        self.onIterRefInputData(name, data)
      }

      onDataInputDrop(name: string): void {
        self.onIterDataInputDrop(name)
      }

      onRefInputDrop(name: string): void {
        self.onIterRefInputDrop(name)
      }

      onDataOutputDrop(name: string): void {
        self.onIterDataOutputDrop(name)
      }

      onRefOutputDrop(name: string): void {
        self.onIterRefOutputDrop(name)
      }

      onDataInputInvalid(name: string) {
        self.onIterDataInputInvalid(name)
      }

      onRefInputInvalid(name: string) {
        self.onIterRefInputInvalid(name)
      }
    })(this.__system, this.__pod)

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
        this.getInput(name),
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

    this.addListener('take_err', () => {
      // TODO
    })

    this.addListener('take_caught_err', () => {
      // TODO
    })

    this._f_i = new Set(fi)
    this._f_o = new Set(fo)

    this.addListener(
      'set_input',
      (name: string, pin: Pin<any>, opt: PinOpt) => {
        this._f_i.add(name)
        functional.addInput(name, pin, opt)
      }
    )
    this.addListener(
      'set_output',
      (name: string, pin: Pin<any>, opt: PinOpt) => {
        this._f_o.add(name)
        functional.addOutput(name, pin, opt)
      }
    )
    // TODO
    // this.addListener('remove_input', this._onInputRemoved)
    // this.addListener('remove_output', this._onOutputRemoved)
    // this.addListener('rename_input', this._onInputRenamed)
    // this.addListener('rename_output', this._onOutputRenamed)
  }

  f(i: Partial<I>, done: Done<O>) {}

  d() {}

  protected _done: Done<O> = (data, err = null) => {
    this._functional._done(data, err)
  }

  public onIterDataInputData(name: string, data: any): void {}

  public onIterRefInputData(name, data: any): void {}

  public onIterDataInputDrop(name: string): void {}

  public onIterRefInputDrop(name: string): void {}

  public onIterDataOutputDrop(name: string): void {}

  public onIterRefOutputDrop(name: string): void {}

  public onIterDataInputInvalid(name: string) {}

  public onIterRefInputInvalid(name: string) {}
}
