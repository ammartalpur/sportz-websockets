# Sportz - Real-Time Sports Match Tracking API

A modern, real-time sports match tracking application built with Node.js, Express, WebSockets, and PostgreSQL. Sportz provides a robust API for managing sports matches and live commentary with real-time updates to connected clients.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [WebSocket Documentation](#websocket-documentation)
- [Database Schema](#database-schema)
- [Security](#security)
- [Scripts](#scripts)
- [Development](#development)

## ✨ Features

- **Match Management**: Create, list, and manage sports matches with real-time status tracking
- **Live Commentary**: Add detailed play-by-play commentary for matches with support for different event types
- **Real-Time Updates**: WebSocket server for instant push notifications to subscribed clients
- **Rate Limiting**: Built-in rate limiting and bot detection using Arcjet
- **Database Migrations**: Automated database schema management with Drizzle ORM
- **Input Validation**: Comprehensive input validation using Zod schemas
- **Multi-Sport Support**: Support for tracking any sport type

## 🛠 Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Web Framework**: Express.js 5.2.1
- **WebSocket**: ws 8.20.0
- **Database**: PostgreSQL with Drizzle ORM 0.45.1
- **ORM/Query Builder**: Drizzle ORM
- **Schema Validation**: Zod 4.3.6
- **Security**: Arcjet (rate limiting, bot detection, shield)
- **Database Migration**: Drizzle Kit 0.31.9
- **Environment Variables**: dotenv 17.3.1
- **Database Driver**: pg 8.20.0

## 📁 Project Structure

```
sportz/
├── src/
│   ├── index.js                 # Main server entry point
│   ├── arcjet.js                # Security configuration and middleware
│   ├── db/
│   │   ├── db.js                # Database connection instance
│   │   └── schema.js            # Drizzle ORM table schemas
│   ├── routes/
│   │   ├── matches.js           # Match management routes (GET, POST)
│   │   └── commentary.js        # Commentary routes (GET, POST)
│   ├── utils/
│   │   └── match-status.js      # Match status calculation utility
│   ├── validation/
│   │   ├── matches.js           # Zod validation schemas for matches
│   │   └── commentary.js        # Zod validation schemas for commentary
│   └── ws/
│       └── server.js            # WebSocket server implementation
├── drizzle/
│   ├── migrations/              # Auto-generated database migrations
│   ├── meta/                    # Migration metadata
│   └── snapshots/               # Database schema snapshots
├── drizzle.config.js            # Drizzle Kit configuration
├── package.json                 # Project dependencies and scripts
└── .env                         # Environment variables (not included)
```

## 📦 Prerequisites

- Node.js 18.0.0 or higher
- PostgreSQL 12.0 or higher
- npm or yarn package manager
- Arcjet API key (for security features)

## 🚀 Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ammartalpur/sportz-websockets.git
   cd sportz
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory with the following variables:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/sportz
   ARCJET_KEY=your_arcjet_key_here
   ARCJET_MODE=LIVE
   PORT=8000
   HOST=localhost
   ```

4. **Generate database migrations**:
   ```bash
   npm run db:generate
   ```

5. **Run database migrations**:
   ```bash
   npm run db:migrate
   ```

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/sportz` |
| `ARCJET_KEY` | Arcjet API key for security features | `ajk_xxxxx` |
| `ARCJET_MODE` | Arcjet operating mode | `LIVE` or `DRY_RUN` |
| `PORT` | Server port | `8000` |
| `HOST` | Server host | `localhost` or `0.0.0.0` |

### Database Configuration

The database configuration is defined in `drizzle.config.js`:
- **Dialect**: PostgreSQL
- **Schema Path**: `./src/db/schema.js`
- **Migrations Output**: `./drizzle`

### Security Configuration

Arcjet is configured with three rules:
- **Shield**: Protection against common web attacks
- **Bot Detection**: Allows search engine and preview bots
- **Rate Limiting**: 
  - HTTP: 50 requests per 10 seconds
  - WebSocket: 5 connections per 2 seconds

## 📖 Usage

### Starting the Server

**Development mode** (with auto-restart):
```bash
npm run dev
```

**Production mode**:
```bash
npm start
```

The server will start on `http://localhost:8000` with WebSocket available at `ws://localhost:8000/ws`.

## 🔌 API Documentation

### Base URL
```
http://localhost:8000
```

### Matches Endpoints

#### List Matches
```http
GET /matches
```

**Query Parameters**:
- `limit` (optional, default: 50, max: 100): Number of matches to return

**Response** (200 OK):
```json
{
  "data": [
    {
      "id": 1,
      "sport": "football",
      "homeTeam": "Team A",
      "awayTeam": "Team B",
      "status": "live",
      "startTime": "2026-06-02T14:00:00Z",
      "endTime": null,
      "homeScore": 2,
      "awayScore": 1,
      "createdAt": "2026-06-02T13:50:00Z"
    }
  ]
}
```

#### Create Match
```http
POST /matches
Content-Type: application/json
```

**Request Body**:
```json
{
  "sport": "football",
  "homeTeam": "Team A",
  "awayTeam": "Team B",
  "startTime": "2026-06-02T14:00:00Z",
  "endTime": "2026-06-02T15:30:00Z",
  "homeScore": 2,
  "awayScore": 1
}
```

**Response** (201 Created):
```json
{
  "data": {
    "id": 1,
    "sport": "football",
    "homeTeam": "Team A",
    "awayTeam": "Team B",
    "status": "finished",
    "startTime": "2026-06-02T14:00:00Z",
    "endTime": "2026-06-02T15:30:00Z",
    "homeScore": 2,
    "awayScore": 1,
    "createdAt": "2026-06-02T13:50:00Z"
  }
}
```

**Error Response** (400 Bad Request):
```json
{
  "error": "Invalid payload.",
  "details": "[validation error details]"
}
```

### Commentary Endpoints

#### List Match Commentary
```http
GET /matches/:id/commentary
```

**Path Parameters**:
- `id` (required): Match ID

**Query Parameters**:
- `limit` (optional, default: 100, max: 100): Number of commentary entries to return

**Response** (200 OK):
```json
{
  "data": [
    {
      "id": 1,
      "matchId": 1,
      "minute": 45,
      "sequence": 1,
      "period": "first_half",
      "eventType": "goal",
      "actor": "Player Name",
      "team": "Team A",
      "message": "Goal! Team A scores",
      "metadata": {
        "replays": 1,
        "penalty": false
      },
      "tags": ["goal", "spectacular"],
      "createdAt": "2026-06-02T14:45:00Z"
    }
  ]
}
```

#### Add Commentary
```http
POST /matches/:id/commentary
Content-Type: application/json
```

**Request Body**:
```json
{
  "minute": 45,
  "sequence": 1,
  "period": "first_half",
  "eventType": "goal",
  "actor": "Player Name",
  "team": "Team A",
  "message": "Goal! Team A scores",
  "metadata": {
    "replays": 1,
    "penalty": false
  },
  "tags": ["goal", "spectacular"]
}
```

**Response** (201 Created):
```json
{
  "data": {
    "id": 1,
    "matchId": 1,
    "minute": 45,
    "sequence": 1,
    "period": "first_half",
    "eventType": "goal",
    "actor": "Player Name",
    "team": "Team A",
    "message": "Goal! Team A scores",
    "metadata": {
      "replays": 1,
      "penalty": false
    },
    "tags": ["goal", "spectacular"],
    "createdAt": "2026-06-02T14:45:00Z"
  }
}
```

## 🌐 WebSocket Documentation

### Connection

Connect to the WebSocket server at: `ws://localhost:8000/ws`

Example using `wscat`:
```bash
npm run ws
```

### Message Types

#### Subscribe to Match
Subscribe to receive real-time updates for a specific match.

**Request**:
```json
{
  "type": "subscribe",
  "matchId": 1
}
```

**Response**:
```json
{
  "type": "subscribed",
  "matchId": 1
}
```

#### Unsubscribe from Match
Stop receiving updates for a specific match.

**Request**:
```json
{
  "type": "unsubscribe",
  "matchId": 1
}
```

**Response**:
```json
{
  "type": "unsubscribe",
  "matchId": 1
}
```

#### Broadcast Events

**Match Created Event** (broadcasted to all connected clients):
```json
{
  "type": "matchCreated",
  "data": {
    "id": 1,
    "sport": "football",
    "homeTeam": "Team A",
    "awayTeam": "Team B",
    "status": "live",
    "startTime": "2026-06-02T14:00:00Z",
    "homeScore": 0,
    "awayScore": 0,
    "createdAt": "2026-06-02T13:50:00Z"
  }
}
```

**Commentary Event** (broadcasted to subscribers of the match):
```json
{
  "type": "commentary",
  "data": {
    "matchId": 1,
    "id": 1,
    "minute": 45,
    "eventType": "goal",
    "actor": "Player Name",
    "message": "Goal! Team A scores",
    "createdAt": "2026-06-02T14:45:00Z"
  }
}
```

### Error Messages

```json
{
  "type": "error",
  "message": "Invalid JSON"
}
```

## 🗄️ Database Schema

### Matches Table

| Column | Type | Constraints | Default |
|--------|------|-------------|---------|
| `id` | SERIAL | PRIMARY KEY | - |
| `sport` | TEXT | NOT NULL | - |
| `homeTeam` | TEXT | NOT NULL | - |
| `awayTeam` | TEXT | NOT NULL | - |
| `status` | ENUM | NOT NULL | `'scheduled'` |
| `startTime` | TIMESTAMP | NOT NULL | - |
| `endTime` | TIMESTAMP | - | NULL |
| `homeScore` | INTEGER | NOT NULL | `0` |
| `awayScore` | INTEGER | NOT NULL | `0` |
| `createdAt` | TIMESTAMP | NOT NULL | `NOW()` |

**Status Enum Values**: `'scheduled'`, `'live'`, `'finished'`

### Commentary Table

| Column | Type | Constraints | Default |
|--------|------|-------------|---------|
| `id` | SERIAL | PRIMARY KEY | - |
| `matchId` | INTEGER | NOT NULL, FK | - |
| `minute` | INTEGER | NOT NULL | - |
| `sequence` | INTEGER | NOT NULL | - |
| `period` | TEXT | NOT NULL | - |
| `eventType` | TEXT | NOT NULL | - |
| `actor` | TEXT | - | NULL |
| `team` | TEXT | - | NULL |
| `message` | TEXT | NOT NULL | - |
| `metadata` | JSONB | - | `'{}'` |
| `tags` | TEXT[] | - | `'{}'` |
| `createdAt` | TIMESTAMP | NOT NULL | `NOW()` |

**Foreign Key**: `matchId` references `matches.id` with CASCADE delete

## 🔒 Security

The application implements multiple security layers using **Arcjet**:

1. **Shield**: Protects against common web attacks (SQL injection, XSS, CSRF, etc.)
2. **Bot Detection**: Filters out malicious bots while allowing search engines and preview services
3. **Rate Limiting**:
   - HTTP endpoints: 50 requests per 10 seconds
   - WebSocket connections: 5 connections per 2 seconds

### Security Configuration

The security middleware is applied globally to all HTTP requests. WebSocket connections are protected with separate rate limits adapted for persistent connections.

- **Mode**: Can be set to `LIVE` or `DRY_RUN` via `ARCJET_MODE` environment variable
- In `DRY_RUN` mode, security rules are evaluated but violations don't block requests
- In `LIVE` mode, violations result in HTTP 429 responses or WebSocket closure

## 📜 Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with auto-reload |
| `npm start` | Start production server |
| `npm run db:generate` | Generate database migrations from schema changes |
| `npm run db:migrate` | Run pending database migrations |
| `npm run ws` | Connect to WebSocket server using wscat |

## 🔧 Development

### Adding New Matches
```bash
curl -X POST http://localhost:8000/matches \
  -H "Content-Type: application/json" \
  -d '{
    "sport": "cricket",
    "homeTeam": "India",
    "awayTeam": "Australia",
    "startTime": "2026-06-02T14:00:00Z",
    "endTime": "2026-06-02T22:00:00Z"
  }'
```

### Adding Commentary
```bash
curl -X POST http://localhost:8000/matches/1/commentary \
  -H "Content-Type: application/json" \
  -d '{
    "minute": 15,
    "sequence": 1,
    "period": "first_inning",
    "eventType": "boundary",
    "actor": "Batter Name",
    "team": "India",
    "message": "Four runs!",
    "tags": ["boundary", "four"]
  }'
```

### Database Schema Changes
When you modify the schema in `src/db/schema.js`:

1. Generate migration:
   ```bash
   npm run db:generate
   ```

2. Review the generated migration in `drizzle/`

3. Apply migration:
   ```bash
   npm run db:migrate
   ```

## 📝 Notes

- All timestamps are in ISO 8601 format with timezone information
- Match status is automatically determined based on start and end times
- Commentary entries include sequence numbers for ordering events at the same minute
- WebSocket payloads are limited to 1MB
- The API uses proper HTTP status codes: 200 (OK), 201 (Created), 400 (Bad Request), 429 (Rate Limited), 500 (Server Error)

## 👤 Author

**Ammar Talpur**

## 📄 License

ISC

---

**Last Updated**: June 2, 2026
