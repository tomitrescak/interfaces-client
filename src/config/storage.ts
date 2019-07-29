import { ServerStorage } from '@toryjs/ui';

export const storage = new ServerStorage(
  process.env.NODE_ENV !== 'development' ? '/api' : 'http://localhost:4000/api',
  'default',
  ''
);
