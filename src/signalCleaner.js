/**
 * A Signal handler, close in a clean way, with a timeout
 *
 * @class
 * @param {object}  timeout - The closing sequence timeout.
 * @param {object}  service - The service to close.
 */
export class SignalCleaner {
  constructor(service, timeout) {
    this.service = service
    this.timeout = timeout
  }

  interruption(signal) {
    try {
      this.service.close(signal)
    } catch (err) {
      console.error('An error occured while closing the http service:', err)
      setTimeout(() => {
        console.error('Warning: timeout while closing, terminated on signal', signal)
        process.exit(0)
      }, 1000 * this.timeout)
    }
  }

  arm() {
    process.on('SIGINT', () => this.interruption('SIGINT'))
    process.on('SIGTERM', () => this.interruption('SIGTERM'))
  }
}
