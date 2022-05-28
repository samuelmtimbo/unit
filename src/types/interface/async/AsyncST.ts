import { ST } from '../ST'
import { $ST, $ST_C, $ST_R } from './$ST'

export const AsyncSTCall = (stream: ST): $ST_C => {
  return {
    $stream(data: {}, callback) {
      return stream.stream(callback)
    },
  }
}

export const AsyncSTWatch = (stream: ST): $ST_R => {
  return {}
}

export const AsyncSTRef = (stream: ST): $ST_R => {
  return {}
}

export const AsyncST = (stream: ST): $ST => {
  return {
    ...AsyncSTCall(stream),
    ...AsyncSTWatch(stream),
    ...AsyncSTRef(stream),
  }
}
