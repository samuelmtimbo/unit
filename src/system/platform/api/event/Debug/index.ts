import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { Component_ } from '../../../../../interface/Component'
import { EE } from '../../../../../interface/EE'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'

export interface I<T> {
  unit: Component_<any>
}

export interface O<T> {
  emitter: EE
}

export default class Debug<T> extends Functional<I<T>, O<T>> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['unit'],
        o: ['emitter'],
      },
      {
        input: {
          unit: {
            ref: true,
          },
        },
      },
      system,
      pod
    )
  }

  f({ unit }: I<T>, done: Done<O<T>>) {
    done({ emitter: unit })
  }
}
