import rateLimit from 'express-rate-limit';

export const rateLimitMiddleware = (max: number, windowMs: number) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      error: 'Too many requests from this IP, please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};
