# Slack Nango Demo

Demo project showing a Slack integration powered by Nango. The repo includes:
- `client/`: Vite + React frontend that uses the demo API
- `server/`: Node/Express API that talks to Nango + Slack
- `nango-integrations/`: Nango integration definitions and compiled artifacts

## Prerequisites

- Node.js 18+
- npm
- A Nango account with a Slack integration configured

## Quick Start

### 1) Server

```bash
cd server
npm install
```

Create `server/.env`:

```bash
NANGO_SECRET_KEY=your-secret-key-here
NANGO_HOST=https://api.nango.dev
```

Run the server:

```bash
npm start
```

The API runs on `http://localhost:3001`.

### 2) Client

```bash
cd client
npm install
npm run dev
```

The client runs on `http://localhost:5173` and expects the server on `http://localhost:3001`.

## Project Structure

```
.
├── client/                   # React client (Vite)
├── server/                   # Express API for Nango + Slack
├── nango-integrations/
│   ├── index.ts              # Nango entrypoint
│   ├── package.json          # Integration workspace deps/scripts
│   └── slack-demo/           # Integration ID (matches Nango config)
│       └── actions/           # Action definitions exposed by Nango
│           └── send-slack-message.ts # Action: send a Slack message
│       └── syncs/             # Data sync definitions for Nango
│           └── slack-users.ts # Sync: fetch Slack users
```

## Additional Docs

- `client/README.md` for frontend scripts and details
- `server/README.md` for API endpoints and configuration

## Notes

- The server stores connection mappings in memory for demo purposes.
- For production, add durable storage, auth, validation, and rate limiting.
