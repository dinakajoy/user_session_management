import express, { Express, Request, Response, NextFunction } from 'express';
import session from 'express-session';
import createError from 'http-errors';
import compression from 'compression';
import cors from 'cors';
import config from 'config';
import dotenv from "dotenv-safe";
import authRoute from './routes/auth.route';
import userRoute from './routes/user.route';
import { connectDB, logger, corsOptions, store } from './utils';

dotenv.config();

declare module 'express-session' {
  interface SessionData {
    isAuthenticated: string | any;
  }
}

const port = config.get('environment.port') as number;
const host = config.get('environment.host') as string;
const sessionSecret = config.get('session.secret') as string;

const app: Express = express();

app.use(cors(corsOptions));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: sessionSecret,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 1, // 1 day
      secure: process.env.NODE_ENV === 'production',
      httpOnly: process.env.NODE_ENV === 'production',
    },
    resave: false,
    saveUninitialized: false,
    store,
  })
);

app.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.send({ message: 'Welcome 🐻' });
});

app.get("/healthcheck", (req: Request, res: Response) => res.sendStatus(200));

app.use('/auth', authRoute);
app.use('/api/users', userRoute);

// catch 404 and forward to error handler
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new createError.NotFound());
});

// error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) =>
  res.status(err.status || 500).json({
    status: 'error',
    errors: err.message,
  })
);

app.listen(port, host, () => {
  logger.info(`Server running on ${host}/${port}`);
  connectDB();
});
