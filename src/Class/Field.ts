import { System } from '../system'
import { Dict } from '../types/Dict'
import { ElementEE, Element_ } from './Element'
import { ION, Opt } from './Unit'

export type Field_EE = {}

export type FieldEvents<_EE extends Dict<any[]>> = ElementEE<_EE & Field_EE> &
  Field_EE

export class Field<
  K extends string[],
  I extends Record<string, any>,
  O extends Record<string, any>,
  _J extends Dict<any> = {},
  _EE extends FieldEvents<_EE> = FieldEvents<Field_EE>,
> extends Element_<I, O, _EE> {
  private _ever_played: boolean = false
  private _keys: K

  constructor(
    { i = [], o = [] }: ION<I, O>,
    opt: Opt,
    system: System,
    id: string,
    keys: K
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

    this._keys = keys

    this.addListener('reset', () => {
      this._ever_played = false
    })

    this.addListener('play', () => {
      if (!this._ever_played) {
        this._ever_played = true

        for (const key of this._keys) {
          const value = this.initialValue(key)

          if (value !== undefined) {
            this._output[key].push(value)
          }
        }
      }
    })
  }

  initialValue(key: string) {
    return this._input?.[key]?.peak() ?? this._defaultState[key]
  }
}
