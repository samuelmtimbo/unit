import { RS } from '../RS'
import { $RS, $RS_C, $RS_G, $RS_R, $RS_W } from './$RS'

export const AsyncRSGet = (media: RS): $RS_G => ({})

export const AsyncRSCall = (media: RS): $RS_C => ({})

export const AsyncRSWatch = (media: RS): $RS_W => {
  return {}
}

export const AsyncRSRef = (media: RS): $RS_R => ({})

export const AsyncRS = (media: RS): $RS => {
  return {
    ...AsyncRSGet(media),
    ...AsyncRSCall(media),
    ...AsyncRSWatch(media),
    ...AsyncRSRef(media),
  }
}
