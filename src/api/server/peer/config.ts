export const buildIOTurnConfig = (
  username: string,
  credential: string
): RTCConfiguration => ({
  iceTransportPolicy: 'relay',
  iceServers: [
    {
      urls: ['stun:ice.ioun.net'],
    },
    {
      urls: [
        'turn:ice.ioun.net?transport=udp',
        'turn:ice.ioun.net?transport=tcp',
      ],
      username,
      credential,
    },
  ],
})
