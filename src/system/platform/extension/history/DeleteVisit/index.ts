import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { callMethod } from '../../../../../client/extension'

export interface I {
  url: string
}

export interface O {}

export default class DeleteVisit extends Functional<I, O> {
  constructor() {
    super({
      i: ['url'],
      o: [],
    })
  }

  f({ url }: I, done: Done<O>) {
    callMethod('history', 'deleteUrl', { url }, (_, err) => {
      done(undefined, err)
    })
  }
}
