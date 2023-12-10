import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { callExtensionMethod } from '../../../../../client/extension'
import { System } from '../../../../../system'
import { ID_DELETE_VISIT } from '../../../../_ids'

export interface I {
  url: string
}

export interface O {}

export default class DeleteVisit extends Functional<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['url'],
        o: [],
      },
      {},
      system,
      ID_DELETE_VISIT
    )
  }

  f({ url }: I, done: Done<O>) {
    callExtensionMethod('history', 'deleteUrl', { url }, (_, err) => {
      done(undefined, err)
    })
  }
}
