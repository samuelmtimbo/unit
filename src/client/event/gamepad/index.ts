import { EventEmitter_ } from '../../../EventEmitter'
import { System } from '../../../system'

export type Gamepad_J = {
  buttons: boolean[]
  axes: number[]
}

export const GAMEPAD_BUTTON_COUNT = 16
export const GAMEPAD_AXIS_COUNT = 4
export const GAMEPAD_DEFAULT_TRESHOLD = 0.001

export class Gamepad_ extends EventEmitter_ {
  public system: System
  public gamepad: Gamepad

  constructor(system: System, gamepad: Gamepad) {
    super()

    this.system = system
    this.gamepad = gamepad
  }

  public state: Gamepad_J = {
    buttons: new Array(GAMEPAD_BUTTON_COUNT).fill(
      false,
      0,
      GAMEPAD_BUTTON_COUNT
    ),
    axes: new Array(GAMEPAD_AXIS_COUNT).fill(0, 0, GAMEPAD_AXIS_COUNT),
  }

  private _frame: number | null = null

  async read(): Promise<Gamepad_J> {
    return this.state
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
    } = this.system

    this.gamepad = getGamepad(this.gamepad.index)

    const prevButtonsPressed = [...this.state.buttons]

    const buttonsPressed = this.gamepad.buttons.map((b) => b.pressed)

    this.state.buttons = buttonsPressed

    for (let i = 0; i < GAMEPAD_BUTTON_COUNT; i++) {
      if (buttonsPressed[i] && !prevButtonsPressed[i]) {
        this.emit('buttondown', i)
      } else if (!buttonsPressed[i] && prevButtonsPressed[i]) {
        this.emit('buttonup', i)
      }
    }

    const prevAxes = this.state.axes
    const axes = this.gamepad.axes.map((a) => a)
    this.state.axes = axes

    for (let i = 0; i < GAMEPAD_AXIS_COUNT; i++) {
      if (Math.abs(axes[i] - prevAxes[i]) >= GAMEPAD_DEFAULT_TRESHOLD) {
        this.emit('axischange', [i, axes[i]])
      }
    }

    this._frame = requestAnimationFrame(this._event_capture_tick)
  }

  private _start_event_capture = (): void => {
    // console.log('Gamepad_', '_start_event_capture')

    this._event_capture_tick()
  }

  private _stop_event_capture = (): void => {
    // console.log('Gamepad_', '_stop_event_capture')

    const {
      api: {
        animation: { cancelAnimationFrame },
      },
    } = this.system

    if (this._frame !== undefined) {
      cancelAnimationFrame(this._frame)

      this._frame = undefined
    }
  }

  private _listenerCount: number = 0

  addListener(event, listener) {
    // console.log('Gamepad_', 'addListener', event)

    const unlisten = super.addListener(event, listener)

    this._listenerCount++

    if (this._listenerCount >= 1) {
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

  disconnect() {
    this._stop_event_capture()
  }
}
