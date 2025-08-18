import { $ } from '../Class/$'
import { System } from '../system'
import { ADB } from '../types/interface/ADB'

export function wrapAudioBuffer(
  audioBuffer: AudioBuffer,
  system: System
): ADB & $ {
  return new (class Node extends $ implements ADB {
    __: string[] = ['ADB']

    async audioBuffer(): Promise<AudioBuffer> {
      return audioBuffer
    }
  })(system)
}
