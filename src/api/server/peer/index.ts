import { send } from '../../../client/host/socket'

export function sendServerPeer(type: string, data: any): void {
  console.log('sendServerPeer', type, data)
  send({
    type: 'server',
    data: {
      type: 'peer',
      data: {
        type,
        data,
      },
    },
  })
}
