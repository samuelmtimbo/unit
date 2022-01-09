import { Element } from '../../../../../Class/Element'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'
import { Dict } from '../../../../../types/Dict'

export interface I {
  href: string
  class: string
  style: Dict<string>
}

export interface O {}

export default class SVGUse extends Element<I, O> {
  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['href', 'class', 'style'],
        o: [],
      },
      {},
      system,
      pod
    )
  }
}
