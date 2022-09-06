import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { signAccessToken, verifyAccessToken } from '../utils/jwtUtils';
import {
  InvalidException,
  CustomException,
  UnauthorizedException,
} from '../utils/errors';
import { ICreateToken } from '..//interfaces/token.interface';
import { IUser } from '..//interfaces/user.interface';
import { logger, store } from '../utils';
import {
  validateUser,
  findUserByEmail,
  updatePassword,
} from '../services/user.service';

export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  const user = await validateUser(email, password, next);

  if (!user) {
    return next(new (InvalidException as any)());
  }

  const createAccessToken: ICreateToken = {
    email: user.email,
    isRefreshToken: false,
  };
  const createRefreshToken: ICreateToken = {
    email: user.email,
    isRefreshToken: true,
  };

  const accessToken = await signAccessToken(createAccessToken, next);
  const refreshToken = await signAccessToken(createRefreshToken, next);
  req.session.isAuthenticated = refreshToken;
  return res.status(200).json({
    status: 'success',
    payload: { ...user, accessToken },
  });
};

export const forgotPasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.body;
  const user = await findUserByEmail(email, next);
  if (!user) {
    // This is returned like this to prevent hackers from confirming unregistered emails
    return res.status(200).json({
      status: 'success',
      payload: { message: 'Please check your mail' },
    });
  }
  const createAccessToken: ICreateToken = {
    email: user.email,
    isRefreshToken: false,
  };
  const token = await signAccessToken(createAccessToken, next);
  // We are supposed to send a mail to user here
  return res.status(200).json({
    status: 'success',
    payload: { token },
  });
};

export const resetPasswordController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const updatedUser = await updatePassword(email, password, next);
    if (updatedUser) {
      return res.status(200).json({
        status: 'success',
        payload: { message: 'Password updated successfully' },
      });
    }
    return next(new (CustomException as any)(500, 'Operation unsuccessful'));
  } catch (error: any) {
    logger.error(error.message);
    return next(new (CustomException as any)(500, 'Operation unsuccessful'));
  }
};

export const refreshTokenController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { isAuthenticated } = req.session;
  if (!isAuthenticated) return next(new (UnauthorizedException as any)());

  store.get(req.sessionID, async (err: any, foundUser: IUser) => {
    if (!foundUser) {
      return next(new (InvalidException as any)());
    }

    // evaluate jwt
    const decodedToken: JwtPayload | undefined = await verifyAccessToken(
      { token: isAuthenticated, isRefreshToken: true },
      next
    );
    if (decodedToken) {
      const createAccessToken: ICreateToken = {
        email: decodedToken.email,
        isRefreshToken: false,
      };
      const accessToken = await signAccessToken(createAccessToken, next);
      return res.status(200).json({
        status: 'success',
        payload: accessToken,
        message: 'Operation successful',
      });
    }
  });
};

export const logoutController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.session.destroy(err => {
    if (err) {
      logger.error(err.message);
      return next(new (CustomException as any)(500, 'Operation unsuccessful'));
    }
    return res.status(200).json({
      status: 'success',
      payload: { message: 'Operation successful' },
    });
  });
};
