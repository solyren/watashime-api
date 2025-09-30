import type { Context, Next } from 'hono';

import { logger } from '../utils/logger';

export const loggingMiddleware = async (
  c: Context,
  next: Next
): Promise<void> => {
  const start = Date.now();
  logger(`[Middleware] Request: ${c.req.method} ${c.req.path}`);

  await next();

  const ms = Date.now() - start;
  logger(`[Middleware] Response: ${c.res.status} ${c.req.path} - ${ms}ms`);
};
