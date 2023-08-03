import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { System } from '../../../../../system'
import { ID_LOG } from '../../../../_ids'

export interface I<T> {
  message: string
}

export interface O<T> {}

export default class Log<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['message'],
        o: [],
      },
      {},
      system,
      ID_LOG
    )
  }

  f({ message }: I<T>, done: Done<O<T>>): void {
    // eslint-disable-next-line no-console
    console.log(message)

    done({})
  }
}
