import { NO } from '../NO'
import { $NO, $NO_C, $NO_G, $NO_R, $NO_W } from './$NO'

export const AsyncNOGet = (notification: NO): $NO_G => ({})

export const AsyncNOCall = (notification: NO): $NO_C => ({
  $show: function (data: {}): void {
    notification.show()
  },
  $close: function (data: {}): void {
    notification.close()
  },
})

export const AsyncNOWatch = (notification: NO): $NO_W => {
  return {}
}

export const AsyncNORef = (notification: NO): $NO_R => ({})

export const AsyncNO = (notification: NO): $NO => {
  return {
    ...AsyncNOGet(notification),
    ...AsyncNOCall(notification),
    ...AsyncNOWatch(notification),
    ...AsyncNORef(notification),
  }
}
