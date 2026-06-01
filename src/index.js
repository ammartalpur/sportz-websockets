import express from 'express';
import http from 'http'
import 'dotenv/config'
import { matchRouter } from './routes/matches.js';
import { attachWebSocketServer} from './ws/server.js'
import { securityMiddleware } from './arcjet.js';
import { commentaryRouter } from './routes/commentary.js';

const PORT = Number(process.env.port || 8000);
const HOST = process.env.host

const app = express();
const server = http.createServer(app)

app.use(express.json());

app.get('/', (req, res) => {
  res.send("Hello from Express server");
})

app.use(securityMiddleware())

app.use('/matches', matchRouter);
app.use("/matches/:id/commentary", commentaryRouter);


const {broadcastMatchCreated , broadcastCommentary} = attachWebSocketServer(server)
app.locals.broadcastMatchCreated = broadcastMatchCreated
app.locals.broadcastCommentary = broadcastCommentary;



server.listen(PORT, () => {
  const baseURL = HOST === "0.0.0.0" ? `http://localhost:${PORT}` : `http://${HOST}:${PORT}`;
  
  console.log(`Server is running on ${baseURL}`);
  console.log(`WebSocket is running on ${baseURL.replace("http" , "ws")}/ws`)
})