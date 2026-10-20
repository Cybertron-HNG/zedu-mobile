import { CLIENT_URL } from '@env';

// Web app origin used for links that open in the browser. Falls back to the
// production site when CLIENT_URL is not set; no trailing slash.
export const CLIENT_BASE_URL = (CLIENT_URL || 'https://zedu.chat').replace(
  /\/$/,
  '',
);
