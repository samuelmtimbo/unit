import { R } from './R'
import { W } from './W'

export interface V<T = any> extends W<T>, R<T> {}
