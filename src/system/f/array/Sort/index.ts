import { Done } from '../../../../Class/Functional/Done'
import { Semifunctional } from '../../../../Class/Semifunctional'
import { Heap, asyncAddHeapNode, asyncToSortedArray } from '../../../../Heap'
import { Waiter } from '../../../../Waiter'
import { System } from '../../../../system'
import { ID_SORT } from '../../../_ids'

export interface I<T> {
  a: T[]
  'a[i] < a[j]': boolean
}

export interface O<T> {
  b: T[]
  'a[i]': T
  'a[j]': T
}

export default class Sort<T> extends Semifunctional<I<T>, O<T>> {
  private _forward_waiter: Waiter<boolean> = new Waiter()
  private _backward_waiter: Waiter<boolean> = new Waiter()

  constructor(system: System) {
    super(
      {
        fi: ['a'],
        fo: ['b'],
        i: ['a[i] < a[j]'],
        o: ['a[i]', 'a[j]'],
      },
      {},
      system,
      ID_SORT
    )
  }

  private _predicate = async (a: T, b: T) => {
    this._forwarding = true

    this._output['a[i]'].push(a)
    this._output['a[j]'].push(b)

    this._forwarding = false

    const result = await this._forward_waiter.once()

    this._loop()

    this._forward_waiter.clear()

    this._input['a[i] < a[j]'].pull()

    await this._backward_waiter.once()

    this._backward_waiter.clear()

    return result
  }

  async f({ a }: I<T>, done: Done<O<T>>): Promise<void> {
    let heap: Heap<T> = null

    for (const value of a) {
      heap = await asyncAddHeapNode(
        heap,
        { parent: null, left: null, right: null, value },
        this._predicate
      )
    }

    const b = heap ? await asyncToSortedArray(heap, this._predicate) : []

    done({
      b,
    })
  }

  d() {
    this._forward_empty('a[i]')
    this._forward_empty('a[j]')
  }

  public onIterDataInputData(name: string, data: any): void {
    switch (name) {
      case 'a[i] < a[j]': {
        this._forward_waiter.set(data)

        break
      }
    }
  }

  public onIterDataOutputDrop(name: string): void {
    // console.log('onIterDataOutputDrop', name)

    if (!this._forwarding) {
      this._loop()
    }
  }

  private _loop() {
    if (this._output['a[i]'].empty() && this._output['a[j]'].empty()) {
      this._backward_waiter.set(true)
    }
  }
}
