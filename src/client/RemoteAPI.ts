import { Callback } from '../Callback'
import { Dict } from '../types/Dict'
import { Unlisten } from '../Unlisten'

export interface RemoteAPI {
  call: Dict<(data: any, callback: Callback<any>) => void>
  watch: Dict<(data: any, callback: Callback<any>) => Unlisten>
  ref: Dict<(data: any) => RemoteAPI>
}

export type RemoteAPIData = {
  type: 'call' | 'watch' | 'unwatch' | 'ref' | 'ref_exec'
  data: any
}
