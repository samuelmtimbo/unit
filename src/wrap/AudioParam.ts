import { $ } from '../Class/$'
import { System } from '../system'
import { V } from '../types/interface/V'

export function wrapAudioParam(
  audioParam: AudioParam,
  system: System
): V<number> {
  return new (class Node extends $ implements V<number> {
    __: string[] = ['AN']

    read(): Promise<number> {
      return Promise.resolve(audioParam.value)
    }

    write(data: number): Promise<void> {
      audioParam.value = data

      return
    }
  })(system)
}
