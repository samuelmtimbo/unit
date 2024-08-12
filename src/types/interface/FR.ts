export interface FR {
  readAsDataUrl(file: File | Blob): Promise<string>
  readAsArrayBuffer(file: File | Blob): Promise<ArrayBuffer>
  readAsText(file: File | Blob): Promise<string>
}
