# WebSocket Testing Guide

This guide explains how to test and screenshot the Sportz WebSocket functionality for LinkedIn posts.

## 🚀 Quick Start

### 1. Start the Main Server
```bash
npm start
```
This will start the Sportz API and WebSocket server on `http://localhost:8000`

### 2. Launch the WebSocket Test Client
Open a new terminal and run:
```bash
npm run test:ws
```
This starts a test client server on `http://localhost:9000`

### 3. Open in Browser
Navigate to: **http://localhost:9000**

You'll see a beautiful, professional testing interface perfect for screenshots!

## 📋 Testing Workflow

### Step 1: Connect to WebSocket
1. The default WebSocket URL is pre-filled: `ws://localhost:8000/ws`
2. Click the **"Connect"** button
3. You should see a success message: `✅ WebSocket Connected`
4. The status indicator will turn **green**

### Step 2: Subscribe to a Match
1. Enter a **Match ID** (e.g., `1`)
2. Click **"Subscribe"** button
3. You'll see the subscription message logged
4. The client is now ready to receive updates for that match

### Step 3: Trigger Events via API
Open another terminal and create a match:

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

**You'll see the real-time event appear immediately in the test client!**

### Step 4: Add Commentary
With the match created, add live commentary:

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
    "message": "GOOOAL! Stunning strike from the edge of the box!",
    "tags": ["goal", "spectacular"]
  }'
```

**The commentary appears instantly in the WebSocket test client!**

## 📸 Taking Screenshots for LinkedIn

### Best Screenshot Ideas

#### 1. **Connection Established**
- Show the green connected status
- Caption: "Building real-time sports updates with WebSockets 🚀"

#### 2. **Real-time Subscription**
- Show subscribed message
- Caption: "Clients can subscribe to match updates instantly"

#### 3. **Live Events Flow**
- Show multiple messages scrolling through
- Show match creation and commentary events
- Caption: "Real-time event streaming in action 🔴 LIVE"

#### 4. **Dual Terminal Setup**
- Screenshot of test client with events
- Screenshot of API call in terminal
- Caption: "API-driven real-time updates with WebSockets"

### Tips for Great Screenshots

1. **Zoom In**: Use browser zoom (Ctrl/Cmd + "+") to make text larger
2. **Clean Background**: Use the purple gradient - it looks professional
3. **Message Flow**: Let messages accumulate for a few seconds to show activity
4. **High Contrast**: The white panels on purple background photograph well
5. **Status Indicator**: The green connection dot is eye-catching

## 🎯 Complete Test Scenario (For Video Demo)

```bash
# Terminal 1: Start main server
npm start

# Terminal 2: Start test client server
npm run test:ws

# Browser: Open http://localhost:9000
# 1. Click Connect (wait for green status)
# 2. Enter Match ID: 1, Click Subscribe

# Terminal 3: Create a match
curl -X POST http://localhost:8000/matches \
  -H "Content-Type: application/json" \
  -d '{
    "sport": "cricket",
    "homeTeam": "India",
    "awayTeam": "Australia",
    "startTime": "2026-06-02T14:00:00Z",
    "endTime": "2026-06-02T22:00:00Z"
  }'

# Add several commentary entries (repeat with different data)
curl -X POST http://localhost:8000/matches/1/commentary \
  -H "Content-Type: application/json" \
  -d '{
    "minute": 5,
    "sequence": 1,
    "period": "innings_1",
    "eventType": "boundary",
    "actor": "Virat Kohli",
    "team": "India",
    "message": "Four runs! Beautiful shot!",
    "tags": ["boundary", "four"]
  }'

# Add more commentary with different events
curl -X POST http://localhost:8000/matches/1/commentary \
  -H "Content-Type: application/json" \
  -d '{
    "minute": 12,
    "sequence": 2,
    "period": "innings_1",
    "eventType": "six",
    "actor": "Virat Kohli",
    "team": "India",
    "message": "SIX! Over the boundary!",
    "tags": ["six", "boundary"]
  }'
```

## 🔄 Custom Messages

You can send custom JSON messages using the "Send Custom Message" section:

```json
{
  "type": "subscribe",
  "matchId": 1
}
```

Or test error handling:

```json
{
  "type": "subscribe",
  "matchId": "invalid"
}
```

## 📊 Features Highlighted in UI

- ✅ **Real-time Connection Status** - Green/Red indicator
- ✅ **Message Timestamps** - Precise timing of events
- ✅ **Color-Coded Logs** - Different colors for different message types
- ✅ **Message Counter** - Shows total messages received
- ✅ **Clean Responsive Design** - Professional appearance

## 🎨 Color Scheme

The test client uses this professional color scheme:
- **Purple Gradient**: `#667eea` to `#764ba2` (header and buttons)
- **Green Status**: `#4ade80` (connected)
- **Red Status**: `#ef4444` (disconnected)
- **Blue Info**: `#3b82f6` (received messages)
- **Orange Warning**: `#f59e0b` (disconnected alerts)

## 💡 LinkedIn Caption Ideas

> "Building real-time sports commentary with Node.js + WebSockets! ⚡🏆 Watch live events stream instantly to subscribers using Express.js, PostgreSQL, and the ws library. Real-time data pipelines in action! 🚀"

> "Real-time is not a nice-to-have, it's essential. 📡 Demonstrating WebSocket connections that push live sports updates instantly to thousands of clients. Scaling with confidence! 💪"

> "Live event streaming with confidence. 🔴 LIVE - See how WebSocket subscriptions enable real-time commentary delivery with millisecond latency. #RealTimeData #WebSockets #Node.js"

## 🐛 Troubleshooting

### WebSocket Connection Fails
- Make sure main server is running: `npm start`
- Check if port 8000 is in use
- Verify firewall settings

### Test Client Won't Load
- Make sure test server is running: `npm run test:ws`
- Check if port 9000 is in use
- Try refreshing the browser (Ctrl/Cmd + R)

### Messages Not Appearing
- Verify WebSocket is connected (green status)
- Verify subscription is successful
- Check API requests are hitting the right endpoint
- Review browser console for errors (F12)

## 📚 Additional Resources

See [README.md](./README.md) for complete API documentation and [DATABASE.md](./DATABASE.md) for schema details.
