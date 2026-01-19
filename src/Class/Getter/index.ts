import { System } from '../../system'
import { Dict } from '../../types/Dict'
import { Async } from '../../types/interface/async/Async'
import { Functional, FunctionalEvents } from '../Functional'
import { Done } from '../Functional/Done'
import { Fail } from '../Functional/Fail'
import { ION, Opt } from '../Unit'

export type Getter_EE = {}

export type GetterEvents<_EE extends Dict<any[]>> = FunctionalEvents<
  _EE & Getter_EE
> &
  Getter_EE

export type Getter_S = {}

export type GetterState<T extends Omit<Dict<any>, keyof Getter_S> = {}> = T &
  Getter_S

export class Getter<
  I extends Dict<any> = {},
  O extends Dict<any> = {},
  _EE extends GetterEvents<_EE> = GetterEvents<Getter_EE>,
> extends Functional<I, O, _EE> {
  private $$_: string[]
  private $$i: string
  private $$o: string
  private $$m: string

  constructor(
    {
      i,
      o,
      $i,
      $o,
      $m,
      $_,
    }: ION<I, O> & {
      $i: string
      $o: string
      $m: string
      $_: string[]
    },
    opt: Opt = {},
    system: System,
    id: string
  ) {
    super({ i, o }, opt, system, id)

    this.$$i = $i
    this.$$o = $o
    this.$$m = $m
    this.$$_ = $_
  }

  opt(i: I) {
    return {}
  }

  f(i: I, done: Done<O>, fail: Fail): void {
    let obj = i[this.$$i]

    obj = Async(obj, this.$$_, this.__system.async)

    const opt = this.opt(i)

    obj[`$${this.$$m}`](opt, (data, err) => {
      if (err) {
        fail(err)

        return
      }

      done({ [this.$$o]: data } as Partial<O>)
    })
  }
}
