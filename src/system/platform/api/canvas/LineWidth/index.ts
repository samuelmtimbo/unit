import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { System } from '../../../../../system'
import { ID_LINE_WIDTH } from '../../../../_ids'

export interface I<T> {
  d: any[][]
  lineWidth: string
}

export interface O<T> {
  d: any[][]
}

export default class LineWidth<T> extends Functional<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['lineWidth', 'd'],
        o: ['d'],
      },
      {},
      system,
      ID_LINE_WIDTH
    )
  }

  f({ d, lineWidth }: I<T>, done: Done<O<T>>): void {
    done({
      d: [...d, ['lineWidth', lineWidth]],
    })
  }
}
