import 'reflect-metadata';
import { AppDataSource } from './data-source';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import express, { Application, Request, Response } from 'express';
import route from './routes';
import middleware from './middleware';
import dotenv from 'dotenv';
dotenv.config();

const PORT = Number(process.env.PORT) || 3001;

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: 'http://localhost:3000',
  })
);

app.use('/register', route.registerRouter);
app.use('/login', route.loginRouter);
app.use('/refresh', route.refreshRouter);
app.use('/logout', route.logoutRouter);

app.use(middleware.verifyJwt);

app.use('/api/users', route.userRouter);
app.use('/api/projects', route.projectRouter);
app.use('/api/projects', route.bugRouter);
app.use('/api/projects', route.commentRouter);

app.get('/', (_req: Request, res: Response) => {
  return res.send('Hello Wold');
});

app.use(middleware.notFound);
app.use(middleware.errorHandler);

const startServer = async (): Promise<void> => {
  try {
    await AppDataSource.initialize();
    console.log('Data Source has been initialized!');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}...`);
    });
  } catch (error) {
    console.error('Error during Data Source initialization:', error);
    process.exit(1);
  }
};

startServer();
