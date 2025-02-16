import { System } from '../../system'
import { Dict } from '../../types/Dict'
import { C_EE } from '../../types/interface/C'
import { E } from '../../types/interface/composed/E'
import { Stateful, StatefulEvents } from '../Stateful'
import { ION, Opt } from '../Unit'

export type Element_EE = C_EE

export type ElementEE<_EE extends Dict<any[]>> = StatefulEvents<
  _EE & Element_EE
> &
  Element_EE

export class Element_<
    I extends Dict<any> = any,
    O extends Dict<any> = any,
    J extends Dict<any> = {},
    EE extends ElementEE<EE> = ElementEE<Element_EE>,
  >
  extends Stateful<I, O, J, EE>
  implements E
{
  __ = ['U', 'C', 'J', 'V', 'EE']

  constructor(
    { i = [], o = [] }: ION<I, O>,
    opt: Opt = {},
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
      this.emit('call', { method: 'reset', data: [] })
    })
    this.addListener('set', (name: keyof I, data) => {
      const {
        api: {
          window: { nextTick },
        },
      } = this.__system

      if (!this._forwarding) {
        if (data === undefined) {
          this._forwarding_empty = true
          // @ts-ignore
          this._output?.[name]?.pull()
          this._forwarding_empty = false
        } else {
          this._forwarding = true
          // @ts-ignore
          this._output?.[name]?.push(data)
          this._forwarding = false
        }
      }

      if (
        !this._set_from_input &&
        !this._backwarding &&
        !this._forwarding &&
        data !== undefined
      ) {
        this._backwarding = true

        nextTick(() => {
          this._input?.[name]?.pull()

          this._backwarding = false
        })
      }
    })

    this._slot = {
      default: this,
    }
  }

  isElement(): boolean {
    return true
  }
}
