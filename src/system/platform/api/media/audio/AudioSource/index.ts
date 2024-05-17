import { Functional } from '../../../../../../Class/Functional'
import { Done } from '../../../../../../Class/Functional/Done'
import { System } from '../../../../../../system'
import { MS } from '../../../../../../types/interface/MS'
import { wrapMediaStream } from '../../../../../../wrap/MediaStream'
import { ID_AUDIO_SOURCE } from '../../../../../_ids'

export type I = {
  src: string
}

export type O = {
  stream: MS
}

async function createMediaStreamFromUrl(
  src: string
): Promise<{ stream: MediaStream; source: AudioBufferSourceNode }> {
  // @ts-ignore
  const audioContext = new (window.AudioContext || window.webkitAudioContext)()

  let source: AudioBufferSourceNode

  try {
    const response = await fetch(src)
    const arrayBuffer = await response.arrayBuffer()
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)

    source = audioContext.createBufferSource()

    source.buffer = audioBuffer

    const mediaStreamDestination = audioContext.createMediaStreamDestination()

    source.connect(mediaStreamDestination)
    source.start()

    const stream = mediaStreamDestination.stream

    return { stream, source }
  } catch (error) {
    if (source) {
      source.stop()
      source.disconnect()
    }

    throw new Error('could not load media stream')
  }
}

export default class AudioSource extends Functional<I, O> {
  private _source: AudioBufferSourceNode

  constructor(system: System) {
    super(
      {
        i: ['src'],
        o: ['stream'],
      },
      {
        output: {
          stream: {
            ref: true,
          },
        },
      },
      system,
      ID_AUDIO_SOURCE
    )

    const {
      api: {
        window: { Audio },
      },
    } = this.__system

    this.addListener('play', () => {
      if (this._source) {
        this._source.start()
      }
    })

    this.addListener('pause', () => {
      if (this._source) {
        this._source.stop()
      }
    })

    this.addListener('destroy', () => {
      this.d()
    })
  }

  async f({ src }, done: Done<O>) {
    let srcObject: MediaStream
    let source: AudioBufferSourceNode

    try {
      ;({ stream: srcObject, source } = await createMediaStreamFromUrl(src))
    } catch (err) {
      done(undefined, err.message)

      return
    }

    this._source = source

    const stream = wrapMediaStream(srcObject, this.__system)

    done({
      stream,
    })
  }

  d() {
    if (this._source) {
      this._source.stop()
      this._source.disconnect()
    }
  }
}
