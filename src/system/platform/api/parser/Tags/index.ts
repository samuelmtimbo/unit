import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'
import { TAG_TO_SPEC_ID } from '../../../../../util/tagToId'
import { ID_TAGS } from '../../../../_ids'

export type I = {
  any: any
}

export type O = {
  tags: Dict<string>
}

export default class Tags extends Functional<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['any'],
        o: ['tags'],
      },
      {},
      system,
      ID_TAGS
    )
  }

  f({ any }: I, done: Done<O>): void {
    const tags = TAG_TO_SPEC_ID

    done({
      tags,
    })
  }
}
