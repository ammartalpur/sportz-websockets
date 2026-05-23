import arcjet from '@arcjet/node';
import { WebSocket, WebSocketServer } from 'ws';
import { wsArcJet } from '../arcjet.js';

function sendJson(socket, payload) {
  if (socket.readyState !== WebSocket.OPEN) return;

  socket.send(JSON.stringify(payload))
}

function broadcast(wss, payload) {
  for (const clients of wss.clients) {
  
    if (clients.readyState !== WebSocket.OPEN) continue;
    clients.send(JSON.stringify(payload));

  }
}

export function attachWebSocketServer(server) {
  const wss = new WebSocketServer({ server, path: "/ws", maxPayload: 1024 * 1024 })
  wss.on('connection', async (socket, req) => {
    if (wsArcJet) {
      try {
        const decision = await wsArcJet.protect(req);
        if (decision && decision.isDenied && decision.isDenied()) {
          const isRate = decision.reason && typeof decision.reason.isRateLimit === 'function' && decision.reason.isRateLimit();
          const code = isRate ? 1013 : 1008;
          const reason = isRate ? 'Rate Limit exceeded' : 'Access Denied';
          socket.close(Number(code) || 1013, reason);
          return;
        }
      } catch (error) {
        console.error('WS Connection Error', error);
        socket.close(1011, 'Server Security Error');
        return;
      }
    }

    socket.isAlive = true;
    socket.on('pong', () => { socket.isAlive = true; })
    sendJson(socket, { type: 'welcome' });

    socket.on('error' , console.error)
  })

  const interval = setInterval(() => {
    wss.clients.forEach((ws) => { 
      if (ws.isAlive === false) return ws.terminate();
      ws.isAlive = false;
      ws.ping();
     })
  }, 30000)

  wss.on("close" , ()=>clearInterval(interval))

  function broadcastMatchCreated(match) {
    broadcast(wss , {type: 'match_created' , data: match})
  }

  return {broadcastMatchCreated}
}