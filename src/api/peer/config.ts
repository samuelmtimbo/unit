const IOUN_STUN_SERVER: string[] = ['stun:ice.ioun.net']

export const DEFAULT_STUN_SERVER: string[] = [...IOUN_STUN_SERVER]

export const DEFAULT_STUN_RTC_CONFIG: RTCConfiguration = {
  iceServers: [
    {
      urls: DEFAULT_STUN_SERVER,
    },
  ],
}
