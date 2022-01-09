import { $ } from '../../../../../../Class/$'
import { Functional } from '../../../../../../Class/Functional'
import { Done } from '../../../../../../Class/Functional/Done'
import { ST } from '../../../../../../interface/ST'
import { NOOP } from '../../../../../../NOOP'
import { Pod } from '../../../../../../pod'
import { System } from '../../../../../../system'
import { Callback } from '../../../../../../types/Callback'
import { Unlisten } from '../../../../../../types/Unlisten'

export type I = {
  src: string
}

export type O = {
  stream: ST
}

export default class AudioSource extends Functional<I, O> {
  private _audio: HTMLAudioElement

  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['src'],
        o: ['stream'],
      },
      {},
      system,
      pod
    )

    this._audio = new Audio()
    this._audio.volume = 0
    this._audio.play()

    this.addListener('destroy', () => {
      this._audio.srcObject = null
    })
  }

  f({ src }, done: Done<O>) {
    this._audio.src = src

    const audio = this._audio

    const stream = new (class Stream extends $ implements ST {
      stream(callback: Callback<MediaProvider>): Unlisten {
        callback(audio.srcObject)
        return NOOP
      }
    })(this.__system, this.__pod)

    done({
      stream,
    })
  }

  d() {
    this._audio.src = null
  }
}
