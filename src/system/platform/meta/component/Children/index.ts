import { $ } from '../../../../../Class/$'
import { Element_ } from '../../../../../Class/Element'
import { Functional } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { MethodNotImplementedError } from '../../../../../exception/MethodNotImplementedError'
import { System } from '../../../../../system'
import { A } from '../../../../../types/interface/A'
import { C } from '../../../../../types/interface/C'
import { ID_CHILDREN } from '../../../../_ids'

export interface I {
  parent: Element_
}

export interface O {
  children: A<C>
}

export default class Children extends Functional<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['parent'],
        o: ['children'],
      },
      {
        input: {
          parent: {
            ref: true,
          },
        },
        output: {
          children: {
            ref: true,
          },
        },
      },
      system,
      ID_CHILDREN
    )
  }

  f({ parent }: I, done: Done<O>): void {
    const _children = parent.refChildren()

    const children = new (class Chidren_ extends $ implements A<any> {
      async append(a: any): Promise<void> {
        throw new MethodNotImplementedError()
      }

      async put(i: number, data: any): Promise<void> {
        throw new MethodNotImplementedError()
      }

      async at(i: number): Promise<any> {
        throw new MethodNotImplementedError()
      }

      async length(): Promise<number> {
        return _children.length
      }

      async indexOf(a: any): Promise<number> {
        throw new MethodNotImplementedError()
      }
    })(this.__system)

    done({
      children,
    })
  }
}
