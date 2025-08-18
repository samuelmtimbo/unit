import { Callback } from '../../Callback'
import { ADB } from '../ADB'
import { $ADB, $ADB_C, $ADB_G, $ADB_R, $ADB_W } from './$ADB'

export const AsyncADBGet = (buffer: ADB): $ADB_G => ({
  $audioBuffer: function (data: {}, callback: Callback<AudioBuffer>): void {
    void (async () => {
      const buffer_ = await buffer.audioBuffer()

      callback(buffer_)
    })()
  },
})

export const AsyncADBCall = (buffer: ADB): $ADB_C => ({})

export const AsyncADBWatch = (buffer: ADB): $ADB_W => {
  return {}
}

export const AsyncADBRef = (buffer: ADB): $ADB_R => ({})

export const AsyncADB = (buffer: ADB): $ADB => {
  return {
    ...AsyncADBGet(buffer),
    ...AsyncADBCall(buffer),
    ...AsyncADBWatch(buffer),
    ...AsyncADBRef(buffer),
  }
}
