import { $ } from '../Class/$'
import { System } from '../system'
import { AAN } from '../types/interface/AAN'
import { AN } from '../types/interface/AN'

export function wrapAudioNode(audioNode: AudioNode, system: System): AN & $ {
  return new (class Node extends $ implements AN {
    __: string[] = ['AN']

    getContext(): AudioContext {
      return audioNode.context as AudioContext
    }

    connect(targetAudioNode: AudioNode): void {
      audioNode.connect(targetAudioNode)
    }

    disconnect(targetAudioNode?: AudioNode): void {
      audioNode.disconnect(targetAudioNode)
    }
  })(system)
}

export function wrapAudioNodeClass(audioNode: AudioNode, system: System): any {
  return class Node extends $ implements AN {
    __: string[] = ['AN']

    getContext(): AudioContext {
      return audioNode.context as AudioContext
    }

    connect(targetAudioNode: AudioNode): void {
      audioNode.connect(targetAudioNode)
    }

    disconnect(): void {
      audioNode.disconnect()
    }
  }
}

export function wrapAudioAnalyserNode(
  audioNode: AnalyserNode,
  system: System
): AN & AAN & $ {
  const AudioNodeClass = wrapAudioNodeClass(audioNode, system)

  // @ts-ignore
  return new (class Node extends AudioNodeClass implements AAN {
    __: string[] = ['AN']

    getFFTSize(): number {
      return audioNode.fftSize
    }

    getByteTimeDomainData(dataArray: Uint8Array): void {
      return audioNode.getByteTimeDomainData(dataArray)
    }

    getByteFrequencyData(dataArray: Uint8Array): void {
      return audioNode.getByteFrequencyData(dataArray)
    }
    // @ts-ignore
  })(system)
}
