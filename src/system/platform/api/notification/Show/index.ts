import { Primitive, PrimitiveEvents } from '../../../../../Primitive'
import { System } from '../../../../../system'
import { ID_SHOW } from '../../../../_ids'

export interface I {}

export interface O {}

export default class Show extends Primitive<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['this'],
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
      ID_SHOW
    )
  }
}
