import { Getter } from '../../../../../../Class/Getter'
import { System } from '../../../../../../system'
import { $BC } from '../../../../../../types/interface/async/$BC'
import { ID_READ_VALUE } from '../../../../../_ids'

export interface I {
  charac: $BC
  any: any
}

export interface O {
  value: string
}

export default class ReadValue extends Getter<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['charac', 'any'],
        o: ['value'],
        $i: 'charac',
        $o: 'value',
        $m: 'readValue',
        $_: ['BC'],
      },
      {
        input: {
          charac: {
            ref: true,
          },
        },
      },
      system,
      ID_READ_VALUE
    )
  }
}
