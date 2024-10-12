import { ME } from '../ME'
import { $ME, $ME_C, $ME_G, $ME_R, $ME_W } from './$ME'

export const AsyncMEGet = (media: ME): $ME_G => ({})

export const AsyncMECall = (media: ME): $ME_C => ({
  $mediaPlay: function (data: {}): void {
    media.mediaPlay()
  },
  $mediaPause: function (data: {}): void {
    media.mediaPause()
  },
})

export const AsyncMEWatch = (media: ME): $ME_W => {
  return {}
}

export const AsyncMERef = (media: ME): $ME_R => ({})

export const AsyncME = (media: ME): $ME => {
  return {
    ...AsyncMEGet(media),
    ...AsyncMECall(media),
    ...AsyncMEWatch(media),
    ...AsyncMERef(media),
  }
}
