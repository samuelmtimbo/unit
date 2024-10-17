import { IM } from '../IM'
import { $IM, $IM_C, $IM_G, $IM_R, $IM_W } from './$IM'

export const AsyncIMGet = (image: IM): $IM_G => ({})

export const AsyncIMCall = (image: IM): $IM_C => ({})

export const AsyncIMWatch = (image: IM): $IM_W => {
  return {}
}

export const AsyncIMRef = (image: IM): $IM_R => ({})

export const AsyncIM = (media: IM): $IM => {
  return {
    ...AsyncIMGet(media),
    ...AsyncIMCall(media),
    ...AsyncIMWatch(media),
    ...AsyncIMRef(media),
  }
}
