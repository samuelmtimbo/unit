import { $ST, $ST_C, $ST_R } from './$ST'

export const AsyncSTCall = (stream: $ST_C): $ST_C => {
  return {
    $stream(data: {}, callback) {
      return stream.$stream(data, callback)
    },
  }
}

export const AsyncSTWatch = (stream: $ST_R): $ST_R => {
  return {}
}

export const AsyncSTRef = (stream: $ST_R): $ST_R => {
  return {}
}

export const AsyncST = (stream: $ST): $ST => {
  return {
    ...AsyncSTCall(stream),
    ...AsyncSTWatch(stream),
    ...AsyncSTRef(stream),
  }
}
