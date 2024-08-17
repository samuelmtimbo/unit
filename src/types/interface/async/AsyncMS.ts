import { MS } from '../MS'
import { $MS, $MS_C, $MS_R, $MS_W } from './$MS'

export const AsyncMSCall = (stream: MS): $MS_C => {
  return {
    async $get(data: {}, callback) {
      const mediaStream = await stream.mediaStream()

      callback(mediaStream)
    },
  }
}

export const AsyncMSWatch = (stream: MS): $MS_W => {
  return {}
}

export const AsyncMSRef = (stream: MS): $MS_R => {
  return {}
}

export const AsyncMS = (stream: MS): $MS => {
  return {
    ...AsyncMSCall(stream),
    ...AsyncMSWatch(stream),
    ...AsyncMSRef(stream),
  }
}
