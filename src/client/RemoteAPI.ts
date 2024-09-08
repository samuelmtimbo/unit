import { Callback } from '../types/Callback'
import { Dict } from '../types/Dict'
import { Unlisten } from '../types/Unlisten'
import { MethodType } from './method'

type Get = (data: any, callback: Callback<any>) => void
type Call = (data: any, callback: Callback<any>) => void
type Watch = (data: any, callback: Callback<any>) => Unlisten

export interface RemoteAPI {
  get: Dict<Get>
  call: Dict<Call>
  watch: Dict<Watch>
  ref: Dict<(data: any) => RemoteAPI>
}

export type RemoteAPIData = {
  type: MethodType | 'unwatch' | 'ref_exec'
  data: any
}
