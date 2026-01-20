import { createAction } from 'nango';
import * as z from 'zod';

// Input validation schema for the action payload
const SendSlackMessageInput = z.object({
  channel: z.string(),
  text: z.string()
});

// Output validation schema to keep action responses consistent
const SendSlackMessageOutput = z.object({
  ok: z.boolean(),
  channel: z.string(),
  ts: z.string()
});

export default createAction({
  // Metadata used by Nango UI + docs
  description: 'Send a message to a Slack channel',
  version: '1.0.0',
  // This endpoint is exposed by Nango when the action is deployed
  endpoint: { method: 'POST', path: '/example/slack/message', group: 'Messages' },
  input: SendSlackMessageInput,
  output: SendSlackMessageOutput,
  exec: async (nango, input) => {
    // Extract validated inputs
    const { channel, text } = input;

    // Call Slack's chat.postMessage API via the Nango proxy
    const response = await nango.post({
      endpoint: '/chat.postMessage',
      data: { channel, text }
    });

    // Return raw Slack response (filtered by output schema)
    return response.data;
  }
});