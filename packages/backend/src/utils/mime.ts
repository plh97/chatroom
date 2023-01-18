export enum MINE {
  css = "text/css",
  less = "text/css",
  gif = "image/gif",
  html = "text/html",
  ico = "image/x-icon",
  jpeg = "image/jpeg",
  jpg = "image/jpeg",
  js = "text/javascript",
  json = "application/json",
  pdf = "application/pdf",
  png = "image/png",
  svg = "image/svg+xml",
  swf = "application/x-shockwave-flash",
  tif = "image/tiff",
  txt = "text/plain",
  wav = "audio/x-wav",
  wma = "audio/x-ms-wma",
  wmv = "video/x-ms-wmv",
  xml = "text/xml",
}

export default class Mime {
  mimes: typeof MINE;
  constructor() {
    this.mimes = MINE;
  }
  getType(type: MINE) {
    const vals = Object.values(this.mimes);
    return vals.includes(type);
  }
}
