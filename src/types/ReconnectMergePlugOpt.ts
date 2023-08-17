import { IOOf } from './IOOf'

export type ReconnectMergePlugOpt = IOOf<
  { pinId: string; subPinId: string } | { pinId: null; subPinId: null }
>
