import { createAction } from 'nango';
import * as z from 'zod';

const SendSlackMessageInput = z.object({
  channel: z.string(),
  text: z.string()
});

const SendSlackMessageOutput = z.object({
  ok: z.boolean(),
  channel: z.string(),
  ts: z.string()
});

export default createAction({
  description: 'Send a message to a Slack channel',
  version: '1.0.0',
  endpoint: { method: 'POST', path: '/example/slack/message', group: 'Messages' },
  input: SendSlackMessageInput,
  output: SendSlackMessageOutput,
  exec: async (nango, input) => {
    const { channel, text } = input;

    const response = await nango.post({
      endpoint: '/chat.postMessage',
      data: { channel, text }
    });

    return response.data;
  }
});