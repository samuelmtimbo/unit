import { ChildProcess, fork } from 'child_process'
import { PATH_SRC_SYSTEM } from '../path'

// run a single unit inside a child process

export default class Runner {
  private _childProcess: ChildProcess | null
  private _onMessage: (message: any) => void
  private _onError: (error: Error) => void

  constructor(
    onMessage: (message: any) => void,
    onError: (error: Error) => void
  ) {
    this._onMessage = onMessage
    this._onError = onError
  }

  public kill(): void {
    if (this._childProcess !== null) {
      this._childProcess.kill()
      this._childProcess = null
    }
  }

  public start(): void {
    const system = PATH_SRC_SYSTEM
    this._childProcess = fork(`${system}/debug/container.js`, [], {
      env: {
        NODE_ENV: 'development',
      },
      execArgv: [],
      silent: false,
    })
    this._childProcess.on('message', this._handleMessage)
    this._childProcess.on('error', this._handleError)
  }

  public restart(): void {
    if (this._childProcess) {
      this.kill()
    }
    this.start()
  }

  public alive(): boolean {
    return !!this._childProcess
  }

  public dead(): boolean {
    return !this.alive()
  }

  public sendAction(action: { type: string; data: any }): void {
    if (!this._childProcess) {
      throw new Error('cannot send action to dead container')
    }

    this._send(action)
  }

  private _send(message: any): void {
    this._childProcess.send(message, this._handleError.bind(this))
  }

  private _handleError = (err: Error | null) => {
    if (err) {
      this.kill()
      this._onError(err)
    }
  }

  private _handleMessage = (message: any) => {
    this._onMessage(message)
  }
}
