import { init, id } from '@instantdb/admin';

// ID for app: goals-app
const APP_ID = process.env.EXPO_PUBLIC_INSTANT_APP_ID!;
const ADMIN_TOKEN = process.env.INSTANT_APP_ADMIN_TOKEN!

if (!APP_ID || !ADMIN_TOKEN) {
  throw new Error('Missing InstantDB app ID or admin token');
}

export const serverDb = init({
  appId: APP_ID,
  adminToken: ADMIN_TOKEN, 
});