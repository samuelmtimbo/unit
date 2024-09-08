import { MS } from '../MS'
import { $MS, $MS_C, $MS_G, $MS_R, $MS_W } from './$MS'

export const AsyncMSGet = (stream: MS): $MS_G => {
  return {
    async $mediaStream(data: {}, callback) {
      const mediaStream = await stream.mediaStream()

      callback(mediaStream)
    },
  }
}

export const AsyncMSCall = (stream: MS): $MS_C => {
  return {}
}

export const AsyncMSWatch = (stream: MS): $MS_W => {
  return {}
}

export const AsyncMSRef = (stream: MS): $MS_R => {
  return {}
}

export const AsyncMS = (stream: MS): $MS => {
  return {
    ...AsyncMSGet(stream),
    ...AsyncMSCall(stream),
    ...AsyncMSWatch(stream),
    ...AsyncMSRef(stream),
  }
}
