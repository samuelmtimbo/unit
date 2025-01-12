import { ServerResponse } from '../../API'
import { BO } from './BO'
import { V } from './V'

export interface RES extends BO, V<ServerResponse> {}
