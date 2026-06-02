#!/usr/bin/env node

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 9000;
const HTML_FILE = path.join(__dirname, 'ws-test-client.html');

const server = http.createServer((req, res) => {
  if (req.url === '/' || req.url === '/index.html') {
    try {
      const htmlContent = fs.readFileSync(HTML_FILE, 'utf-8');
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(htmlContent);
    } catch (error) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('WebSocket test client not found');
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(PORT, () => {
  console.log('\n');
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║          🏆 Sportz WebSocket Test Client                   ║');
  console.log('╠════════════════════════════════════════════════════════════╣');
  console.log(`║  🌐 Open in browser: http://localhost:${PORT}                      ║`);
  console.log('║                                                            ║');
  console.log('║  📝 Steps to test:                                         ║');
  console.log('║    1. Click "Connect" to establish WebSocket connection   ║');
  console.log('║    2. Enter a Match ID and click "Subscribe"              ║');
  console.log('║    3. In another terminal, create a match via API         ║');
  console.log('║    4. Add commentary to the match                         ║');
  console.log('║    5. Watch real-time messages in the log                 ║');
  console.log('║                                                            ║');
  console.log('║  📡 API Examples (in another terminal):                    ║');
  console.log('║                                                            ║');
  console.log('║  Create Match:                                             ║');
  console.log('║  curl -X POST http://localhost:8000/matches \\             ║');
  console.log('║    -H "Content-Type: application/json" \\                  ║');
  console.log('║    -d \'{                                                  ║');
  console.log('║      "sport":"football",                                  ║');
  console.log('║      "homeTeam":"Team A",                                 ║');
  console.log('║      "awayTeam":"Team B",                                 ║');
  console.log('║      "startTime":"2026-06-02T14:00:00Z",                  ║');
  console.log('║      "endTime":"2026-06-02T15:30:00Z"                     ║');
  console.log('║    }\'                                                      ║');
  console.log('║                                                            ║');
  console.log('║  Add Commentary:                                           ║');
  console.log('║  curl -X POST http://localhost:8000/matches/1/commentary \\║');
  console.log('║    -H "Content-Type: application/json" \\                  ║');
  console.log('║    -d \'{                                                  ║');
  console.log('║      "minute":45,                                         ║');
  console.log('║      "sequence":1,                                        ║');
  console.log('║      "period":"first_half",                               ║');
  console.log('║      "eventType":"goal",                                  ║');
  console.log('║      "actor":"Player Name",                               ║');
  console.log('║      "team":"Team A",                                     ║');
  console.log('║      "message":"Goal! Team A scores"                      ║');
  console.log('║    }\'                                                      ║');
  console.log('║                                                            ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log('\n');
});

process.on('SIGINT', () => {
  console.log('\n\n✋ Test client stopped');
  process.exit(0);
});
