/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-unused-vars */
import { NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv-safe';
import logger from '../utils/logger';
import { CustomException } from './errors';
import { ICreateToken, IVerifyToken } from '../interfaces/token.interface';

dotenv.config();

const accessTokenSecret: string =
  process.env.ACCESS_TOKEN_SECRET || 'J6sqQuxISZfVfS+7/bWTtX';

const refreshTokenSecret: string =
  process.env.REFRESH_TOKEN_SECRET || 'J6sqQuxISZfVfS+7/bWTtX';

const saltGen: number = +`${process.env.SALT_GEN}` || 5;

export const signAccessToken = (
  payload: ICreateToken,
  next: NextFunction
): Promise<string | undefined> =>
  new Promise((resolve, reject) => {
    jwt.sign(
      { payload: payload.employeeInfo },
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
  new Promise((resolve, reject) => {
    jwt.verify(
      tokenData.token,
      tokenData.isRefreshToken ? refreshTokenSecret : accessTokenSecret,
      (err: any, payload) => {
        if (err) {
          logger.error(err.message);
          next(new (CustomException as any)(500, err.message));
        }
        resolve(payload);
      }
    );
  });
