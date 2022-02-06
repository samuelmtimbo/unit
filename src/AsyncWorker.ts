import {
  $C,
  $C_C,
  $C_METHOD_CALL,
  $C_METHOD_REF,
  $C_METHOD_WATCH,
  $C_R,
  $C_W,
} from './interface/async/$C'
import {
  $EE,
  $EE_C,
  $EE_METHOD_CALL,
  $EE_METHOD_REF,
  $EE_METHOD_WATCH,
  $EE_R,
  $EE_W,
} from './interface/async/$EE'
import {
  $G,
  $G_C,
  $G_METHOD_CALL,
  $G_METHOD_REF,
  $G_METHOD_WATCH,
  $G_R,
  $G_W,
} from './interface/async/$G'
import { $Graph } from './interface/async/$Graph'
import {
  $J,
  $J_C,
  $J_METHOD_CALL,
  $J_METHOD_REF,
  $J_METHOD_WATCH,
  $J_R,
  $J_W,
} from './interface/async/$J'
import {
  $ST,
  $ST_C,
  $ST_METHOD_CALL,
  $ST_METHOD_REF,
  $ST_METHOD_WATCH,
  $ST_R,
  $ST_W,
} from './interface/async/$ST'
import {
  $U,
  $U_C,
  $U_METHOD_CALL,
  $U_METHOD_REF,
  $U_METHOD_WATCH,
  $U_R,
  $U_W,
} from './interface/async/$U'
import {
  $V_METHOD_CALL,
  $V_METHOD_REF,
  $V_METHOD_WATCH,
} from './interface/async/$V'
import { AsyncWrap } from './interface/async/AsyncWrap'
import { RemotePort } from './RemotePort'
import { Callback } from './types/Callback'
import { Unlisten } from './types/Unlisten'

export function AsyncWorker(client: RemotePort, _: string[]): any {
  return AsyncWrap(client, _, {
    $G: AsyncWorkerG,
    $C: AsyncWorkerC,
    $V: AsyncWorkerV,
    $J: AsyncWorkerJ,
    $U: AsyncWorkerU,
    $ST: AsyncWorkerST,
  })
}

export function makeAsyncWorkerC(
  client: RemotePort,
  METHOD_CALL: string[]
): any {
  const _$_C = {}
  for (const name of METHOD_CALL) {
    const $name = `$${name}`
    _$_C[$name] = (data: any, callback: Callback<any>): void => {
      return client.call($name, data, callback)
    }
  }
  return _$_C
}

export function makeAsyncWorkerW(
  client: RemotePort,
  METHOD_WATCH: string[]
): any {
  const _$_W = {}
  for (const name of METHOD_WATCH) {
    const $name = `$${name}`
    _$_W[$name] = (data: any, callback: Callback<any>): Unlisten => {
      const unlisten = client.watch($name, data, callback)
      return unlisten
    }
  }
  return _$_W
}

export function makeAsyncWorkerR(
  client: RemotePort,
  METHOD_REF: string[]
): any {
  const _$_R = {}
  for (const name of METHOD_REF) {
    const $name = `$${name}`
    _$_R[$name] = (data: any): $U => {
      const { _ } = data
      const ref_client = client.ref($name, data)
      const $ref = AsyncWorker(ref_client, _)
      return $ref
    }
  }
  return _$_R
}

export function AsyncWorkerEE_C(client: RemotePort): $EE_C {
  return makeAsyncWorkerC(client, $EE_METHOD_CALL)
}

export function AsyncWorkerEE_W(client: RemotePort): $EE_W {
  return makeAsyncWorkerW(client, $EE_METHOD_WATCH)
}

export function AsyncWorkerEE_R(client: RemotePort): $EE_R {
  return makeAsyncWorkerR(client, $EE_METHOD_REF)
}

export function AsyncWorkerEE(client: RemotePort): $EE {
  return {
    ...AsyncWorkerEE_C(client),
    ...AsyncWorkerEE_W(client),
    ...AsyncWorkerEE_R(client),
  }
}

export function AsyncWorkerU_C(client: RemotePort): $U_C {
  return makeAsyncWorkerC(client, $U_METHOD_CALL)
}

export function AsyncWorkerU_W(client: RemotePort): $U_W {
  return makeAsyncWorkerW(client, $U_METHOD_WATCH)
}

export function AsyncWorkerU_R(client: RemotePort): $U_R {
  return makeAsyncWorkerR(client, $U_METHOD_REF)
}

export function AsyncWorkerU(client: RemotePort): $U {
  return {
    ...AsyncWorkerU_C(client),
    ...AsyncWorkerU_W(client),
    ...AsyncWorkerU_R(client),
  }
}

export function AsyncWorkerC_C(client: RemotePort): $C_C {
  return makeAsyncWorkerC(client, $C_METHOD_CALL)
}

export function AsyncWorkerC_W(client: RemotePort): $C_W {
  return makeAsyncWorkerW(client, $C_METHOD_WATCH)
}

export function AsyncWorkerC_R(client: RemotePort): $C_R {
  return makeAsyncWorkerR(client, $C_METHOD_REF)
}

export function AsyncWorkerC(client: RemotePort): $C {
  return {
    ...AsyncWorkerC_C(client),
    ...AsyncWorkerC_W(client),
    ...AsyncWorkerC_R(client),
  }
}

export function AsyncWorkerG_C(client: RemotePort): $G_C {
  return makeAsyncWorkerC(client, $G_METHOD_CALL)
}

export function AsyncWorkerG_W(client: RemotePort): $G_W {
  return makeAsyncWorkerW(client, $G_METHOD_WATCH)
}

export function AsyncWorkerG_R(client: RemotePort): $G_R {
  return makeAsyncWorkerR(client, $G_METHOD_REF)
}

export function AsyncWorkerG(client: RemotePort): $G {
  return {
    ...AsyncWorkerG_C(client),
    ...AsyncWorkerG_W(client),
    ...AsyncWorkerG_R(client),
  }
}

export function AsyncWorkerV_C(client: RemotePort): $J_C {
  return makeAsyncWorkerC(client, $V_METHOD_CALL)
}

export function AsyncWorkerV_W(client: RemotePort): $J_W {
  return makeAsyncWorkerW(client, $V_METHOD_WATCH)
}

export function AsyncWorkerV_R(client: RemotePort): $J_R {
  return makeAsyncWorkerR(client, $V_METHOD_REF)
}

export function AsyncWorkerV(client: RemotePort): $J {
  return {
    ...AsyncWorkerV_C(client),
    ...AsyncWorkerV_W(client),
    ...AsyncWorkerV_R(client),
  }
}

export function AsyncWorkerJ_C(client: RemotePort): $J_C {
  return makeAsyncWorkerC(client, $J_METHOD_CALL)
}

export function AsyncWorkerJ_W(client: RemotePort): $J_W {
  return makeAsyncWorkerW(client, $J_METHOD_WATCH)
}

export function AsyncWorkerJ_R(client: RemotePort): $J_R {
  return makeAsyncWorkerR(client, $J_METHOD_REF)
}

export function AsyncWorkerJ(client: RemotePort): $J {
  return {
    ...AsyncWorkerJ_C(client),
    ...AsyncWorkerJ_W(client),
    ...AsyncWorkerJ_R(client),
  }
}

export function AsyncWorkerST_C(client: RemotePort): $ST_C {
  return makeAsyncWorkerC(client, $ST_METHOD_CALL)
}

export function AsyncWorkerST_W(client: RemotePort): $ST_W {
  return makeAsyncWorkerW(client, $ST_METHOD_WATCH)
}

export function AsyncWorkerST_R(client: RemotePort): $ST_R {
  return makeAsyncWorkerR(client, $ST_METHOD_REF)
}

export function AsyncWorkerST(client: RemotePort): $ST {
  return {
    ...AsyncWorkerST_C(client),
    ...AsyncWorkerST_W(client),
    ...AsyncWorkerST_R(client),
  }
}

export function AsyncWorkerGraph(client: RemotePort): $Graph {
  return {
    ...AsyncWorkerEE(client),
    ...AsyncWorkerU(client),
    ...AsyncWorkerC(client),
    ...AsyncWorkerG(client),
  }
}
