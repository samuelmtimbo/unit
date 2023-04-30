import { Element_ } from '../../../../Class/Element'
import { System } from '../../../../system'
import { CH } from '../../../../types/interface/CH'
import { ID_IFRAME } from '../../../_ids'

export interface I {
  src: string
  srcdoc: string
  style: object
  allow: {
    autoplay?: boolean
    camera?: boolean
    encryptedMedia?: boolean
    fullscreen?: boolean
    microphone?: boolean
    pictureInPicture?: boolean
    scripts: boolean
  }
}

export interface O {}

export default class Iframe extends Element_<I, O> implements CH {
  __ = ['U', 'C', 'CH']

  constructor(system: System) {
    super(
      {
        i: ['src', 'srcdoc', 'style', 'allow'],
        o: [],
      },
      {},
      system,
      ID_IFRAME
    )

    this._state = {}
  }

  send(data: any): Promise<void> {
    this.emit('call', { method: 'send', data: [data] })

    return
  }
}
