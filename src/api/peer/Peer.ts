import { $, $Events } from '../../Class/$'
import { APINotSupportedError } from '../../exception/APINotImplementedError'
import { Pod } from '../../pod'
import { System } from '../../system'

export async function waitAllCandidates(
  rtc: RTCPeerConnection
): Promise<RTCIceCandidate[]> {
  return new Promise((resolve, reject) => {
    const candidates = []
    const listener = async ({ candidate }) => {
      if (candidate) {
        candidates.push(candidate)
      } else {
        rtc.removeEventListener('icecandidate', listener)
        resolve(candidates)
      }
    }
    rtc.addEventListener('icecandidate', listener)
  })
}

export type Peer_EE = {
  connect: []
  error: [Error]
  close: []
  message: [any]
  start: [MediaStream]
  stop: []
}

export type PeerEvents = $Events<Peer_EE> & Peer_EE

export class Peer extends $<PeerEvents> {
  private _initiator: boolean

  private _config: RTCConfiguration

  private _rtc: RTCPeerConnection
  private _rtc_channel: RTCDataChannel

  private _outgoing_stream: MediaStream
  private _incoming_stream: MediaStream

  private _video_transceiver: RTCRtpTransceiver
  private _audio_transceiver: RTCRtpTransceiver

  constructor(
    system: System,
    pod: Pod,
    initiatior: boolean,
    config: RTCConfiguration
  ) {
    super(system, pod)

    this._initiator = initiatior

    this._config = config

    if (!RTCPeerConnection) {
      throw new APINotSupportedError('Web RTC')
    }

    const rtc = new RTCPeerConnection(this._config)

    this._setup(rtc)

    this._rtc = rtc

    const channel = this._rtc.createDataChannel('data', {
      negotiated: true,
      id: 0,
    })

    channel.onmessage = (event: MessageEvent) => {
      const { data } = event

      const _data = JSON.parse(data)

      const { type, data: __data } = _data

      switch (type) {
        case 'message':
          {
            this.emit('message', __data)
          }
          break
        case 'start':
          if (this._incoming_stream) {
            this.emit('start', this._incoming_stream)
          }
          break
        case 'stop':
          this.emit('stop')
          break
      }
    }

    channel.onopen = () => {
      this.emit('connect')

      if (this._stream) {
        const message = JSON.stringify({ type: 'start' })
        this._rtc_channel.send(message)
      }
    }

    if (this._initiator) {
      const stream = new MediaStream()
      this._outgoing_stream = stream

      const video_transceiver = this._rtc.addTransceiver('video', {
        streams: [stream],
      })
      this._video_transceiver = video_transceiver

      const audio_transceiver = this._rtc.addTransceiver('audio', {
        streams: [stream],
      })
      this._audio_transceiver = audio_transceiver
    }

    this._rtc_channel = channel
  }

  send(message: string): void {
    const _message = JSON.stringify({ type: 'message', data: message })
    this._rtc_channel.send(_message)
  }

  async offer(): Promise<string> {
    return this._offer(this._rtc)
  }

  async _offer(rtc: RTCPeerConnection): Promise<string> {
    const offer = await rtc.createOffer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true,
    })
    await rtc.setLocalDescription(offer)
    const { sdp } = offer
    const candidates = await waitAllCandidates(rtc)
    const signal = JSON.stringify({ sdp, candidates })
    return signal
  }

  private _setup(rtc: RTCPeerConnection): void {
    // rtc.oniceconnectionstatechange = () => {
    //   console.log('iceConnectionState', rtc.iceConnectionState)
    // }

    // rtc.onicegatheringstatechange = async (event) => {
    //   const { iceGatheringState } = rtc
    //   console.log('onicegatheringstatechange', iceGatheringState)
    //   if (iceGatheringState === 'complete') {
    //   }
    // }

    // rtc.onicecandidate = async ({ candidate }) => {
    //   console.log('onicecandidate', candidate)
    // }

    rtc.onconnectionstatechange = () => {
      const { connectionState } = rtc
      console.log('onconnectionstatechange', connectionState)
      switch (connectionState) {
        case 'connected':
          // this.emit('connect')
          break
        case 'closed':
          this.emit('close')
          break
      }
    }

    // rtc.onnegotiationneeded = () => {
    //   console.log('onnegotiationneeded')
    // }

    // rtc.ondatachannel = (event: RTCDataChannelEvent) => {
    //   // console.log('ondatachannel', event)
    //   const { channel } = event
    // }

    if (!this._initiator) {
      rtc.ontrack = (event: RTCTrackEvent) => {
        console.log('ontrack', event)
        const { streams } = event
        const stream = streams[0]
        if (stream) {
          this._incoming_stream = stream
        }
      }
    }
  }

  private _plunk(rtc: RTCPeerConnection): void {
    rtc.oniceconnectionstatechange = null
    rtc.onconnectionstatechange = null
    rtc.onicegatheringstatechange = null
    rtc.onnegotiationneeded = null
    rtc.ondatachannel = null
    rtc.ontrack = null

    // rtc.close()
  }

  private _plunk_channel(rtc_channel: RTCDataChannel): void {
    rtc_channel.onmessage = null
  }

  async acceptOffer(signal: string): Promise<void> {
    return this._acceptOffer(this._rtc, signal)
  }

  async _acceptOffer(rtc: RTCPeerConnection, signal: string): Promise<void> {
    const { sdp, candidates } = JSON.parse(signal)
    const offer = new RTCSessionDescription({ type: 'offer', sdp })
    await rtc.setRemoteDescription(offer)
    for (const candidate of candidates) {
      await rtc.addIceCandidate(candidate)
    }
  }

  async answer(): Promise<string> {
    return this._answer(this._rtc)
  }

  async _answer(rtc: RTCPeerConnection): Promise<string> {
    const answer = await rtc.createAnswer({
      offerToReceiveAudio: true,
      offerToReceiveVideo: true,
    })
    rtc.setLocalDescription(answer)
    const { sdp } = answer
    const candidates = await waitAllCandidates(rtc)
    const signal = JSON.stringify({ sdp, candidates })
    return signal
  }

  async acceptAnswer(signal: string): Promise<void> {
    return this._acceptAnswer(this._rtc, signal)
  }

  async _acceptAnswer(rtc: RTCPeerConnection, signal: string): Promise<void> {
    const { sdp, candidates } = JSON.parse(signal)
    const answer = new RTCSessionDescription({ type: 'answer', sdp })
    await rtc.setRemoteDescription(answer)
    for (const candidate of candidates) {
      await rtc.addIceCandidate(candidate)
    }
    return
  }

  private _stream: MediaStream

  async addStream(stream: MediaStream): Promise<void> {
    this._stream = stream

    const audio_track = stream.getAudioTracks()[0]
    if (audio_track) {
      await this._audio_transceiver.sender.replaceTrack(audio_track)
      // this._audio_transceiver.sender.track.enabled = true
    }
    const video_track = stream.getVideoTracks()[0]
    if (video_track) {
      await this._video_transceiver.sender.replaceTrack(video_track)
      // this._video_transceiver.sender.track.enabled = true
    }

    if (this._rtc_channel.readyState === 'open') {
      const message = JSON.stringify({ type: 'start' })
      this._rtc_channel.send(message)
    }
  }

  async removeStream(): Promise<void> {
    this._stream = null

    // this._audio_transceiver.sender.track.enabled = false
    // this._video_transceiver.sender.track.enabled = false
    await Promise.all([
      this._video_transceiver.sender.replaceTrack(null),
      this._audio_transceiver.sender.replaceTrack(null),
    ])

    if (this._rtc_channel.readyState === 'open') {
      const message = JSON.stringify({ type: 'stop' })
      this._rtc_channel.send(message)
    }
  }
}
