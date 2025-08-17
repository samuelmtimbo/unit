import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { System } from '../../../../system'
import { Dict } from '../../../../types/Dict'
import { ID_MATCH } from '../../../_ids'

export interface I {
  str: string
  regex: string
}

export interface O {
  results: string[]
  meta: {
    index: number
    groups: Dict<string>
    input: string
  }
}

export default class Match extends Functional<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['str', 'regex'],
        o: ['results', 'meta'],
      },
      {},
      system,
      ID_MATCH
    )
  }

  f({ str, regex }: I, done: Done<O>): void {
    const results = str.match(new RegExp(regex))

    if (!results) {
      done({
        results: [],
        meta: {
          index: -1,
          groups: {},
          input: str,
        },
      })

      return
    }

    const { index, groups = {}, input } = results

    const meta = {
      index,
      groups,
      input,
    }

    done({ results, meta })
  }
}
