import { Hono } from 'hono';
import { setupRoutes } from './routes';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = new Hono();

// -- Root Route --
app.get('/', (c) => {
  return c.json({
    message: 'Selamat datang di API Scraper Anime!',
    version: '1.0.0',
    author: 'WatashiMe',
  });
});

setupRoutes(app);

// -- Logging Server Start --
console.log('Server berjalan di http://localhost:3000');

export default app;
