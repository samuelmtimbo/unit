import { ServerSocket } from '../../../../../API'
import { Done } from '../../../../../Class/Functional/Done'
import { Holder } from '../../../../../Class/Holder'
import { System } from '../../../../../system'
import { Unlisten } from '../../../../../types/Unlisten'
import { S } from '../../../../../types/interface/S'
import { wrapServerSocket } from '../../../../../wrap/ServerSocket'
import { ID_UPGRADE } from '../../../../_ids'

export type I = {
  server: S
  url: any
  accept: boolean
}

export type O = {}

async function generateAcceptValue(secWebSocketKey: string) {
  const encoder = new TextEncoder()

  const data = encoder.encode(
    secWebSocketKey + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11'
  )

  const hashBuffer = await crypto.subtle.digest('SHA-1', data)

  return btoa(String.fromCharCode(...new Uint8Array(hashBuffer)))
}

interface ParsedFrame {
  fin: boolean
  opcode: number
  payload: string
}

function parseFrame(buffer: ArrayBuffer): ParsedFrame {
  const view = new DataView(buffer)
  const firstByte = view.getUint8(0)
  const fin = (firstByte & 0b10000000) !== 0
  const opcode = firstByte & 0b00001111

  const secondByte = view.getUint8(1)
  const isMasked = (secondByte & 0b10000000) !== 0
  let payloadLength = secondByte & 0b01111111

  let offset = 2

  // Extended payload length (if necessary)
  if (payloadLength === 126) {
    payloadLength = view.getUint16(2)
    offset += 2
  } else if (payloadLength === 127) {
    throw new Error('Payload too large!') // Simplified for demo purposes
  }

  // Get the masking key if present
  let maskingKey: Uint8Array | undefined
  if (isMasked) {
    maskingKey = new Uint8Array(buffer.slice(offset, offset + 4))
    offset += 4
  }

  // Extract and unmask the payload
  const payloadData = new Uint8Array(
    buffer.slice(offset, offset + payloadLength)
  )
  const unmaskedData = new Uint8Array(payloadLength)

  if (isMasked && maskingKey) {
    for (let i = 0; i < payloadLength; i++) {
      unmaskedData[i] = payloadData[i] ^ maskingKey[i % 4]
    }
  } else {
    unmaskedData.set(payloadData)
  }

  return {
    fin,
    opcode,
    payload: new TextDecoder().decode(unmaskedData), // Decode payload as UTF-8 string
  }
}

function buildFrame(data: string): ArrayBuffer {
  const payload = new TextEncoder().encode(data)
  const frame = new Uint8Array(2 + payload.length)

  frame[0] = 0b10000001 // FIN = 1, opcode = 0x1 (text frame)
  frame[1] = payload.length // Assume payload < 126 bytes for simplicity
  frame.set(payload, 2)

  return frame.buffer
}

export default class Upgrade extends Holder<I, O> {
  private _unlisten: Unlisten

  constructor(system: System) {
    super(
      {
        fi: ['url'],
        fo: ['socket'],
        i: [],
        o: [],
      },
      {
        input: {},
        output: {
          socket: {
            ref: true,
          },
        },
      },
      system,
      ID_UPGRADE,
      'close'
    )
  }

  async f({ url }: I, done: Done<O>): Promise<void> {
    const {
      cache: { requests, responses, ws, wss, sockets, heads },
      api: {
        http: { handleUpgrade },
      },
    } = this.__system

    const _request = requests[url]
    const _response = responses[url]

    if (!_request) {
      done(undefined, 'request not found')

      return
    }

    let _socket: ServerSocket

    try {
      _socket = await handleUpgrade(
        _request,
        _response,
        ws,
        wss,
        sockets,
        heads
      )
    } catch (err) {
      done(undefined, err.message)

      return
    }

    const socket = wrapServerSocket(_socket, this.__system)

    done({ socket })
  }

  d() {
    if (this._unlisten) {
      this._unlisten()

      this._unlisten = undefined
    }
  }

  public onIterDataInputData(name: keyof I, data: any): void {
    super.onIterDataInputData(name, data)
  }
}
