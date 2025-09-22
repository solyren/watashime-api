import { HomeController } from '../controllers/home.controller';
import { loggingMiddleware } from '../middleware/logging.middleware';

export const homeRoutes = (app: any) => {
  // -- Home Route --
  app.get('/api/home', loggingMiddleware, HomeController.getHome);
};