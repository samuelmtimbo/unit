export const defaultTurnConfig = (
  username: string,
  credential: string
): RTCConfiguration => ({
  iceTransportPolicy: 'relay',
  iceServers: [
    {
      urls: [
        'stun.l.google.com:19302',
        'stun1.l.google.com:19302',
        'stun2.l.google.com:19302',
        'stun3.l.google.com:19302',
        'stun4.l.google.com:19302',
      ],
    },
  ],
})
