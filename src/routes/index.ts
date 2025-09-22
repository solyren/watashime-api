import { homeRoutes } from './home.route';
import { Hono } from 'hono';

export const setupRoutes = (app: Hono) => {
  homeRoutes(app);
};
