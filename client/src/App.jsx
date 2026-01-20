import { useState } from 'react';
import Nango from '@nangohq/frontend';

const nango = new Nango();

export default function App() {
  const [connectionId, setConnectionId] = useState(localStorage.getItem('connectionId') || null);
  const [error, setError] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  
  // Action trigger state
  const [channel, setChannel] = useState('#general');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [actionResult, setActionResult] = useState(null);

  // 2. Trigger the auth flow (frontend)
  const connectSlack = async () => {
    try {
      setError(null);
      setIsConnecting(true);

      // Open Connect UI FIRST
      const connect = nango.openConnectUI({
        onEvent: (event) => {
          if (event.type === 'close') {
            // Handle modal closed
            setIsConnecting(false);
            console.log('Connection modal closed');
          } else if (event.type === 'connect') {
            // Handle auth flow successful
            // Note: In production, rely on webhooks instead of frontend event
            const newConnectionId = event.payload.connectionId;
            setConnectionId(newConnectionId);
            localStorage.setItem('connectionId', newConnectionId);
            setIsConnecting(false);
            console.log('Connected!', event.payload);
          }
        }
      });

      // Retrieve the session token from your backend
      const res = await fetch('http://localhost:3001/sessionToken', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          end_user: {
            id: 'demo-user-123', // Replace with actual user ID from your auth system
            email: 'user@example.com', // Optional
            display_name: 'Demo User', // Optional
            tags: { organizationId: 'org-123' } // Optional
          },
          allowed_integrations: ['slack-demo'] // Integration ID from nango.yaml
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to fetch session token');
      }

      const { sessionToken } = await res.json();

      // A loading indicator is shown until this is set
      connect.setSessionToken(sessionToken);
    } catch (err) {
      console.error('Connection error:', err);
      setError(err.message);
      setIsConnecting(false);
    }
  };

  // Re-authorize an existing connection
  const reconnectSlack = async () => {
    try {
      setError(null);
      setIsConnecting(true);

      if (!connectionId) {
        throw new Error('No connection ID found');
      }

      const connect = nango.openConnectUI({
        onEvent: (event) => {
          if (event.type === 'close') {
            setIsConnecting(false);
            console.log('Reconnection modal closed');
          } else if (event.type === 'connect') {
            setIsConnecting(false);
            console.log('Reconnected!', event.payload);
          }
        }
      });

      // Get reconnect session token from backend
      const res = await fetch('http://localhost:3001/sessionToken/reconnect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          connection_id: connectionId,
          integration_id: 'slack-demo' // Integration ID from nango.yaml
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to fetch reconnect session token');
      }

      const { sessionToken } = await res.json();
      connect.setSessionToken(sessionToken);
    } catch (err) {
      console.error('Reconnection error:', err);
      setError(err.message);
      setIsConnecting(false);
    }
  };

  // Check if connection is valid
  const checkConnection = async () => {
    try {
      if (!connectionId) {
        setError('No connection ID found');
        return;
      }

      const res = await fetch(
        `http://localhost:3001/connection/${connectionId}?provider_config_key=slack-demo`
      );

      if (!res.ok) {
        const data = await res.json();
        if (data.valid === false) {
          setError('Connection is invalid. Please reconnect.');
          setConnectionId(null);
          localStorage.removeItem('connectionId');
        } else {
          throw new Error(data.error || 'Failed to check connection');
        }
      } else {
        const connection = await res.json();
        console.log('Connection is valid:', connection);
        alert('Connection is valid!');
      }
    } catch (err) {
      console.error('Error checking connection:', err);
      setError(err.message);
    }
  };

  // Delete connection from Nango and clear local state
  const deleteConnection = async () => {
    try {
      if (!connectionId) {
        setError('No connection ID found');
        return;
      }

      setError(null);
      
      // Delete from Nango via backend
      const res = await fetch('http://localhost:3001/connection', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          connection_id: connectionId,
          provider_config_key: 'slack-demo'
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to delete connection');
      }

      // Clear local state
      setConnectionId(null);
      localStorage.removeItem('connectionId');
      console.log('Connection deleted successfully');
    } catch (err) {
      console.error('Error deleting connection:', err);
      setError(err.message);
    }
  };

  // Trigger action to send Slack message
  const sendSlackMessage = async (e) => {
    e.preventDefault();
    
    if (!connectionId) {
      setError('Please connect to Slack first');
      return;
    }

    if (!channel || !message.trim()) {
      setError('Please provide both channel and message');
      return;
    }

    try {
      setError(null);
      setIsSending(true);
      setActionResult(null);

      const res = await fetch('http://localhost:3001/action/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          connectionId: connectionId,
          providerConfigKey: 'slack-demo',
          action: 'send-slack-message',
          input: {
            channel: channel,
            text: message
          }
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      setActionResult(data.result);
      setMessage(''); // Clear message on success
      console.log('✅ Message sent successfully:', data.result);
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err.message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Nango Slack Demo</h1>

      {error && (
        <div style={{ 
          padding: 12, 
          marginBottom: 20, 
          backgroundColor: '#fee', 
          border: '1px solid #fcc',
          borderRadius: 4
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {connectionId ? (
        <div>
          <p>Connected! Connection ID: {connectionId}</p>
          <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
            <button onClick={checkConnection} disabled={isConnecting}>
              Check Connection
            </button>
            <button onClick={reconnectSlack} disabled={isConnecting}>
              {isConnecting ? 'Reconnecting...' : 'Reconnect Slack'}
            </button>
            <button onClick={deleteConnection}>
              Delete Connection
            </button>
          </div>
        </div>
      ) : (
        <button onClick={connectSlack} disabled={isConnecting}>
          {isConnecting ? 'Connecting...' : 'Connect Slack'}
        </button>
      )}

      <hr />

      {connectionId ? (
        <div style={{ marginTop: 30 }}>
          <h2>Send Slack Message</h2>
          <form onSubmit={sendSlackMessage} style={{ marginTop: 20 }}>
            <div style={{ marginBottom: 15 }}>
              <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>
                Channel:
              </label>
              <input
                type="text"
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
                placeholder="#general"
                style={{
                  width: '100%',
                  maxWidth: 400,
                  padding: 8,
                  fontSize: 14,
                  border: '1px solid #ccc',
                  borderRadius: 4
                }}
                required
              />
            </div>
            
            <div style={{ marginBottom: 15 }}>
              <label style={{ display: 'block', marginBottom: 5, fontWeight: 'bold' }}>
                Message:
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter your message here..."
                rows={4}
                style={{
                  width: '100%',
                  maxWidth: 400,
                  padding: 8,
                  fontSize: 14,
                  border: '1px solid #ccc',
                  borderRadius: 4,
                  fontFamily: 'inherit'
                }}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSending || !channel || !message.trim()}
              style={{
                padding: '10px 20px',
                fontSize: 16,
                backgroundColor: isSending ? '#ccc' : '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: 4,
                cursor: isSending ? 'not-allowed' : 'pointer'
              }}
            >
              {isSending ? 'Sending...' : 'Send Message'}
            </button>
          </form>

          {actionResult && (
            <div style={{
              marginTop: 20,
              padding: 12,
              backgroundColor: '#000000',
              border: '2px solid #4CAF50',
              borderRadius: 4
            }}>
              <strong style={{ color: '#4CAF50' }}>✅ Message sent successfully!</strong>
              <pre style={{ marginTop: 8, fontSize: 12, overflow: 'auto', color: '#4CAF50' }}>
                {JSON.stringify(actionResult, null, 2)}
              </pre>
            </div>
          )}
        </div>
      ) : (
        <div style={{ marginTop: 30 }}>
          <p style={{ color: '#666' }}>
            Connect to Slack first to send messages
          </p>
        </div>
      )}
    </div>
  );
}
