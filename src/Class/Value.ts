import { System } from '../system'
import { Dict } from '../types/Dict'
import { ElementEE, Element_ } from './Element'
import { ION, Opt } from './Unit'

export type Value_EE = {}

export type ValueEvents<_EE extends Dict<any[]>> = ElementEE<_EE & Value_EE> &
  Value_EE

export class Value<
  I = any,
  O extends { value: any } = any,
  _J extends Dict<any> = {},
  _EE extends ValueEvents<_EE> = ValueEvents<Value_EE>
> extends Element_<I, O, _EE> {
  constructor(
    { i = [], o = [] }: ION<I, O>,
    opt: Opt,
    system: System,
    id: string
  ) {
    super(
      {
        i,
        o,
      },
      opt,
      system,
      id
    )

    this.addListener('play', () => {
      this._output.value.push(this._defaultState.value)
    })
  }
}
