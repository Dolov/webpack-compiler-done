const WebSocket = require('ws')

let socket
const wSender = port => {
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
}

module.exports = {
    wSender
}