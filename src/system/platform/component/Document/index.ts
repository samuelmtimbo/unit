import { Primitive } from '../../../../Primitive'
import { System } from '../../../../system'
import { CH } from '../../../../types/interface/CH'
import { W } from '../../../../types/interface/W'
import { wrapWindow } from '../../../../wrap/Window'
import { ID_DOCUMENT } from '../../../_ids'

export interface I {
  src: string
  srcdoc: string
}

export interface O {
  window: W
}

export default class Document_ extends Primitive<I, O> implements CH {
  __ = ['U']

  private _iframe_el: HTMLIFrameElement

  constructor(system: System) {
    super(
      {
        i: ['src', 'srcdoc'],
        o: ['window'],
      },
      {},
      system,
      ID_DOCUMENT
    )

    this._iframe_el = this.__system.api.document.createElement('iframe')

    this._iframe_el.addEventListener('load', () => {
      const window = wrapWindow(this._iframe_el.contentWindow, this.__system)

      this._output.window.push(window)
    })

    if (this.__system.foreground.void) {
      this.__system.foreground.void.appendChild(this._iframe_el)
    }
  }

  send(data: any): Promise<void> {
    this._iframe_el.contentWindow.postMessage(data, '*')

    return
  }

  onDataInputData(name: string, data: any): void {
    // console.log('Iframe', 'onDataInputData', 'name', name, 'data', data)

    super.onDataInputData(name, data)

    if (name === 'src') {
      this._iframe_el.src = data
    } else if (name === 'srcdoc') {
      this._iframe_el.srcdoc = data
    }
  }
}
