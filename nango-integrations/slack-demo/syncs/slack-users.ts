import { createSync } from 'nango';
import * as z from 'zod';

const SlackUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  real_name: z.string().optional(),
  image_72: z.string().optional()
});

export default createSync({
  description: 'Fetches Slack users',
  version: '1.0.0',
  endpoints: [{ method: 'GET', path: '/example/slack/users', group: 'Users' }],
  frequency: 'every hour',
  syncType: 'full',
  metadata: z.void(),
  models: {
    SlackUser: SlackUserSchema
  },
  exec: async (nango) => {
    const response = await nango.get({ endpoint: '/api/users.list' });
    const members = response.data?.members || [];

    const records = members.map((u: any) => ({
      id: u.id,
      name: u.name,
      real_name: u.real_name,
      image_72: u.profile?.image_72
    }));

    await nango.batchSave(records, 'SlackUser');
  }
});
