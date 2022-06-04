import { $ } from '../../../../../Class/$'
import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'
import { CA } from '../../../../../types/interface/CA'

export interface I<T> {
  any: any
  canvas: $ & CA
}

export interface O<T> {}

export default class Clear<T> extends Functional<I<T>, O<T>> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['any', 'canvas'],
        o: [],
      },
      {
        input: {
          canvas: {
            ref: true,
          },
        },
      },
      system,
      pod
    )
  }

  f({ any, canvas }: I<T>, done: Done<O<T>>): void {
    canvas.clear()
    
    done({})
  }
}
