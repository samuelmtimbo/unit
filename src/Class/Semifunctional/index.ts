import { Pin } from '../../Pin'
import { PinOpt } from '../../PinOpt'
import { Primitive } from '../../Primitive'
import { System } from '../../system'
import { Functional } from '../Functional'
import { Done } from '../Functional/Done'
import { Opt } from '../Unit'

export interface SFIO {
  fi?: string[]
  fo?: string[]
  i?: string[]
  o?: string[]
}

export class Semifunctional<I = {}, O = {}> extends Primitive<I, O> {
  private _f_i: Set<string>
  private _f_o: Set<string>

  private _functional: Functional<any, any>
  private _primitive: Primitive

  private _i_input_err = false

  constructor(
    { fi = [], fo = [], i = [], o = [] }: SFIO,
    opt: Opt = {},
    system: System = null
  ) {
    super({ i: [...fi, ...i], o: [...fo, ...o] }, opt, system)

    const self = this

    const functional = new (class _Functional extends Functional<I, O> {
      constructor(system: System = null) {
        super(
          {
            i: fi,
            o: fo,
          },
          {},
          system
        )
      }

      f(i: Partial<I>, done: Done<O>) {
        self.f(i, done)
      }

      d() {
        self.d()
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
          system
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
    })(this.__system)

    primitive.play()

    this._primitive = primitive

    for (const name of fi) {
      functional.setInput(name, this.getInput(name), this.getInputOpt(name))
    }

    for (const name of fo) {
      functional.setOutput(name, this.getOutput(name), this.getOutputOpt(name))
    }

    for (const name of i) {
      primitive.setInput(name, this.getInput(name), this.getInputOpt(name))
    }

    for (const name of o) {
      primitive.setOutput(name, this.getOutput(name), this.getOutputOpt(name))
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
