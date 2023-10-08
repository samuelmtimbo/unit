import { IM } from './IM'

export interface B extends IM {
  blob(): Promise<Blob>
}
