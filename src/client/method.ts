import { AllTypes } from '../interface'
import { AllKeys } from '../types/AllKeys'
import {
  A_METHOD_CALL,
  A_METHOD_GET,
  A_METHOD_REF,
  A_METHOD_WATCH,
} from '../types/interface/async/$A'
import {
  AB_METHOD_CALL,
  AB_METHOD_GET,
  AB_METHOD_REF,
  AB_METHOD_WATCH,
} from '../types/interface/async/$AB'
import {
  AC_METHOD_CALL,
  AC_METHOD_GET,
  AC_METHOD_REF,
  AC_METHOD_WATCH,
} from '../types/interface/async/$AC'
import {
  B_METHOD_CALL,
  B_METHOD_GET,
  B_METHOD_REF,
  B_METHOD_WATCH,
} from '../types/interface/async/$B'
import {
  BC_METHOD_CALL,
  BC_METHOD_GET,
  BC_METHOD_REF,
  BC_METHOD_WATCH,
} from '../types/interface/async/$BC'
import {
  BD_METHOD_CALL,
  BD_METHOD_GET,
  BD_METHOD_REF,
  BD_METHOD_WATCH,
} from '../types/interface/async/$BD'
import {
  BS_METHOD_CALL,
  BS_METHOD_GET,
  BS_METHOD_REF,
  BS_METHOD_WATCH,
} from '../types/interface/async/$BS'
import {
  BSE_METHOD_CALL,
  BSE_METHOD_GET,
  BSE_METHOD_REF,
  BSE_METHOD_WATCH,
} from '../types/interface/async/$BSE'
import {
  C_METHOD_CALL,
  C_METHOD_GET,
  C_METHOD_REF,
  C_METHOD_WATCH,
} from '../types/interface/async/$C'
import {
  CA_METHOD_CALL,
  CA_METHOD_GET,
  CA_METHOD_REF,
  CA_METHOD_WATCH,
} from '../types/interface/async/$CA'
import {
  CH_METHOD_CALL,
  CH_METHOD_GET,
  CH_METHOD_REF,
  CH_METHOD_WATCH,
} from '../types/interface/async/$CH'
import {
  CK_METHOD_CALL,
  CK_METHOD_GET,
  CK_METHOD_REF,
  CK_METHOD_WATCH,
} from '../types/interface/async/$CK'
import {
  CS_METHOD_CALL,
  CS_METHOD_GET,
  CS_METHOD_REF,
  CS_METHOD_WATCH,
} from '../types/interface/async/$CS'
import {
  D_METHOD_CALL,
  D_METHOD_GET,
  D_METHOD_REF,
  D_METHOD_WATCH,
} from '../types/interface/async/$D'
import {
  EE_METHOD_CALL,
  EE_METHOD_GET,
  EE_METHOD_REF,
  EE_METHOD_WATCH,
} from '../types/interface/async/$EE'
import {
  F_METHOD_CALL,
  F_METHOD_GET,
  F_METHOD_REF,
  F_METHOD_WATCH,
} from '../types/interface/async/$F'
import {
  G_METHOD_CALL,
  G_METHOD_GET,
  G_METHOD_REF,
  G_METHOD_WATCH,
} from '../types/interface/async/$G'
import {
  GP_METHOD_CALL,
  GP_METHOD_GET,
  GP_METHOD_REF,
  GP_METHOD_WATCH,
} from '../types/interface/async/$GP'
import {
  IB_METHOD_CALL,
  IB_METHOD_GET,
  IB_METHOD_REF,
  IB_METHOD_WATCH,
} from '../types/interface/async/$IB'
import {
  J_METHOD_CALL,
  J_METHOD_GET,
  J_METHOD_REF,
  J_METHOD_WATCH,
} from '../types/interface/async/$J'
import {
  MS_METHOD_CALL,
  MS_METHOD_GET,
  MS_METHOD_REF,
  MS_METHOD_WATCH,
} from '../types/interface/async/$MS'
import {
  NO_METHOD_CALL,
  NO_METHOD_GET,
  NO_METHOD_REF,
  NO_METHOD_WATCH,
} from '../types/interface/async/$NO'
import {
  PS_METHOD_CALL,
  PS_METHOD_GET,
  PS_METHOD_REF,
  PS_METHOD_WATCH,
} from '../types/interface/async/$PS'
import {
  S_METHOD_CALL,
  S_METHOD_GET,
  S_METHOD_REF,
  S_METHOD_WATCH,
} from '../types/interface/async/$S'
import {
  TD_METHOD_CALL,
  TD_METHOD_GET,
  TD_METHOD_WATCH,
} from '../types/interface/async/$TD'
import {
  TE_METHOD_CALL,
  TE_METHOD_GET,
  TE_METHOD_REF,
  TE_METHOD_WATCH,
} from '../types/interface/async/$TE'
import {
  U_METHOD_CALL,
  U_METHOD_GET,
  U_METHOD_REF,
  U_METHOD_WATCH,
} from '../types/interface/async/$U'
import {
  V_METHOD_CALL,
  V_METHOD_GET,
  V_METHOD_REF,
  V_METHOD_WATCH,
} from '../types/interface/async/$V'
import {
  W_METHOD_CALL,
  W_METHOD_GET,
  W_METHOD_REF,
  W_METHOD_WATCH,
} from '../types/interface/async/$W'

export type MethodType = 'get' | 'call' | 'watch' | 'ref'

export const METHOD_TYPES: MethodType[] = [
  'get',
  'call',
  'watch',
  'ref',
] as const

export const METHOD: AllKeys<AllTypes<any>, Record<MethodType, string[]>> = {
  EE: {
    get: EE_METHOD_GET,
    call: EE_METHOD_CALL,
    watch: EE_METHOD_WATCH,
    ref: EE_METHOD_REF,
  },
  U: {
    get: U_METHOD_GET,
    call: U_METHOD_CALL,
    watch: U_METHOD_WATCH,
    ref: U_METHOD_REF,
  },
  G: {
    get: G_METHOD_GET,
    call: G_METHOD_CALL,
    watch: G_METHOD_WATCH,
    ref: G_METHOD_REF,
  },
  C: {
    get: C_METHOD_GET,
    call: C_METHOD_CALL,
    watch: C_METHOD_WATCH,
    ref: C_METHOD_REF,
  },
  V: {
    get: V_METHOD_GET,
    call: V_METHOD_CALL,
    watch: V_METHOD_WATCH,
    ref: V_METHOD_REF,
  },
  J: {
    get: J_METHOD_GET,
    call: J_METHOD_CALL,
    watch: J_METHOD_WATCH,
    ref: J_METHOD_REF,
  },
  MS: {
    get: MS_METHOD_GET,
    call: MS_METHOD_CALL,
    watch: MS_METHOD_WATCH,
    ref: MS_METHOD_REF,
  },
  S: {
    get: S_METHOD_GET,
    call: S_METHOD_CALL,
    watch: S_METHOD_WATCH,
    ref: S_METHOD_REF,
  },
  CA: {
    get: CA_METHOD_GET,
    call: CA_METHOD_CALL,
    watch: CA_METHOD_WATCH,
    ref: CA_METHOD_REF,
  },
  B: {
    get: B_METHOD_GET,
    call: B_METHOD_CALL,
    watch: B_METHOD_WATCH,
    ref: B_METHOD_REF,
  },
  IB: {
    get: IB_METHOD_GET,
    call: IB_METHOD_CALL,
    watch: IB_METHOD_WATCH,
    ref: IB_METHOD_REF,
  },
  CS: {
    get: CS_METHOD_GET,
    call: CS_METHOD_CALL,
    watch: CS_METHOD_WATCH,
    ref: CS_METHOD_REF,
  },
  GP: {
    get: GP_METHOD_GET,
    call: GP_METHOD_CALL,
    watch: GP_METHOD_WATCH,
    ref: GP_METHOD_REF,
  },
  BD: {
    get: BD_METHOD_GET,
    call: BD_METHOD_CALL,
    watch: BD_METHOD_WATCH,
    ref: BD_METHOD_REF,
  },
  BS: {
    get: BS_METHOD_GET,
    call: BS_METHOD_CALL,
    watch: BS_METHOD_WATCH,
    ref: BS_METHOD_REF,
  },
  BSE: {
    get: BSE_METHOD_GET,
    call: BSE_METHOD_CALL,
    watch: BSE_METHOD_WATCH,
    ref: BSE_METHOD_REF,
  },
  BC: {
    get: BC_METHOD_GET,
    call: BC_METHOD_CALL,
    watch: BC_METHOD_WATCH,
    ref: BC_METHOD_REF,
  },
  NO: {
    get: NO_METHOD_GET,
    call: NO_METHOD_CALL,
    watch: NO_METHOD_WATCH,
    ref: NO_METHOD_REF,
  },
  A: {
    get: A_METHOD_GET,
    call: A_METHOD_CALL,
    watch: A_METHOD_WATCH,
    ref: A_METHOD_REF,
  },
  PS: {
    get: PS_METHOD_GET,
    call: PS_METHOD_CALL,
    watch: PS_METHOD_WATCH,
    ref: PS_METHOD_REF,
  },
  CH: {
    get: CH_METHOD_GET,
    call: CH_METHOD_CALL,
    watch: CH_METHOD_WATCH,
    ref: CH_METHOD_REF,
  },
  F: {
    get: F_METHOD_GET,
    call: F_METHOD_CALL,
    watch: F_METHOD_WATCH,
    ref: F_METHOD_REF,
  },
  AC: {
    get: AC_METHOD_GET,
    call: AC_METHOD_CALL,
    watch: AC_METHOD_WATCH,
    ref: AC_METHOD_REF,
  },
  D: {
    get: D_METHOD_GET,
    call: D_METHOD_CALL,
    watch: D_METHOD_WATCH,
    ref: D_METHOD_REF,
  },
  CK: {
    get: CK_METHOD_GET,
    call: CK_METHOD_CALL,
    watch: CK_METHOD_WATCH,
    ref: CK_METHOD_REF,
  },
  AB: {
    get: AB_METHOD_GET,
    call: AB_METHOD_CALL,
    watch: AB_METHOD_REF,
    ref: AB_METHOD_WATCH,
  },
  TE: {
    get: TE_METHOD_GET,
    call: TE_METHOD_CALL,
    watch: TE_METHOD_WATCH,
    ref: TE_METHOD_REF,
  },
  TD: {
    get: TD_METHOD_GET,
    call: TD_METHOD_CALL,
    watch: TD_METHOD_WATCH,
    ref: TE_METHOD_REF,
  },
  W: {
    get: W_METHOD_GET,
    call: W_METHOD_CALL,
    watch: W_METHOD_WATCH,
    ref: W_METHOD_REF,
  },
}
