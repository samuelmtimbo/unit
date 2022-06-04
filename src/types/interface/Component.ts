import { Unit } from '../../Class/Unit'
import { PrimitiveEvents } from '../../Primitive'
import { C, C_EE } from './C'

export type ComponentEvents = PrimitiveEvents<C_EE> & C_EE

export interface Component_<T extends ComponentEvents = ComponentEvents>
  extends Unit<any, any, T>,
    C {}
