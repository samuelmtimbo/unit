import { Peer } from '../../../../../api/peer/Peer'
import { Functional, FunctionalEvents } from '../../../../../Class/Functional'
import { Done } from '../../../../../Class/Functional/Done'
import { G } from '../../../../../interface/G'
import { Pod } from '../../../../../pod'
import { System } from '../../../../../system'
import { Unlisten } from '../../../../../types/Unlisten'

export interface I<T> {
  id: string
  user: string
}

export interface O<T> {
  graph: G
}

export type BroadcastPod_EE = { data: [any] }

export type BroadcastPodEvents = FunctionalEvents<BroadcastPod_EE> &
  BroadcastPod_EE

export default class BroadcastPod<T> extends Functional<
  I<T>,
  O<T>,
  BroadcastPodEvents
> {
  private _transmitter_id: string | null = null
  private _id: string | null = null

  private _peer: Peer | null = null
  private _peer_connected: boolean = false
  private _peer_unlisten: Unlisten | undefined = undefined

  private _socket_unlisten: Unlisten | undefined = undefined

  constructor(system: System, pod: Pod) {
    super(
      {
        i: ['id', 'user'],
        o: ['graph'],
      },
      {
        input: {},
      },
      system,
      pod
    )

    this.addListener('destroy', () => {
      this._disconnect()
    })
  }

  private _peer_stream: MediaStream | null = null

  f({}: I<T>, done: Done<O<T>>): void {}

  d() {
    this._disconnect()
  }

  _connect(user_id: string, channel_id: string): void {}

  private _disconnect = (): void => {}
}
