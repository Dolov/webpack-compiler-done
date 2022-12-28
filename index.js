const { wSender } = require('./utils')
class WebpackCompilerDonePlugin {

  constructor(options = {}) {
    this.options = options
  }

  apply(compiler) {
    // const devServerPort = compiler.options.devServer.port
    // const port = this.options.port || (devServerPort ? `1${devServerPort}` : devServerPort)
    const port = this.options.port
    if (!port) return
    compiler.hooks.done.tap('WebpackCompilerDonePlugin', (compilation) => {
      wSender(port)
    })
  }
}

module.exports = WebpackCompilerDonePlugin


