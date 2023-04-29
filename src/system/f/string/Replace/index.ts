import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { System } from '../../../../system'
import { ID_REPLACE } from '../../../_ids'

export interface I {
  str: string
  regex: string
  flags: string
  with: string
}

export interface O {
  str: string
}

export default class Replace extends Functional<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['str', 'regex', 'flags', 'with'],
        o: ['str'],
      },
      {},
      system,
      ID_REPLACE
    )
  }

  f({ str, regex, with: _with, flags }: I, done: Done<O>): void {
    done({ str: str.replace(new RegExp(regex, flags), _with) })
  }
}
