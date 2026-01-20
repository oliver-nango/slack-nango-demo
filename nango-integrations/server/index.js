// Demo server used inside nango-integrations workspace.
// Mirrors the root server but keeps the demo self-contained.
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Nango } from '@nangohq/node';

// Load environment variables from .env into process.env
dotenv.config();

const app = express();
// Allow the demo frontend to call this API from another origin
app.use(cors());
// Parse JSON request bodies into req.body
app.use(express.json());

// Nango client used to create sessions and trigger actions
const nango = new Nango({
  secretKey: process.env.NANGO_SECRET_KEY,
  host: process.env.NANGO_HOST
});

// In-memory store for connections (replace with your database in production)
const connections = new Map();

// 1. Generate a session token (backend)
app.post('/sessionToken', async (req, res) => {
  try {
    const { end_user, allowed_integrations, organization } = req.body;

    // Validate required fields
    if (!end_user || !end_user.id) {
      return res.status(400).json({ error: 'end_user.id is required' });
    }
    if (!allowed_integrations || !Array.isArray(allowed_integrations)) {
      return res.status(400).json({ 
        error: 'allowed_integrations must be an array' 
      });
    }

    // Ask Nango for a secure token
    const response = await nango.createConnectSession({
      end_user: {
        id: end_user.id,
        email: end_user.email,
        display_name: end_user.display_name,
        tags: end_user.tags || {}
      },
      organization: organization ? {
        id: organization.id,
        display_name: organization.display_name
      } : undefined,
      allowed_integrations: allowed_integrations
    });

    // Send this token back to your frontend
    res.status(200).json({
      sessionToken: response.data.token
    });
  } catch (err) {
    console.error('Error creating session token:', err);
    const status = err.status || err.statusCode || (err.response && err.response.status) || 500;
    res.status(status).json({ error: err.message || 'Failed to create session token' });
  }
});

// 3. Listen for webhooks & save the Connection ID (backend)
app.post('/webhook', async (req, res) => {
  try {
    // Log the full webhook payload for debugging
    console.log('Received webhook:', JSON.stringify(req.body, null, 2));

    const { 
      type, 
      operation, 
      success, 
      connectionId, 
      endUser,
      providerConfigKey 
    } = req.body;

    // Validate webhook structure
    if (!type || !operation) {
      console.warn('Invalid webhook: missing type or operation', req.body);
      return res.status(400).json({ error: 'Invalid webhook: missing type or operation' });
    }

    // Handle successful authorization webhooks
    if (type === 'auth' && operation === 'creation' && success) {
      // Persist the connectionId with the end user
      const userId = endUser?.endUserId;
      const endUserEmail = endUser?.endUserEmail;
      const tags = endUser?.tags || {};

      if (!connectionId) {
        console.error('Webhook missing connectionId:', req.body);
        return res.status(400).json({ error: 'Missing connectionId in webhook' });
      }

      if (!userId) {
        console.error('Webhook missing endUserId:', req.body);
        return res.status(400).json({ error: 'Missing endUserId in webhook' });
      }

      // Store connection mapping (replace with your database in production)
      if (!connections.has(userId)) {
        connections.set(userId, []);
      }

      const connectionData = {
        connectionId,
        providerConfigKey: providerConfigKey || req.body.providerConfigKey,
        endUserEmail,
        tags,
        createdAt: new Date().toISOString()
      };

      connections.get(userId).push(connectionData);

      console.log(`✅ Connection created: ${connectionId} for user: ${userId}`);
      console.log(`   Provider: ${connectionData.providerConfigKey}`);
      console.log(`   Email: ${endUserEmail || 'N/A'}`);
      console.log(`   Tags:`, tags);

      // In production, persist to your database here:
      // await db.connections.create({
      //   userId,
      //   connectionId,
      //   providerConfigKey: connectionData.providerConfigKey,
      //   endUserEmail,
      //   tags,
      //   createdAt: connectionData.createdAt
      // });

    } else if (type === 'auth' && operation === 'override' && success) {
      // Handle reconnection (operation = override per guide)
      const userId = endUser?.endUserId;
      const reconnectionConnectionId = connectionId || req.body.connectionId;

      if (!reconnectionConnectionId) {
        console.error('Reconnection webhook missing connectionId:', req.body);
        return res.status(400).json({ error: 'Missing connectionId in reconnection webhook' });
      }

      console.log(`✅ Connection re-authorized: ${reconnectionConnectionId} for user: ${userId || 'N/A'}`);

      // In production, update your database here:
      // await db.connections.update({
      //   where: { connectionId: reconnectionConnectionId },
      //   data: { 
      //     reauthorizedAt: new Date().toISOString(),
      //     // Update any other fields as needed
      //   }
      // });

    } else {
      // Log other webhook types for debugging
      console.log(`ℹ️  Received webhook: type=${type}, operation=${operation}, success=${success}`);
    }

    // Always return 200 to acknowledge receipt
    res.status(200).json({ received: true });
  } catch (err) {
    console.error('❌ Error handling webhook:', err);
    console.error('Webhook payload:', JSON.stringify(req.body, null, 2));
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
});

// Re-authorize an existing connection
app.post('/sessionToken/reconnect', async (req, res) => {
  try {
    const { connection_id, integration_id } = req.body;

    if (!connection_id || !integration_id) {
      return res.status(400).json({ 
        error: 'connection_id and integration_id are required' 
      });
    }

    // Ask Nango for a secure token to reconnect
    const response = await nango.createReconnectSession({
      connection_id,
      integration_id
    });

    // Send this token back to your frontend
    res.status(200).json({
      sessionToken: response.data.token
    });
  } catch (err) {
    console.error('Error creating reconnect session token:', err);
    const status = err.status || err.statusCode || (err.response && err.response.status) || 500;
    res.status(status).json({ error: err.message || 'Failed to create reconnect session token' });
  }
});

// Check connection status
app.get('/connection/:connectionId', async (req, res) => {
  try {
    const { connectionId } = req.params;
    const { provider_config_key } = req.query;

    if (!provider_config_key) {
      return res.status(400).json({ 
        error: 'provider_config_key query parameter is required' 
      });
    }

    // Check connection status
    const connection = await nango.getConnection(provider_config_key, connectionId);
    // Connection is valid - display normal settings
    res.status(200).json(connection);
  } catch (error) {
    // Connection is invalid - display error and reconnect button
    if (error.status >= 400 && error.status < 500) {
      res.status(error.status || 400).json({ 
        error: 'Connection is invalid',
        valid: false 
      });
    } else {
      console.error('Error checking connection:', error);
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }
});

// Delete a connection
app.delete('/connection', async (req, res) => {
  try {
    const { connection_id, provider_config_key } = req.body;

    if (!connection_id) {
      return res.status(400).json({ 
        error: 'connection_id is required in request body' 
      });
    }

    if (!provider_config_key) {
      return res.status(400).json({ 
        error: 'provider_config_key is required in request body' 
      });
    }

    // Delete the connection from Nango
    await nango.deleteConnection(provider_config_key, connection_id);

    // Also remove from local storage (replace with database cleanup in production)
    for (const [userId, userConnections] of connections.entries()) {
      const filtered = userConnections.filter(conn => conn.connectionId !== connection_id);
      if (filtered.length !== userConnections.length) {
        connections.set(userId, filtered);
        console.log(`🗑️  Removed connection ${connection_id} from user ${userId}`);
        break;
      }
    }

    res.status(200).json({ 
      success: true,
      message: 'Connection deleted successfully' 
    });
  } catch (err) {
    console.error('Error deleting connection:', err);
    const status = err.status || err.statusCode || (err.response && err.response.status) || 500;
    res.status(status).json({ error: err.message || 'Failed to delete connection' });
  }
});

// Get connections for a user (helper endpoint)
app.get('/connections/:userId', (req, res) => {
  const { userId } = req.params;
  const userConnections = connections.get(userId) || [];
  res.json({ connections: userConnections });
});

// Trigger an action synchronously
app.post('/action/trigger', async (req, res) => {
  try {
    const { 
      connectionId, 
      providerConfigKey, 
      action, 
      input 
    } = req.body;

    // Validate required fields
    if (!connectionId) {
      return res.status(400).json({ 
        error: 'connectionId is required' 
      });
    }

    if (!providerConfigKey) {
      return res.status(400).json({ 
        error: 'providerConfigKey is required' 
      });
    }

    if (!action) {
      return res.status(400).json({ 
        error: 'action is required' 
      });
    }

    if (!input || typeof input !== 'object') {
      return res.status(400).json({ 
        error: 'input is required and must be an object' 
      });
    }

    // Useful tracing in a demo setting
    console.log(`🚀 Triggering action: ${action}`);
    console.log(`   Connection: ${connectionId}`);
    console.log(`   Integration: ${providerConfigKey}`);
    console.log(`   Input:`, input);

    // Trigger the action synchronously using Nango Node SDK
    const result = await nango.triggerAction(
      providerConfigKey,
      connectionId,
      action,
      input
    );

    console.log(`✅ Action completed successfully: ${action}`);

    // Return the result from the action
    res.status(200).json({
      success: true,
      result: result
    });
  } catch (err) {
    console.error('❌ Error triggering action:', err);
    const status = err.status || err.statusCode || (err.response && err.response.status) || 500;
    res.status(status).json({ 
      error: err.message || 'Failed to trigger action',
      details: err.response?.data || err.data || undefined
    });
  }
});

// Start the demo API on the default port
app.listen(3001, () => {
  console.log('Backend running on http://localhost:3001');
});
