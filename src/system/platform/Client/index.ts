import { $ } from '../../../Class/$'
import { Element_ } from '../../../Class/Element'
import { MethodNotImplementedError } from '../../../exception/MethodNotImplementedError'
import { ObjectUpdateType } from '../../../ObjectUpdateType'
import { System } from '../../../system'
import { GraphClass } from '../../../types/GraphClass'
import { G } from '../../../types/interface/G'
import { J } from '../../../types/interface/J'
import { V } from '../../../types/interface/V'
import { Unlisten } from '../../../types/Unlisten'
import { ID_CLIENT } from '../../_ids'

export interface I<T> {
  graph: GraphClass
  done: any
}

export interface O<T> {
  hub: $ & V<J<J<G>>> & J<J<G>>
}

export default class Client<T> extends Element_<I<T>, O<T>> {
  constructor(system: System) {
    super(
      {
        i: ['graph', 'done'],
        o: ['hub'],
      },
      {
        input: {},
        output: {
          hub: {
            ref: true,
          },
        },
      },
      system,
      ID_CLIENT
    )
  }

  // TODO implement Semifunctional logic
  onDataInputData(name: keyof I<T>, data: any) {
    super.onDataInputData(name, data)

    if (name === 'graph') {
      const hub = new (class _Hub extends $ implements V<J<J<G>>>, J<J<G>> {
        read(): Promise<J<J<G<any, any>>>> {
          throw new MethodNotImplementedError()
        }

        write(data: J<J<G<any, any>>>): Promise<void> {
          throw new MethodNotImplementedError()
        }

        get<
          K extends
            | 'get'
            | 'set'
            | 'delete'
            | 'hasKey'
            | 'keys'
            | 'pathGet'
            | 'pathSet'
            | 'pathDelete'
            | 'subscribe'
        >(name: K): Promise<J<G<any, any>>[K]> {
          throw new MethodNotImplementedError()
        }

        set<
          K extends
            | 'get'
            | 'set'
            | 'delete'
            | 'hasKey'
            | 'keys'
            | 'pathGet'
            | 'pathSet'
            | 'pathDelete'
            | 'subscribe'
        >(name: K, data: J<G<any, any>>[K]): Promise<void> {
          throw new MethodNotImplementedError()
        }

        delete<
          K extends
            | 'get'
            | 'set'
            | 'delete'
            | 'hasKey'
            | 'keys'
            | 'pathGet'
            | 'pathSet'
            | 'pathDelete'
            | 'subscribe'
        >(name: K): Promise<void> {
          throw new MethodNotImplementedError()
        }

        hasKey<
          K extends
            | 'get'
            | 'set'
            | 'delete'
            | 'hasKey'
            | 'keys'
            | 'pathGet'
            | 'pathSet'
            | 'pathDelete'
            | 'subscribe'
        >(name: K): Promise<boolean> {
          throw new MethodNotImplementedError()
        }

        keys(): Promise<string[]> {
          throw new MethodNotImplementedError()
        }

        pathGet(path: string[], name: string): Promise<any> {
          throw new MethodNotImplementedError()
        }

        pathSet(path: string[], name: string, data: any): Promise<void> {
          throw new MethodNotImplementedError()
        }

        pathDelete(path: string[], name: string): Promise<void> {
          throw new MethodNotImplementedError()
        }

        subscribe(
          path: string[],
          key: string,
          listener: (
            type: ObjectUpdateType,
            path: string[],
            key: string,
            data: any
          ) => void
        ): Unlisten {
          throw new MethodNotImplementedError()
        }
      })(this.__system)

      this._output.hub.push(hub)
    } else if (name === 'done') {
      this._forward_empty('hub')

      this._backward('graph')
      this._backward('done')
    }
  }

  onDataInputDrop(name: string) {
    if (name === 'graph') {
      this._forward_empty('hub')
    }
  }

  onIterDataInputData(name: string) {
    // if (name === 'done') {
    this._forward_empty('hub')

    this._backward('done')
    // }
  }
}
