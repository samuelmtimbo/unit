import { $ } from '../../../Class/$'
import { Element } from '../../../Class/Element'
import { Semifunctional } from '../../../Class/Semifunctional'
import { ObjectUpdateType } from '../../../Object'
import { Pod } from '../../../pod'
import { System } from '../../../system'
import { GraphClass } from '../../../types/GraphClass'
import { G } from '../../../types/interface/G'
import { J } from '../../../types/interface/J'
import { V } from '../../../types/interface/V'
import { Unlisten } from '../../../types/Unlisten'

export interface I<T> {
  graph: GraphClass
  done: any
}

export interface O<T> {
  hub: $ & V<J<J<G>>> & J<J<G>>
}

export default class Client<T> extends Element<I<T>, O<T>> {
  constructor(system: System, pod: Pod) {
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
      pod
    )
  }

  // TODO implement Semifunctional logic
  onDataInputData(name: keyof I<T>, data: any) {
    super.onDataInputData(name, data)

    console.log('Client', name, data)

    if (name === 'graph') {
      const hub = new (class _Hub extends $ implements V<J<J<G>>>, J<J<G>> {
        read(): Promise<J<J<G<any, any>>>> {
          throw new Error('Method not implemented.')
        }

        write(data: J<J<G<any, any>>>): Promise<void> {
          throw new Error('Method not implemented.')
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
          throw new Error('Method not implemented.')
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
          throw new Error('Method not implemented.')
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
          throw new Error('Method not implemented.')
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
          throw new Error('Method not implemented.')
        }

        keys(): Promise<string[]> {
          throw new Error('Method not implemented.')
        }

        pathGet(path: string[], name: string): Promise<any> {
          throw new Error('Method not implemented.')
        }

        pathSet(path: string[], name: string, data: any): Promise<void> {
          throw new Error('Method not implemented.')
        }

        pathDelete(path: string[], name: string): Promise<void> {
          throw new Error('Method not implemented.')
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
          throw new Error('Method not implemented.')
        }
      })(this.__system, this.__pod)

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
