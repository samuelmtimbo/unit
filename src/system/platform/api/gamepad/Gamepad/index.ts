import { $, $Events } from '../../../../../Class/$'
import { Done } from '../../../../../Class/Functional/Done'
import { Holder } from '../../../../../Class/Holder'
import { Gamepad_, Gamepad_J } from '../../../../../client/event/gamepad'
import { System } from '../../../../../system'
import { EE } from '../../../../../types/interface/EE'
import { V } from '../../../../../types/interface/V'
import { Unlisten } from '../../../../../types/Unlisten'
import { callAll } from '../../../../../util/call/callAll'
import { ID_GAMEPAD } from '../../../../_ids'

export interface I {
  i: number
  done: any
}

export interface O {
  state: V<Gamepad_J> & EE<GamePad_EE>
}

export type GamePad_EE = {
  buttondown: [number]
  buttonup: [number]
  axischange: [[number, number]]
}

export type GamepadEvents = $Events<GamePad_EE> & GamePad_EE

export default class _Gamepad extends Holder<I, O> {
  private _gamepad: Gamepad_

  private _connected: boolean

  private _unlisten: Unlisten

  constructor(system: System) {
    super(
      {
        fi: ['i'],
        fo: [],
        o: ['state'],
      },
      {
        output: {
          state: {
            ref: true,
          },
        },
      },
      system,
      ID_GAMEPAD
    )
  }

  async f({ i }, done: Done<O>): Promise<void> {
    const {
      api: {
        input: {
          gamepad: { getGamepad, addEventListener },
        },
      },
    } = this.__system

    try {
      const gamepad = getGamepad(i)

      this._gamepad = new Gamepad_(this.__system, gamepad)
    } catch (err) {
      done(undefined, err.message)

      return
    }

    const onConnect = (event: GamepadEvent) => {
      const { gamepad } = event

      const { index } = gamepad

      if (index === i) {
        this._gamepad = new Gamepad_(this.__system, gamepad)

        pushPad(this._gamepad)
      }
    }

    const onDisconnect = (event: GamepadEvent) => {
      const { gamepad } = event
      const { index } = gamepad

      if (index === i) {
        this._gamepad = null

        pullPad()
      }
    }

    this._unlisten = callAll([
      addEventListener('gamepadconnected', onConnect),
      addEventListener('gamepaddisconnected', onDisconnect),
      () => {
        if (this._gamepad) {
          pullPad()
        }
      },
    ])

    const pushPad = (gamepad_: Gamepad_) => {
      const pad = new (class Pad
        extends $<GamepadEvents>
        implements V<Gamepad_J>, EE<GamePad_EE>
      {
        async read(): Promise<Gamepad_J> {
          return gamepad_.state
        }

        async write(data: Gamepad_J): Promise<void> {
          throw new Error('cannot write to gamepad state')
        }
      })(this.__system)

      this._output.state.push(pad)
    }

    const pullPad = () => {
      this._output.state.pull()
    }

    if (this._gamepad) {
      pushPad(this._gamepad)
    }
  }

  d() {
    if (this._unlisten) {
      this._unlisten()

      this._unlisten = undefined
    }
  }
}
