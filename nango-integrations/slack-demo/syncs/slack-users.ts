import { createSync } from 'nango';
import * as z from 'zod';

// Schema for each Slack user record saved by the sync
const SlackUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  real_name: z.string().optional(),
  image_72: z.string().optional()
});

export default createSync({
  // Human-friendly metadata for the sync
  description: 'Fetches Slack users',
  version: '1.0.1',
  endpoints: [{ method: 'GET', path: '/example/slack/users', group: 'Users' }],
  // Keep the demo simple with a periodic full sync
  frequency: 'every hour',
  syncType: 'full',
  // No extra input required for this sync
  metadata: z.void(),
  models: {
    SlackUser: SlackUserSchema
  },
  exec: async (nango) => {
    // Fetch all members from Slack (Web API endpoint)
    const response = await nango.get({ endpoint: '/users.list' });
    const members = response.data?.members || [];

    // Convert Slack payloads into the schema shape
    const records = members.map((u: any) => ({
      id: u.id,
      name: u.name,
      real_name: u.real_name,
      image_72: u.profile?.image_72
    }));

    // Persist the records to Nango's data store
    await nango.batchSave(records, 'SlackUser');
  }
});
