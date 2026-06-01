import arcjet from '@arcjet/node';
import { WebSocket, WebSocketServer } from 'ws';
import { wsArcJet } from '../arcjet.js';
import { type } from 'node:os';
import { set } from 'zod';

const matchSubscribers = new Map();

function subscribe(matchId, socket) { 
  if (!matchSubscribers.has(matchId)) { 
    matchSubscribers.set(matchId , new Set())
  }

  matchSubscribers.get(matchId).add(socket)
}

function unsubscribe(matchId, socket) {
  const subscribers = matchSubscribers.get(matchId) 
  if (!subscribers) return;

  subscribers.delete(socket);

  if (subscribers.size === 0) { 
    matchSubscribers.delete(matchId)
  }
}

function cleanupSubcriptions(socket) { 
  for (const matchId of socket.subscriptions) { 
    unsubscribe(matchId , socket)
  }
}

function broadcastToMatch(matchId, payload) {
  const subscribers = matchSubscribers.get(matchId)

  if (!subscribers || subscribers.size === 0) return;

  const message = JSON.stringify(payload);

  for (const client of subscribers) { 
    if (client.readyState === WebSocket.OPEN) { 
      client.send(message)
    }
  }
}

function sendJson(socket, payload) {
  if (socket.readyState !== WebSocket.OPEN) return;

  socket.send(JSON.stringify(payload))
}

function broadcastToALL(wss, payload) {
  for (const clients of wss.clients) {
  
    if (clients.readyState !== WebSocket.OPEN) continue;
    clients.send(JSON.stringify(payload));

  }
}

function handleMessage(socket, data) { 
  let message;
  try {
    message = JSON.parse(data.toString());
  } catch (error) {
    sendJson(socket, { type: 'error', message: "Invalid JSON"})
  }

  if (message?.type === "subscribe" && Number.isInteger(message.matchId)) { 
    subscribe(message.matchId, socket)
    socket.subscriptions.add(message.matchId)
    sendJson(socket, { type: 'subscribed', matchId: message.matchId });
    return;
  }

  if (message?.type == "unsubscribe" && Number.isInteger(message.matchId)) { 
    unsubscribe(message.matchId, socket);
    socket.subscriptions.delete(message.matchId);
    sendJson(socket, { type: 'unsubscribe', matchId: message.matchId }); 
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
    socket.subscriptions = new Set()
    sendJson(socket, { type: 'welcome' });
    
    socket.on('message', (data) => { 
      handleMessage(socket, data);
    })
    socket.on('error', () => { 
      socket.terminate()
    })
    socket.on("close", () => {
      cleanupSubcriptions(socket)
    });
    
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
    broadcastToALL(wss , {type: 'match_created' , data: match})
  }

  function broadcastCommentary(matchId, comment) { 
    broadcastToMatch(matchId, { type: 'commentary', data: comment})
  }

  return {broadcastMatchCreated , broadcastCommentary}
}