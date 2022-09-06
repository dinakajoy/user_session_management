import { Request, Response, NextFunction } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { logger } from '../utils';
import { verifyAccessToken } from '../utils/jwtUtils';
import { isUser } from '../services/user.service';
import {
  InvalidException,
  NotFoundException,
  CustomException,
} from '../utils/errors';

const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const tokenExist = req.headers['authorization'];
  if (!tokenExist) {
    next(new (NotFoundException as any)());
  } else {
    try {
      const token = tokenExist.split(' ')[1];
      const decodedToken: JwtPayload | undefined = await verifyAccessToken(
        { token, isRefreshToken: false },
        next
      );
      if (decodedToken) {
        const userEmail = decodedToken.payload.email;
        const result = await isUser(userEmail, next);
        if (!result) {
          next(new (InvalidException as any)());
        }
        req.body.email = userEmail;
        next();
      } else {
        next(new (InvalidException as any)());
      }
    } catch (error: any) {
      logger.error(error.message);
      next(new (CustomException as any)(403, 'Operation unsuccessful'));
    }
  }
};

export default isAuthenticated;
