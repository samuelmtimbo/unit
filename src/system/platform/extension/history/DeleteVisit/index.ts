import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { callMethod } from '../../../../../client/extension'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'

export interface I {
  url: string
}

export interface O {}

export default class DeleteVisit extends Functional<I, O> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['url'],
        o: [],
      },
      {},
      system,
      pod
    )
  }

  f({ url }: I, done: Done<O>) {
    callMethod('history', 'deleteUrl', { url }, (_, err) => {
      done(undefined, err)
    })
  }
}
