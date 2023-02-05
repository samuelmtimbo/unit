import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { System } from '../../../../../system'
import { ID_PROMPT } from '../../../../_ids'

export type I = {
  message: string
}

export type O = {
  answer: string
}

export default class Prompt extends Functional<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['message'],
        o: ['answer'],
      },
      {},
      system,
      ID_PROMPT
    )
  }

  f({ message }: I, done: Done<O>): void {
    const {
      api: {
        alert: { prompt },
      },
    } = this.__system

    const answer = prompt(message)

    if (answer === null) {
      done(undefined, 'user cancelled prompt')

      return
    }

    done({ answer })
  }
}
