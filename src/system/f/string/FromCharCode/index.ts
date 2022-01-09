import { Functional } from '../../../../Class/Functional'
import { Done } from '../../../../Class/Functional/Done'
import { Pod } from '../../../../pod'
import { System } from '../../../../system'

export interface I<T> {
  code: number
}

export interface O<T> {
  char: string
}

export default class FromCharCode<T> extends Functional<I<T>, O<T>> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['code'],
        o: ['char'],
      },
      {},
      system,
      pod
    )
  }

  f({ code }: I<T>, done: Done<O<T>>): void {
    const char = String.fromCharCode(code)
    done({ char })
  }
}
