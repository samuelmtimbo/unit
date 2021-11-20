import { uuidIdNotInSet } from '../../../util/id'

const _receiver_id: Set<string> = new Set()

export const newPeerReceiverId = (): string => {
  const id = uuidIdNotInSet(_receiver_id)
  return id
}

export const removePeerReceiverId = (id: string): void => {
  _receiver_id.delete(id)
}

const _transmitter_id: Set<string> = new Set()

export const newPeerTransmitterId = (): string => {
  const id = uuidIdNotInSet(_transmitter_id)
  return id
}

export const removePeerTransmitterId = (id: string): void => {
  _transmitter_id.delete(id)
}
