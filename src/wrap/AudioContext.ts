import { $ } from '../Class/$'
import { MethodNotImplementedError } from '../exception/MethodNotImplementedError'
import { System } from '../system'
import { AC } from '../types/interface/AC'

export function wrapAudioContext(
  audioContext: AudioContext,
  system: System
): AC {
  const ctx = new (class Node extends $ implements AC {
    __: string[] = ['AC']

    audioContext(): AudioContext {
      return audioContext
    }

    getDestination(): AudioDestinationNode {
      return audioContext.destination
    }

    createOscillator(opt: OscillatorOptions): OscillatorNode {
      const {
        api: {
          window: { OscillatorNode },
        },
      } = system

      // @ts-ignore
      return new OscillatorNode(audioContext, opt)
    }

    createAnalyser(opt: AnalyserOptions): AnalyserNode {
      throw new MethodNotImplementedError()
    }

    disconnect(audioNode?: AudioNode): void {
      //
    }
  })(system)

  return ctx
}
