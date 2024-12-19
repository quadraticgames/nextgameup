# Next Game Up Backend

Backend server for the Next Game Up mobile app. This server provides a proxy API for BoardGameGeek's XML API.

## Features

- Proxy endpoint for BoardGameGeek XML API
- CORS enabled for cross-origin requests
- Error handling and timeout configuration

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

The server will run on port 3001 by default, or the port specified in the PORT environment variable.

## API Endpoints

- `GET /` - Health check endpoint
- `GET /api/boardgame/:id` - Get board game details by BGG ID

## Environment Variables

- `PORT` - Port number (default: 3001)
