import { $ } from '../../../../../Class/$'
import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { System } from '../../../../../system'
import { RES } from '../../../../../types/interface/RES'
import { ID_TO_TEXT } from '../../../../_ids'

export type I = {
  res: RES & $
  any: any
}

export type O = {
  text: any
}

export default class ToText extends Functional<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['res', 'any'],
        o: ['text'],
      },
      {},
      system,
      ID_TO_TEXT
    )
  }

  async f({ res }: I, done: Done<O>) {
    let text: string

    try {
      text = await res.toText()
    } catch (err) {
      done(undefined, err.message.toString())

      return
    }

    done({ text })
  }
}
