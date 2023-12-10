import { $_EE } from '../Class/$'
import { C_EE } from '../types/interface/C'
import { G_EE } from '../types/interface/G'
import { U_EE } from '../types/interface/U'
import { Moment } from './Moment'

export interface UnitMoment extends Moment {
  type: 'unit'
  event: keyof $_EE | keyof U_EE | keyof C_EE | keyof G_EE
  data: any
}
