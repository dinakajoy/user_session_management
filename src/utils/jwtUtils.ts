import { NextFunction } from 'express';
import config from 'config';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv-safe';
import logger from '../utils/logger';
import { CustomException } from './errors';
import { ICreateToken, IVerifyToken } from '../interfaces/token.interface';

dotenv.config();

const accessTokenSecret = config.get('jwt.accessTokenSecret') as string;
const refreshTokenSecret = config.get('jwt.refreshTokenSecret') as string;

export const signAccessToken = (
  payload: ICreateToken,
  next: NextFunction
): Promise<string | undefined> =>
  new Promise((resolve, _) => {
    jwt.sign(
      { payload },
      payload.isRefreshToken ? refreshTokenSecret : accessTokenSecret,
      { expiresIn: payload.isRefreshToken ? '3d' : '30m' },
      (err, token) => {
        if (err) {
          logger.error(err.message);
          next(new (CustomException as any)(500, 'Unsuccessful operation'));
        }
        resolve(token);
      }
    );
  });

export const verifyAccessToken = (
  tokenData: IVerifyToken,
  next: NextFunction
): Promise<JwtPayload | undefined> =>
  new Promise((resolve, _) => {
    try {
      const jwtRespone = jwt.verify(
        tokenData.token,
        tokenData.isRefreshToken ? refreshTokenSecret : accessTokenSecret
      ) as JwtPayload;
      resolve(jwtRespone);
    } catch (err: any) {
      logger.error(err.message);
      next(new (CustomException as any)(500, err.message));
    }
  });
