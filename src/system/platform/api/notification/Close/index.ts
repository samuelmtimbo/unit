import { Primitive } from '../../../../../Primitive'
import { System } from '../../../../../system'
import { NO } from '../../../../../types/interface/NO'
import { ID_CLOSE } from '../../../../_ids'

export interface I<T> {
  this: NO
  opt: T
}

export interface O {}

export default class Close<T> extends Primitive<I<T>, O> {
  constructor(system: System) {
    super(
      {
        i: ['this', 'opt'],
        o: [],
      },
      {
        input: {
          notification: {
            ref: true,
          },
        },
      },
      system,
      ID_CLOSE
    )
  }
}
