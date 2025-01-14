import { ServerResponse } from '../../API'
import { BO } from './BO'
import { J } from './J'
import { V } from './V'

export interface RES extends BO, J<ServerResponse>, V<ServerResponse> {}
