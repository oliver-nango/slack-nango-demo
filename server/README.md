# Slack Nango Demo - Server

A Node.js/Express backend server that demonstrates integration with Nango for managing Slack connections and actions.

## Overview

This server provides a RESTful API for:
- Creating secure session tokens for Nango Connect UI
- Handling webhooks from Nango for connection events
- Managing Slack connections (create, check status, delete, reconnect)
- Triggering Slack actions (e.g., sending messages)

## Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn
- A Nango account (sign up at https://app.nango.dev)
- Nango Slack integration configured

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in this directory with the following:

```bash
NANGO_SECRET_KEY=your-secret-key-here
NANGO_HOST=https://api.nango.dev
```

#### Getting Your Nango Secret Key

1. Go to https://app.nango.dev
2. Navigate to **Environments** in the sidebar
3. Copy your **Secret Key** (starts with `sk_`)
4. Paste it into your `.env` file

#### For Local Development

If you're running Nango locally with `nango dev`, use:

```bash
NANGO_HOST=http://localhost:3003
```

### 3. Run the Server

```bash
npm start
```

The server will start on **http://localhost:3001**

## API Endpoints

### Authentication & Connection Management

#### `POST /sessionToken`
Create a secure session token for Nango Connect UI.

**Request Body:**
```json
{
  "end_user": {
    "id": "user-123",
    "email": "user@example.com",
    "display_name": "John Doe",
    "tags": {}
  },
  "organization": {
    "id": "org-123",
    "display_name": "Acme Corp"
  },
  "allowed_integrations": ["slack-demo"]
}
```

**Response:**
```json
{
  "sessionToken": "token-here"
}
```

#### `POST /sessionToken/reconnect`
Re-authorize an existing connection.

**Request Body:**
```json
{
  "connection_id": "conn-123",
  "integration_id": "slack-demo"
}
```

**Response:**
```json
{
  "sessionToken": "token-here"
}
```

#### `GET /connection/:connectionId`
Check the status of a connection.

**Query Parameters:**
- `provider_config_key` (required): The integration ID (e.g., `slack-demo`)

**Example:**
```
GET /connection/conn-123?provider_config_key=slack-demo
```

#### `DELETE /connection`
Delete a connection.

**Request Body:**
```json
{
  "connection_id": "conn-123",
  "provider_config_key": "slack-demo"
}
```

#### `GET /connections/:userId`
Get all connections for a user (helper endpoint).

**Example:**
```
GET /connections/user-123
```

### Actions

#### `POST /action/trigger`
Trigger a Nango action synchronously (e.g., send Slack message).

**Request Body:**
```json
{
  "connectionId": "conn-123",
  "providerConfigKey": "slack-demo",
  "action": "send-slack-message",
  "input": {
    "channel": "#general",
    "text": "Hello from Nango!"
  }
}
```

**Response:**
```json
{
  "success": true,
  "result": {
    "ok": true,
    "channel": "C1234567890",
    "ts": "1234567890.123456"
  }
}
```

### Webhooks

#### `POST /webhook`
Receive webhooks from Nango for connection events.

**Supported Events:**
- `auth.creation` - New connection created
- `auth.override` - Connection re-authorized

The server automatically stores connection mappings in memory (replace with database in production).

## Project Structure

```
server/
├── index.js          # Main server file with all endpoints
├── package.json      # Dependencies and scripts
├── .env              # Environment variables (create this)
└── README.md         # This file
```

## Features

- ✅ Secure session token generation
- ✅ Webhook handling for connection events
- ✅ Connection management (create, check, delete, reconnect)
- ✅ Action triggering (send Slack messages, etc.)
- ✅ In-memory connection storage (ready for database migration)
- ✅ Comprehensive error handling
- ✅ CORS enabled for frontend integration

## Production Considerations

⚠️ **Important:** This demo uses in-memory storage for connections. For production:

1. **Replace in-memory storage** with a proper database (PostgreSQL, MongoDB, etc.)
2. **Add authentication/authorization** middleware
3. **Implement rate limiting**
4. **Add request validation** (consider using libraries like Joi or Zod)
5. **Set up proper logging** (Winston, Pino, etc.)
6. **Add monitoring and error tracking** (Sentry, etc.)
7. **Use environment-specific configuration**
8. **Add health check endpoints**

See the commented code in `index.js` for database integration examples.

## Troubleshooting

### Server won't start
- Check that port 3001 is not already in use
- Verify `.env` file exists and contains valid credentials
- Ensure all dependencies are installed (`npm install`)

### Connection errors
- Verify your `NANGO_SECRET_KEY` is correct
- Check that `NANGO_HOST` matches your environment
- Ensure the Slack integration is properly configured in Nango

### Webhook not receiving events
- Verify webhook URL is configured in Nango dashboard
- Check server logs for incoming webhook payloads
- Ensure webhook endpoint is publicly accessible (use ngrok for local testing)

## Dependencies

- `express` - Web framework
- `@nangohq/node` - Nango Node.js SDK
- `cors` - Cross-origin resource sharing
- `dotenv` - Environment variable management

## License

This is a demo project. Check with your organization for licensing requirements.
