
const WebSocket = require('ws')

const getWSender = port => {
  const socket = new WebSocket.Server({
    port,
    path: '/hotws'
  })

  return new Promise(reslove => {
    socket.on('connection', ws => {
      reslove(ws)
    })
  })
}

class WebpackCompilerDonePlugin {

  constructor(options = {}) {
    this.options = options
  }

  apply(compiler) {
    const devServerPort = compiler.options.devServer.port
    // const port = this.options.port || (devServerPort ? `1${devServerPort}` : devServerPort)
    const port = this.options.port
    if (!port) return
    let wSender
    getWSender(port).then(ws => {
      wSender = ws
    }).catch(err => {
      console.log('err: ', err);
    })

    compiler.hooks.done.tap('WebpackCompilerDonePlugin', (compilation) => {
      if (wSender?.send) {
        wSender.send(JSON.stringify({
          type: "ok"
        }))
      }
    })
  }
}

module.exports = WebpackCompilerDonePlugin