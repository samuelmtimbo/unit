import { AN } from '../AN'
import { $AN, $AN_C, $AN_G, $AN_R, $AN_W } from './$AN'

export const AsyncANGet = (buffer: AN): $AN_G => ({})

export const AsyncANCall = (buffer: AN): $AN_C => ({})

export const AsyncANWatch = (buffer: AN): $AN_W => {
  return {}
}

export const AsyncANRef = (buffer: AN): $AN_R => ({})

export const AsyncAN = (buffer: AN): $AN => {
  return {
    ...AsyncANGet(buffer),
    ...AsyncANCall(buffer),
    ...AsyncANWatch(buffer),
    ...AsyncANRef(buffer),
  }
}
