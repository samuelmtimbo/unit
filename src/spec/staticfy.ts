import { isPrimitive } from './primitive'

export function staticfy(data: any): any {
  if (isPrimitive(data)) {
    return data
  } else {
    return {} // TODO
  }
}
