import type { Hono } from 'hono';

import { homeRoutes } from './home.route';

export const setupRoutes = (app: Hono): void => {
  homeRoutes(app);
};
