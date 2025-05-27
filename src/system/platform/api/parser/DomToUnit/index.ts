import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { System } from '../../../../../system'
import { UnitBundle } from '../../../../../types/UnitBundle'
import { domToUnit } from '../../../../../util/parser/domToUnit'
import { ID_DOM_TO_UNIT } from '../../../../_ids'

export type I = {
  type: DOMParserSupportedType
  text: string
}

export type O = {
  unit: UnitBundle
}

export default class DomToUnit extends Functional<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['type', 'text'],
        o: ['unit'],
      },
      {},
      system,
      ID_DOM_TO_UNIT
    )
  }

  f({ type, text }: I, done: Done<O>): void {
    const unit = domToUnit(this.__system, type, text, {
      width: 200,
      height: 200,
    })

    done({
      unit,
    })
  }
}
