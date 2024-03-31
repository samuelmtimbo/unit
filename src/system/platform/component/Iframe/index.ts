import { Element_ } from '../../../../Class/Element'
import { System } from '../../../../system'
import { CH } from '../../../../types/interface/CH'
import { W } from '../../../../types/interface/W'
import { ID_IFRAME } from '../../../_ids'

export interface I {
  src: string
  srcdoc: string
  style: object
}

export interface O {}

export default class Iframe extends Element_<I, O> implements CH, W {
  __ = ['U', 'C', 'CH', 'W']

  constructor(system: System) {
    super(
      {
        i: ['src', 'srcdoc', 'style', 'attr'],
        o: [],
      },
      {},
      system,
      ID_IFRAME
    )

    this._state = {}
  }

  postMessage(data: any, target: string, transferables: Transferable[]): void {
    this.emit('call', {
      method: 'postMessage',
      data: [data, target, transferables],
    })
  }

  send(data: any): Promise<void> {
    this.emit('call', { method: 'send', data: [data] })

    return
  }
}
