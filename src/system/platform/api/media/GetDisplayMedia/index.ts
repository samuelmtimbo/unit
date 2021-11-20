import { ObjectSource } from '../../../../../ObjectSource'
import { Primitive } from '../../../../../Primitive'

export type I = {
  opt: MediaStreamConstraints
}

export type O = {}

export default class GetDisplayMedia extends Primitive<I, O> {
  private _stream: MediaStream

  private _stream_source: ObjectSource<MediaStream> = new ObjectSource()

  constructor() {
    super({
      i: ['opt'],
      o: [],
    })

    this.addListener('destroy', () => {
      if (this._stream) {
        this._stream.getTracks().forEach((track) => track.stop())
      }
    })

    this.addListener('take_err', () => {
      this._input.opt.pull()
    })
  }

  onDataInputInvalid(name: string): void {
    // if (name === 'opt') {
    this._stream_source.set(null)
    // }
  }

  onDataInputData(name: string, value: any): void {
    // @ts-ignore
    if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
      this.err('Screen Capture API API not supported')
      return
    }

    navigator.mediaDevices
      // @ts-ignore
      .getDisplayMedia(value)
      .then((stream: MediaStream) => {
        const media_tracks = stream.getTracks()
        const first_media_track = media_tracks[0]
        if (first_media_track) {
          first_media_track.addEventListener('ended', () => {
            this._stream_source.set(null)
          })
          this._stream_source.set(stream)
        }
      })
      .catch((err) => {
        this.err(err.message)
      })
  }

  onDataInputDrop() {
    if (this.hasErr()) {
      this.takeErr()
    }
  }
}
