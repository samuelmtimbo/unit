declare global {
  interface Document {
    exitPictureInPicture: () => Promise<void>
    pictureInPictureElement: any
  }

  // TODO
  interface SpeechGrammarList {}

  // TODO
  interface SpeechRecognition {
    start()
    stop()
  }

  interface PictureInPictureWindow {
    // width: number
    // height: number
    // onresize(): void
  }
}

export default {}
