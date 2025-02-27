/**
 * An utility class operating a fast buffering management.
 * @class DownloadService
 */
export class DownloadService {
  constructor(chunkSize, fileSize, logger) {
    this.chunkSize = chunkSize
    this.bufferSize = fileSize
    this.syslog = logger

    // this.syslog.debug('[DownloadService] <')
    this.filecontent = Buffer.allocUnsafe(this.bufferSize)
    // this.syslog.debug('[DownloadService] allocUnsafe ok')
    this.startts = new Date().valueOf()
    this.updateTime = 500
    this.realcontentsize = 0
    // this.syslog.debug('[DownloadService] startts=' + this.startts)
  }
  read(req, update = null) {
    // this.syslog.debug('[DownloadService.read] <')
    let chunk
    while (null !== (chunk = req.read())) {
      const nsize = this.realcontentsize + chunk.length
      // this.syslog.debug('[DownloadService.read] nsize=' + nsize)
      if (nsize > this.bufferSize) {
        if (this.bufferSize > 2 * this.chunkSize) this.chunkSize *= 2
        this.bufferSize += this.chunkSize + chunk.length
        const newfilecontent = Buffer.allocUnsafe(this.bufferSize)
        this.filecontent.copy(newfilecontent)
        this.filecontent = newfilecontent
      }
      chunk.copy(this.filecontent, this.realcontentsize)
      this.realcontentsize += chunk.length
      if (update) {
        const currentts = new Date().valueOf()
        if (currentts - this.startts > this.updateTime) {
          update(this.realcontentsize)
          this.startts = new Date().valueOf()
        }
      }
    }
    // this.syslog.debug('[DownloadService.read] >')
  }
  finish() {
    // this.syslog.debug('[DownloadService.finish] <')
    this.buffer_length = this.filecontent.length
    this.data = this.filecontent.subarray(0, this.realcontentsize)
    this.filecontent = null
    return this.data
  }
}
