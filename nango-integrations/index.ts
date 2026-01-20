// Nango entrypoint: import each integration module so it is registered.
// This file is referenced by Nango during build/deploy.
import './slack-demo/syncs/slack-users.js';
import './slack-demo/actions/send-slack-message.js';
