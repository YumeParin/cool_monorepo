import dotenv from 'dotenv';
import express, { NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from '@/routes/auth.routes';
import postRoutes from '@/routes/post.routes';
import userRoutes from '@/routes/user.routes';
import serverRoutes from "@/routes/server.routes"
import { globalErrorHandler } from '@/middlewares/errorHandler';
import { AppError } from '@/utils/AppError';
import { corsConfig } from '@/config/corsConfig';
import { initWebSocket } from './services/websocket.service';
dotenv.config();
import { env } from './config/env';

const app = express();

app.use(cors(corsConfig));
app.use(express.json());
app.use(cookieParser());
app.use(express.json({ limit: '10kb' }));

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to Swissokyo !' });
});

// app.use("/auth", authRoutes);
// app.use("/posts", postRoutes);
// app.use("/users", userRoutes);
app.use("/servers", serverRoutes);


// Expres v5, use app.use((req,res,next)) instead of app.all(*) is standard
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

const PORT = env.PORT;
const server = app.listen(PORT, () => {
  console.log(`Server launched : http://localhost:${PORT}`);
});

initWebSocket(server);
