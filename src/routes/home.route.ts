import type { Hono } from 'hono';

import { HomeController } from '../controllers/home.controller';
import { loggingMiddleware } from '../middleware/logging.middleware';

export const homeRoutes = (app: Hono): void => {
  // -- Home Route --
  app.get('/api/home', loggingMiddleware, HomeController.getHome);
};
