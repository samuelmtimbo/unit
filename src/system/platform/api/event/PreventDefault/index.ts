import { $ } from '../../../../../Class/$'
import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { System } from '../../../../../system'
import { EV } from '../../../../../types/interface/E'
import { V } from '../../../../../types/interface/V'
import { ID_PREVENT_DEFAULT } from '../../../../_ids'

export interface I<T> {
  event: EV & V & $
  opt: {}
}

export interface O<T> {}

export default class PreventDefault<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['event', 'opt'],
        o: [],
      },
      {
        input: {
          event: {
            ref: true,
          },
        },
        output: {},
      },
      system,
      ID_PREVENT_DEFAULT
    )
  }

  async f({ event, opt }: I<T>, done: Done<O<T>>) {
    event.preventDefault()

    done()
  }
}
