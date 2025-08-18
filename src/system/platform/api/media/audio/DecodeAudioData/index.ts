import { $ } from '../../../../../../Class/$'
import { Functional } from '../../../../../../Class/Functional'
import { Done } from '../../../../../../Class/Functional/Done'
import { Fail } from '../../../../../../Class/Functional/Fail'
import { System } from '../../../../../../system'
import { AB } from '../../../../../../types/interface/AB'
import { AC } from '../../../../../../types/interface/AC'
import { ADB } from '../../../../../../types/interface/ADB'
import { wrapAudioBuffer } from '../../../../../../wrap/AudioBuffer'
import { ID_GAIN_NODE } from '../../../../../_ids'

export type I = {
  buffer: AB & $
  context: AC
}

export type O = {
  buffer: ADB & $
}

export default class DecodeAudioData extends Functional<I, O> {
  constructor(system: System) {
    super(
      {
        i: ['buffer', 'context'],
        o: ['buffer'],
      },
      {
        input: {
          buffer: {
            ref: true,
          },
          context: {
            ref: true,
          },
        },
        output: {
          buffer: {
            ref: true,
          },
        },
      },
      system,
      ID_GAIN_NODE
    )
  }

  async f({ buffer, context }: I, done: Done<O>, fail: Fail) {
    const arrayBuffer = await buffer.arrayBuffer()

    let audioBuffer: AudioBuffer

    // @ts-ignore
    if (arrayBuffer.detached) {
      fail('cannot decode detached array buffer')

      return
    }

    try {
      const context_ = context.audioContext()

      await context_.resume()

      audioBuffer = await context.decodeAudioData(arrayBuffer)
    } catch (err) {
      fail(err.message ?? 'unknown error while decoding audio array buffer')

      return
    }

    const buffer_ = wrapAudioBuffer(audioBuffer, this.__system)

    done({
      buffer: buffer_,
    })
  }
}
