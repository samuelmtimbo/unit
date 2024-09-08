import { MethodNotImplementedError } from '../../../exception/MethodNotImplementedError'
import { Callback } from '../../Callback'
import { CH } from '../CH'
import { $CH, $CH_C, $CH_G, $CH_R, $CH_W } from './$CH'

export const AsyncCHGet = (channel: CH): $CH_G => ({})

export const AsyncCHCall = (channel: CH): $CH_C => ({
  send: function (data: any, callback: Callback<void>): void {
    throw new MethodNotImplementedError()
  },
})

export const AsyncCHWatch = (channel: CH): $CH_W => {
  return {}
}

export const AsyncCHRef = (channel: CH): $CH_R => ({})

export const AsyncCH = (channel: CH): $CH => {
  return {
    ...AsyncCHGet(channel),
    ...AsyncCHCall(channel),
    ...AsyncCHWatch(channel),
    ...AsyncCHRef(channel),
  }
}
