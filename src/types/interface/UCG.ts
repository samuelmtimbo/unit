import { C } from './C'
import { G } from './G'
import { U } from './U'

export type UCG<I = any, O = any, U_ = U> = U<I, O> & C & G<I, O, U_>
