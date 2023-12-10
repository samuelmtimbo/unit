import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { callExtensionMethod } from '../../../../../client/extension'
import { System } from '../../../../../system'
import { ID_GET_VISITS } from '../../../../_ids'

export type VisitItem = {
  id: string
  referringVisitId: string
  transition:
    | 'link'
    | 'typed'
    | 'auto_bookmark'
    | 'auto_subframe'
    | 'manual_subframe'
    | 'generated'
    | 'auto_toplevel'
    | 'form_submit'
    | 'reload'
    | 'keyword'
    | 'keyword_generated'
  visitId: string
  visitTime: string
}

export interface I {
  url: string
}

export interface O {
  visits: VisitItem[]
}

export default class GetVisits extends Functional<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['url'],
        o: ['visits'],
      },
      {},
      system,
      ID_GET_VISITS
    )
  }

  f({ url }: I, done: Done<O>) {
    callExtensionMethod('history', 'getVisits', { url }, (visits, err) => {
      if (err) {
        done(undefined, err)

        return
      }

      done({ visits })
    })
  }
}
