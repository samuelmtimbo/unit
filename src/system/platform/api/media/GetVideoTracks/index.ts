import { $ } from '../../../../../Class/$'
import { Done } from '../../../../../Class/Functional/Done'
import { Fail } from '../../../../../Class/Functional/Fail'
import { Holder } from '../../../../../Class/Holder'
import { MethodNotImplementedError } from '../../../../../exception/MethodNotImplementedError'
import { System } from '../../../../../system'
import { A } from '../../../../../types/interface/A'
import { MS } from '../../../../../types/interface/MS'
import { MST } from '../../../../../types/interface/MST'
import { wrapMediaStreamTrack } from '../../../../../wrap/MediaStreamTrack'
import { ID_GET_VIDEO_TRACKS } from '../../../../_ids'

export type I = {
  stream: MS
  init: number
  done: any
}

export type O = {
  tracks: A
}

export default class GetVideoTracks extends Holder<I, O> {
  constructor(system: System) {
    super(
      {
        fi: ['stream', 'init'],
        fo: ['tracks'],
        i: [],
        o: [],
      },
      {
        input: {
          stream: {
            ref: true,
          },
        },
        output: {
          tracks: {
            ref: true,
          },
        },
      },
      system,
      ID_GET_VIDEO_TRACKS
    )
  }

  async f({ stream }: I, done: Done<O>, fail: Fail) {
    let _tracks: MediaStreamTrack[]

    try {
      _tracks = await stream.getVideoTracks()
    } catch (err) {
      fail(err)
    }

    const tracks = new (class Array extends $ implements A<MST> {
      __: string[] = ['A']

      async append(a: MST): Promise<void> {
        throw new MethodNotImplementedError()
      }

      async put(i: number, data: any): Promise<void> {
        throw new MethodNotImplementedError()
      }

      async at(i: number): Promise<MST> {
        const track = _tracks[i]

        const _track = wrapMediaStreamTrack(track, this.__system)

        return _track
      }

      async length(): Promise<number> {
        return _tracks.length
      }

      async indexOf(a: MST): Promise<number> {
        throw new MethodNotImplementedError()
      }

      async pop(): Promise<MST> {
        throw new MethodNotImplementedError()
      }

      async shift(): Promise<MST> {
        throw new MethodNotImplementedError()
      }
    })(this.__system)

    done({ tracks })
  }
}
