import { AllTypes } from '../interface'
import { AllKeys } from '../types/AllKeys'
import {
  A_METHOD_CALL,
  A_METHOD_REF,
  A_METHOD_WATCH,
} from '../types/interface/async/$A'
import {
  AB_METHOD_CALL,
  AB_METHOD_REF,
  AB_METHOD_WATCH,
} from '../types/interface/async/$AB'
import {
  AC_METHOD_CALL,
  AC_METHOD_REF,
  AC_METHOD_WATCH,
} from '../types/interface/async/$AC'
import {
  B_METHOD_CALL,
  B_METHOD_REF,
  B_METHOD_WATCH,
} from '../types/interface/async/$B'
import {
  BC_METHOD_CALL,
  BC_METHOD_REF,
  BC_METHOD_WATCH,
} from '../types/interface/async/$BC'
import {
  BD_METHOD_CALL,
  BD_METHOD_REF,
  BD_METHOD_WATCH,
} from '../types/interface/async/$BD'
import {
  BS_METHOD_CALL,
  BS_METHOD_REF,
  BS_METHOD_WATCH,
} from '../types/interface/async/$BS'
import {
  BSE_METHOD_CALL,
  BSE_METHOD_REF,
  BSE_METHOD_WATCH,
} from '../types/interface/async/$BSE'
import {
  C_METHOD_CALL,
  C_METHOD_REF,
  C_METHOD_WATCH,
} from '../types/interface/async/$C'
import {
  CA_METHOD_CALL,
  CA_METHOD_REF,
  CA_METHOD_WATCH,
} from '../types/interface/async/$CA'
import {
  CH_METHOD_CALL,
  CH_METHOD_REF,
  CH_METHOD_WATCH,
} from '../types/interface/async/$CH'
import {
  CK_METHOD_CALL,
  CK_METHOD_REF,
  CK_METHOD_WATCH,
} from '../types/interface/async/$CK'
import {
  CS_METHOD_CALL,
  CS_METHOD_REF,
  CS_METHOD_WATCH,
} from '../types/interface/async/$CS'
import {
  D_METHOD_CALL,
  D_METHOD_REF,
  D_METHOD_WATCH,
} from '../types/interface/async/$D'
import {
  EE_METHOD_CALL,
  EE_METHOD_REF,
  EE_METHOD_WATCH,
} from '../types/interface/async/$EE'
import {
  F_METHOD_CALL,
  F_METHOD_REF,
  F_METHOD_WATCH,
} from '../types/interface/async/$F'
import {
  G_METHOD_CALL,
  G_METHOD_REF,
  G_METHOD_WATCH,
} from '../types/interface/async/$G'
import {
  GP_METHOD_CALL,
  GP_METHOD_REF,
  GP_METHOD_WATCH,
} from '../types/interface/async/$GP'
import {
  IB_METHOD_CALL,
  IB_METHOD_REF,
  IB_METHOD_WATCH,
} from '../types/interface/async/$IB'
import {
  J_METHOD_CALL,
  J_METHOD_REF,
  J_METHOD_WATCH,
} from '../types/interface/async/$J'
import {
  MS_METHOD_CALL,
  MS_METHOD_REF,
  MS_METHOD_WATCH,
} from '../types/interface/async/$MS'
import {
  NO_METHOD_CALL,
  NO_METHOD_REF,
  NO_METHOD_WATCH,
} from '../types/interface/async/$NO'
import {
  PS_METHOD_CALL,
  PS_METHOD_REF,
  PS_METHOD_WATCH,
} from '../types/interface/async/$PS'
import {
  S_METHOD_CALL,
  S_METHOD_REF,
  S_METHOD_WATCH,
} from '../types/interface/async/$S'
import { TD_METHOD_CALL, TD_METHOD_WATCH } from '../types/interface/async/$TD'
import {
  TE_METHOD_CALL,
  TE_METHOD_REF,
  TE_METHOD_WATCH,
} from '../types/interface/async/$TE'
import {
  U_METHOD_CALL,
  U_METHOD_REF,
  U_METHOD_WATCH,
} from '../types/interface/async/$U'
import {
  V_METHOD_CALL,
  V_METHOD_REF,
  V_METHOD_WATCH,
} from '../types/interface/async/$V'

export const METHOD: AllKeys<
  AllTypes<any>,
  Record<'call' | 'watch' | 'ref', string[]>
> = {
  EE: {
    call: EE_METHOD_CALL,
    watch: EE_METHOD_WATCH,
    ref: EE_METHOD_REF,
  },
  U: {
    call: U_METHOD_CALL,
    watch: U_METHOD_WATCH,
    ref: U_METHOD_REF,
  },
  G: {
    call: G_METHOD_CALL,
    watch: G_METHOD_WATCH,
    ref: G_METHOD_REF,
  },
  C: {
    call: C_METHOD_CALL,
    watch: C_METHOD_WATCH,
    ref: C_METHOD_REF,
  },
  V: {
    call: V_METHOD_CALL,
    watch: V_METHOD_WATCH,
    ref: V_METHOD_REF,
  },
  J: {
    call: J_METHOD_CALL,
    watch: J_METHOD_WATCH,
    ref: J_METHOD_REF,
  },
  MS: {
    call: MS_METHOD_CALL,
    watch: MS_METHOD_WATCH,
    ref: MS_METHOD_REF,
  },
  S: {
    call: S_METHOD_CALL,
    watch: S_METHOD_WATCH,
    ref: S_METHOD_REF,
  },
  CA: {
    call: CA_METHOD_CALL,
    watch: CA_METHOD_WATCH,
    ref: CA_METHOD_REF,
  },
  B: {
    call: B_METHOD_CALL,
    watch: B_METHOD_WATCH,
    ref: B_METHOD_REF,
  },
  IB: {
    call: IB_METHOD_CALL,
    watch: IB_METHOD_WATCH,
    ref: IB_METHOD_REF,
  },
  CS: {
    call: CS_METHOD_CALL,
    watch: CS_METHOD_WATCH,
    ref: CS_METHOD_REF,
  },
  GP: {
    call: GP_METHOD_CALL,
    watch: GP_METHOD_WATCH,
    ref: GP_METHOD_REF,
  },
  BD: {
    call: BD_METHOD_CALL,
    watch: BD_METHOD_WATCH,
    ref: BD_METHOD_REF,
  },
  BS: {
    call: BS_METHOD_CALL,
    watch: BS_METHOD_WATCH,
    ref: BS_METHOD_REF,
  },
  BSE: {
    call: BSE_METHOD_CALL,
    watch: BSE_METHOD_WATCH,
    ref: BSE_METHOD_REF,
  },
  BC: {
    call: BC_METHOD_CALL,
    watch: BC_METHOD_WATCH,
    ref: BC_METHOD_REF,
  },
  NO: {
    call: NO_METHOD_CALL,
    watch: NO_METHOD_WATCH,
    ref: NO_METHOD_REF,
  },
  A: {
    call: A_METHOD_CALL,
    watch: A_METHOD_WATCH,
    ref: A_METHOD_REF,
  },
  PS: {
    call: PS_METHOD_CALL,
    watch: PS_METHOD_WATCH,
    ref: PS_METHOD_REF,
  },
  CH: {
    call: CH_METHOD_CALL,
    watch: CH_METHOD_WATCH,
    ref: CH_METHOD_REF,
  },
  F: {
    call: F_METHOD_CALL,
    watch: F_METHOD_WATCH,
    ref: F_METHOD_REF,
  },
  AC: {
    call: AC_METHOD_CALL,
    watch: AC_METHOD_WATCH,
    ref: AC_METHOD_REF,
  },
  D: {
    call: D_METHOD_CALL,
    watch: D_METHOD_WATCH,
    ref: D_METHOD_REF,
  },
  CK: {
    call: CK_METHOD_CALL,
    watch: CK_METHOD_WATCH,
    ref: CK_METHOD_REF,
  },
  AB: {
    call: AB_METHOD_CALL,
    watch: AB_METHOD_REF,
    ref: AB_METHOD_WATCH,
  },
  TE: {
    call: TE_METHOD_CALL,
    watch: TE_METHOD_WATCH,
    ref: TE_METHOD_REF,
  },
  TD: {
    call: TD_METHOD_CALL,
    watch: TD_METHOD_WATCH,
    ref: TE_METHOD_REF,
  },
}
