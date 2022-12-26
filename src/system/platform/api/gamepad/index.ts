import { $, $Events } from '../../../../Class/$'
import { Done } from '../../../../Class/Functional/Done'
import { Semifunctional } from '../../../../Class/Semifunctional'
import { System } from '../../../../system'
import { EE } from '../../../../types/interface/EE'
import { V } from '../../../../types/interface/V'
import { Unlisten } from '../../../../types/Unlisten'
import { callAll } from '../../../../util/call/callAll'
import { ID_GAMEPAD } from '../../../_ids'

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

export type Gamepad_J = {
  buttons: boolean[]
  axes: number[]
}

export type GamepadEvents = $Events<GamePad_EE> & GamePad_EE

const N_BUTTONS = 16
const N_AXIS = 4

const DEFAULT_TRESHOLD = 0.2

export default class _Gamepad extends Semifunctional<I, O> {
  private _gamepad: Gamepad

  private _connected: boolean

  private _unlisten: Unlisten

  constructor(system: System) {
    super(
      {
        fi: ['i'],
        fo: [],
        i: ['done'],
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
      this._gamepad = getGamepad(i)
    } catch (err) {
      done(undefined, err.message)

      return
    }

    const onConnect = (event: GamepadEvent) => {
      const { gamepad } = event

      const { index } = gamepad

      if (index === i) {
        this._gamepad = gamepad

        pushPad()
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
      addEventListener('gamepadisconnected', onDisconnect),
      () => {
        if (this._gamepad) {
          pullPad()
        }
      },
    ])

    const pushPad = () => {
      const pad = new (class Pad
        extends $<GamepadEvents>
        implements V<Gamepad_J>, EE<GamePad_EE>
      {
        private _state: Gamepad_J = {
          buttons: new Array(N_BUTTONS).fill(false, 0, N_BUTTONS),
          axes: new Array(N_AXIS).fill(0, 0, N_AXIS),
        }
        private _frame: number | null = null

        constructor(__system) {
          super(__system)
        }

        async read(): Promise<Gamepad_J> {
          console.log(this._state)
          return this._state
        }

        async write(data: Gamepad_J): Promise<void> {
          throw new Error('cannot write to gamepad state')
        }

        private _event_capture_tick = (): void => {
          const {
            api: {
              input: {
                gamepad: { getGamepad },
              },
              animation: { requestAnimationFrame },
            },
          } = this.__system

          const prevButtonsPressed = [...this._state.buttons]
          const gamepad = getGamepad(i)

          const buttonsPressed = gamepad.buttons.map((b) => b.pressed)
          this._state.buttons = buttonsPressed

          for (let i = 0; i < N_BUTTONS; i++) {
            if (buttonsPressed[i] && !prevButtonsPressed[i]) {
              this.emit('buttondown', i)
            } else if (!buttonsPressed[i] && prevButtonsPressed[i]) {
              this.emit('buttonup', i)
            }
          }

          const prevAxes = this._state.axes
          const axes = gamepad.axes.map((a) => a)
          this._state.axes = axes

          for (let i = 0; i < N_AXIS; i++) {
            if (Math.abs(axes[i] - prevAxes[i]) >= DEFAULT_TRESHOLD) {
              this.emit('axischange', [i, axes[i]])
            }
          }

          this._frame = requestAnimationFrame(this._event_capture_tick)
        }

        private _start_event_capture = (): void => {
          // console.log('_Gamepad', '_start_event_capture')
          this._event_capture_tick()
        }

        private _stop_event_capture = (): void => {
          // console.log('_Gamepad', '_stop_event_capture')
          const {
            api: {
              animation: { cancelAnimationFrame },
            },
          } = this.__system

          if (this._frame !== undefined) {
            cancelAnimationFrame(this._frame)

            this._frame = undefined
          }
        }

        private _listenerCount: number = 0

        addListener(event, listener) {
          const unlisten = super.addListener(event, listener)

          this._listenerCount++

          if (this._listenerCount === 1) {
            this._start_event_capture()
          }

          return () => {
            this._listenerCount--

            if (this._listenerCount === 0) {
              this._stop_event_capture()
            }

            unlisten()
          }
        }
      })(this.__system)

      this._output.state.push(pad)
    }

    const pullPad = () => {
      this._output.state.pull()
    }

    if (this._gamepad) {
      pushPad()
    }
  }

  d() {
    this._unlisten()
    this._unlisten = undefined
  }

  onIterDataInputData(name: keyof I) {
    // if (name === 'done') {
    this._output.state.pull()
    this._done()
    this._input.done.pull()
    // }
  }
}
