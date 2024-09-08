import { MethodNotImplementedError } from '../../../exception/MethodNotImplementedError'
import { Callback } from '../../Callback'
import { CA } from '../CA'
import { $CA, $CA_C, $CA_G, $CA_R, $CA_W } from './$CA'

export const AsyncCAGet = (canvas: CA): $CA_G => {
  return {
    $toBlob: function (
      data: { type: string; quality: number },
      callback: Callback<Blob>
    ): void {
      throw new MethodNotImplementedError()
    },
  }
}

export const AsyncCACall = (canvas: CA): $CA_C => {
  return {
    $draw: function (data: { step: any[] }): void {
      throw new MethodNotImplementedError()
    },
    $drawImage: function (data: {
      imageBitmap: ImageBitmap
      x: number
      y: number
      width: number
      height: number
    }): void {
      throw new MethodNotImplementedError()
    },
    $clear: function (data: {}): Promise<void> {
      throw new MethodNotImplementedError()
    },
    $strokePath: function (data: { d: string }): void {
      throw new MethodNotImplementedError()
    },
    $scale: function (data: { sx: number; sy: number }): void {
      throw new MethodNotImplementedError()
    },
    $fillPath: function (data: { d: string; fillRule: string }): void {
      throw new MethodNotImplementedError()
    },
  }
}

export const AsyncCAWatch = (canvas: CA): $CA_W => {
  return {}
}

export const AsyncCARef = (canvas: CA): $CA_R => {
  return {}
}

export const AsyncCA = (canvas: CA): $CA => {
  return {
    ...AsyncCAGet(canvas),
    ...AsyncCACall(canvas),
    ...AsyncCAWatch(canvas),
    ...AsyncCARef(canvas),
  }
}
