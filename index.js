const WebSocket = require('ws')

class WebpackCompilerDonePlugin {

  constructor(options = {}) {
    this.options = options
  }

  apply(compiler) {
    const devServerPort = compiler.options.devServer.port
    // const port = this.options.port || (devServerPort ? `1${devServerPort}` : devServerPort)
    const port = this.options.port
    if (!port) return
    
    let socket
    compiler.hooks.done.tap('WebpackCompilerDonePlugin', (compilation) => {
      if (!socket) {
        socket = new WebSocket.Server({
          port,
          path: '/hotws'
        })
      }

      if (!socket.clients) return
      socket.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({
            type: 'ok'
          }));
        }
      });
    })
  }
}

module.exports = WebpackCompilerDonePlugin


