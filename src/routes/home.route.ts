import { HomeController } from '../controllers/home.controller';
import { loggingMiddleware } from '../middleware/logging.middleware';
import { Hono } from 'hono';

export const homeRoutes = (app: Hono) => {
  // -- Home Route --
  app.get('/api/home', loggingMiddleware, HomeController.getHome);
};
