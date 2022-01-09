import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { callMethod } from '../../../../../client/extension'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'

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
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['url'],
        o: ['visits'],
      },
      {},
      system,
      pod
    )
  }

  f({ url }: I, done: Done<O>) {
    callMethod('history', 'getVisits', { url }, (visits, err) => {
      done({ visits }, err)
    })
  }
}
