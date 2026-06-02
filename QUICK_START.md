# 🚀 Quick Start Guide - WebSocket Testing

Perfect for LinkedIn screenshots and demos!

## 📦 Installation

First, install dependencies:
```bash
npm install
```

## 🎯 Option 1: Interactive Testing Suite (Recommended)

The easiest way to test everything with guided prompts:

```bash
npm run test:suite
```

This will:
- ✅ Start the API server
- ✅ Start the test client server
- ✅ Provide an interactive menu for creating matches, adding commentary, and testing
- ✅ Show you exactly what curl commands to use

## 🎯 Option 2: Manual Testing (For More Control)

### Terminal 1: Start the API Server
```bash
npm start
```
Expected output:
```
Server is running on http://localhost:8000
WebSocket is running on ws://localhost:8000/ws
```

### Terminal 2: Start the Test Client
```bash
npm run test:ws
```
Expected output:
```
╔════════════════════════════════════════════════════════╗
║          🏆 Sportz WebSocket Test Client               ║
╠════════════════════════════════════════════════════════╣
║  🌐 Open in browser: http://localhost:9000             ║
```

### Terminal 3: Open Browser
```bash
# Windows
start http://localhost:9000

# Mac
open http://localhost:9000

# Linux
xdg-open http://localhost:9000
```

### Terminal 4: Create Test Data

Create a match:
```bash
curl -X POST http://localhost:8000/matches \
  -H "Content-Type: application/json" \
  -d '{
    "sport": "football",
    "homeTeam": "Manchester United",
    "awayTeam": "Liverpool",
    "startTime": "2026-06-02T14:00:00Z",
    "endTime": "2026-06-02T15:30:00Z",
    "homeScore": 2,
    "awayScore": 1
  }'
```

Add commentary:
```bash
curl -X POST http://localhost:8000/matches/1/commentary \
  -H "Content-Type: application/json" \
  -d '{
    "minute": 45,
    "sequence": 1,
    "period": "first_half",
    "eventType": "goal",
    "actor": "Bruno Fernandes",
    "team": "Manchester United",
    "message": "GOOOAL! Stunning strike from outside the box!",
    "tags": ["goal", "spectacular"]
  }'
```

## 📸 Perfect Screenshots For LinkedIn

Once you have everything running, here are the best screenshots to take:

### Screenshot 1: Connection Status
- Take a screenshot of the test client with **green connected status**
- Show the "Subscribed to match ID: 1" message
- **Caption**: "Building real-time sports APIs with WebSockets 🚀 Live event streaming in Node.js!"

### Screenshot 2: Event Flow
- Add multiple commentary items and let them scroll
- Capture several messages in the log
- **Caption**: "Real-time data pipelines ⚡ Watch how WebSockets deliver live sports updates to thousands of clients instantly!"

### Screenshot 3: Dual Terminal
- Show terminal with API curl command
- Show test client receiving the event
- **Caption**: "API-driven real-time architecture. REST meets WebSockets 🔗"

### Screenshot 4: Full Dashboard
- Show the entire test client interface with multiple events
- **Caption**: "Complete WebSocket testing dashboard for real-time applications. Built with Node.js, Express, PostgreSQL, and ws library #WebDevelopment"

## 🔥 Pro Tips

1. **Zoom for Better Screenshots**
   - Use browser zoom (Ctrl/Cmd + "+") to 150-200%
   - Makes text more readable in screenshots

2. **Multiple Events**
   - Add 5-10 commentary items before taking screenshots
   - Gives a sense of activity and real-time updates

3. **Clean Console**
   - Keep terminals minimized or hidden
   - Focus camera/screenshot on the test client UI

4. **Video Demo**
   - Record your screen while adding events
   - Show live real-time updates appearing instantly
   - Much more impressive than static screenshots!

## 📱 LinkedIn Post Examples

### Post 1: Real-time Architecture
```
🚀 Building real-time sports APIs with Node.js and WebSockets!

Just launched Sportz - a real-time sports commentary platform that 
delivers live match updates to thousands of concurrent clients.

Tech Stack:
✅ Express.js for REST API
✅ WebSockets for real-time push
✅ PostgreSQL for persistence
✅ Drizzle ORM for type-safe queries

Real-time isn't a feature, it's a requirement. #WebDevelopment #Node.js
```

### Post 2: Technical Deep Dive
```
⚡ Real-time data streaming at scale

How we built low-latency event delivery for live sports:
- Pub/Sub pattern with in-memory match subscriptions
- Efficient JSON serialization for message payloads
- Rate limiting with Arcjet for DDoS protection
- PostgreSQL for event audit trail

Want to learn more? Check out the repo! #Programming #WebSockets
```

### Post 3: Demo Focused
```
🔴 LIVE - WebSocket real-time updates in action!

Check out this live demo of our event streaming platform. 
When users subscribe to a match, they instantly receive:
- Match creation events
- Live commentary
- Score updates
- Player events

All with sub-100ms latency! #RealTimeData #LiveStreaming
```

## 🐛 Troubleshooting

### "Cannot connect to ws://localhost:8000/ws"
- Make sure the API server is running on Terminal 1
- Check if port 8000 is available: `netstat -an | grep 8000`

### "Test client won't load"
- Verify test client is running on Terminal 2
- Check if port 9000 is available
- Clear browser cache and refresh

### "No messages appearing"
- Verify WebSocket shows green "Connected" status
- Make sure you clicked "Subscribe" button
- Check if API requests are returning success (HTTP 201)

### "Port already in use"
- API port: `npm start --port 3000`
- Or kill process: `lsof -i :8000` then `kill -9 <PID>`

## 📚 Full Documentation

See:
- [README.md](./README.md) - Complete project documentation
- [WS_TESTING.md](./WS_TESTING.md) - Detailed testing guide
- [drizzle.config.js](./drizzle.config.js) - Database configuration

## ✨ Key Features to Highlight

- ✅ Real-time WebSocket subscriptions
- ✅ Multi-match support with targeted broadcasts
- ✅ Rich event metadata (JSON, tags, timestamps)
- ✅ Rate limiting and DDoS protection
- ✅ Type-safe database queries
- ✅ Professional error handling
- ✅ Clean, scalable architecture

---

**Ready to demo?** Run `npm run test:suite` and start creating matches! 🏆
