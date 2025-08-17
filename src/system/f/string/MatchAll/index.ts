import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { System } from '../../../../system'
import { ID_MATCH_ALL } from '../../../_ids'

export interface I {
  str: string
  regex: string
}

export interface O {
  matches: string[][]
}

export default class MatchAll extends Functional<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['str', 'regex'],
        o: ['matches'],
      },
      {},
      system,
      ID_MATCH_ALL
    )
  }

  f({ str, regex }: I, done: Done<O>): void {
    const result: IterableIterator<RegExpExecArray> = str.matchAll(
      new RegExp(regex, 'g')
    )

    const matches = []

    for (const entry of result) {
      matches.push(entry.map((v) => v ?? ''))
    }

    done({ matches })
  }
}
