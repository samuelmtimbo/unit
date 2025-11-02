import { Callback } from '../../Callback'
import { D } from '../D'
import { $D, $D_C, $D_G, $D_R, $D_W } from './$D'

export const AsyncDGet = (date: D): $D_G => ({
  $getTime: function ({}: {}, callback: Callback<number>): void {
    const time = date.getTime()

    callback(time)
  },
  $getDate: function (data: {}, callback: Callback<number>): void {
    const day = date.getDate()

    callback(day)
  },
})

export const AsyncDCall = (date: D): $D_C => ({
  $setHours: function ({
    hours,
    min,
    sec,
    ms,
  }: {
    hours: number
    min: number
    sec: number
    ms: number
  }): void {
    date.setHours(hours, min, sec, ms)
  },
  $setDate: function ({ day }: { day: number }): void {
    date.setDate(day)
  },
})

export const AsyncDWatch = (date: D): $D_W => {
  return {}
}

export const AsyncDRef = (date: D): $D_R => ({})

export const AsyncD = (date: D): $D => {
  return {
    ...AsyncDGet(date),
    ...AsyncDCall(date),
    ...AsyncDWatch(date),
    ...AsyncDRef(date),
  }
}
