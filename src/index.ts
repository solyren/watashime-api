import { Hono } from 'hono';

const app = new Hono();

// -- Root Route --
app.get('/', (c) => {
  return c.json({
    message: 'Selamat datang di API Scraper Anime!',
    version: '1.0.0',
    author: 'WatashiMe',
  });
});

console.log('Server berjalan di http://localhost:3000');

export default app;
