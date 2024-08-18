import { Callback } from '../types/Callback'
import { Dict } from '../types/Dict'
import { Unlisten } from '../types/Unlisten'

type RemoteAPICall = (data: any, callback: Callback<any>) => void
type RemoteAPIWatch = (data: any, callback: Callback<any>) => Unlisten

export interface RemoteAPI {
  call: Dict<RemoteAPICall>
  watch: Dict<RemoteAPIWatch>
  ref: Dict<(data: any) => RemoteAPI>
}

export type RemoteAPIData = {
  type: 'call' | 'watch' | 'unwatch' | 'ref' | 'ref_exec'
  data: any
}
