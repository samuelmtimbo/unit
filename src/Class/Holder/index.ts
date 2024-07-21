import { System } from '../../system'
import { Dict } from '../../types/Dict'
import {
  Semifunctional,
  Semifunctional_EE,
  SemifunctionalEvents,
  SFIO,
} from '../Semifunctional'
import { Opt } from '../Unit'

export class Holder<
  I extends Dict<any> = any,
  O extends Dict<any> = any,
  EE extends
    SemifunctionalEvents<Semifunctional_EE> = SemifunctionalEvents<Semifunctional_EE>,
> extends Semifunctional<I & { done: any }, O, EE> {
  private _done_name: string

  constructor(
    { fi = [], fo = [], i = [], o = [] }: SFIO,
    opt: Opt = {},
    system: System,
    id: string,
    done: string = 'done'
  ) {
    super({ fi, fo, i: [...i, done], o }, opt, system, id)

    this._done_name = done
  }

  public onIterDataInputData<K extends keyof I>(name: K, data: any): void {
    if (name === this._done_name) {
      this.d()

      this._forward_empty_f()
      this._backward_f()

      this._backward(this._done_name)
    }
  }
}
