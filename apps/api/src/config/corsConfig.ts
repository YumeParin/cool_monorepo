import { CorsOptions } from 'cors';
import dotenv from 'dotenv';

dotenv.config({ debug: true });

export const corsConfig: CorsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',

  credentials: true,

  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],

  allowedHeaders: ['Content-Type', 'Authorization'],
};
