import { System } from '../system'
import { Dict } from '../types/Dict'
import { ElementEE, Element_ } from './Element'
import { ION, Opt } from './Unit'

export type Field_EE = {}

export type FieldEvents<_EE extends Dict<any[]>> = ElementEE<_EE & Field_EE> &
  Field_EE

export class Field<
  I extends { value: any } = any,
  O extends { value: any } = any,
  _J extends Dict<any> = {},
  _EE extends FieldEvents<_EE> = FieldEvents<Field_EE>,
> extends Element_<I, O, _EE> {
  private _ever_played: boolean = false

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

    this.addListener('reset', () => {
      this._ever_played = false
    })

    this.addListener('play', () => {
      if (!this._ever_played) {
        this._ever_played = true

        const value = this.initialValue()

        if (value !== undefined) {
          this._output.value.push(value)
        }
      }
    })
  }

  initialValue() {
    return this._input?.value?.peak() ?? this._defaultState.value
  }
}
