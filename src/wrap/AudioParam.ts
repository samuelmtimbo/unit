import { $ } from '../Class/$'
import { System } from '../system'
import { Callback } from '../types/Callback'
import { V } from '../types/interface/V'

export function wrapAudioParam(
  audioParam: AudioParam,
  system: System
): V<number> {
  return new (class Node extends $ implements V<number> {
    __: string[] = ['AN']

    read(callback: Callback<number>): void {
      callback(audioParam.value)
    }

    write(data: number, callback: Callback): void {
      audioParam.value = data

      callback()
    }
  })(system)
}
