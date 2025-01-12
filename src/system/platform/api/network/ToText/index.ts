import { $ } from '../../../../../Class/$'
import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { System } from '../../../../../system'
import { BO } from '../../../../../types/interface/BO'
import { ID_TO_TEXT } from '../../../../_ids'

export type I = {
  body: BO & $
  any: any
}

export type O = {
  text: string
}

export default class ToText extends Functional<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['body', 'any'],
        o: ['text'],
      },
      {
        input: {
          body: {
            ref: true,
          },
        },
      },
      system,
      ID_TO_TEXT
    )
  }

  async f({ body }: I, done: Done<O>) {
    let text: string

    try {
      text = await body.text()
    } catch (err) {
      done(undefined, err.message.toString())

      return
    }

    done({ text })
  }
}
