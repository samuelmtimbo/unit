import { Config } from '../Class/Unit/Config'

export type UnitClass<T = any> = { id: string; new (config?: Config): T }
