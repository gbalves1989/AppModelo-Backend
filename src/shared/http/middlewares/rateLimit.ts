import { rateLimit } from 'express-rate-limit'

import { app } from '../app'

export const limit = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
})
