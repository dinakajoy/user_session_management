import { Request, Response, NextFunction } from 'express';
import { createUser, findUserById, findUsers, updateUser, deleteUser } from '../services/user.service';
import { CustomException } from '../utils/errors';
import { logger } from '../utils';

export const createUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await createUser(req.body, next);
    if (user) {
      return res.status(201).json({
        status: 'success',
        payload: user,
      });
    }
  } catch (error: any) {
    logger.error(error.message);
    return next(new (CustomException as any)(500, 'Operation unsuccessful'));
  }
};

export const getUsersController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const users = await findUsers(next);
    if (users) {
      return res.status(200).json({
        status: 'success',
        payload: users,
      });
    }
  } catch (error: any) {
    logger.error(error.message);
    return next(new (CustomException as any)(500, 'Operation unsuccessful'));
  }
};

export const getUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await findUserById(req?.params?.userId as string || '', next);
    if (user) {
      return res.status(200).json({
        status: 'success',
        payload: user,
      });
    }
  } catch (error: any) {
    logger.error(error.message);
    return next(new (CustomException as any)(500, 'Operation unsuccessful'));
  }
};

export const updateUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await updateUser(req?.params?.userId as string, req.body, next);
    if (user) {
      return res.status(200).json({
        status: 'success',
        payload: user,
      });
    }
    return next(new (CustomException as any)(500, 'Operation unsuccessful'));
  } catch (error: any) {
    logger.error(error.message);
    return next(new (CustomException as any)(500, 'Operation unsuccessful'));
  }
};

export const deleteUserController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await deleteUser(req?.params?.userId as string || '', next);
    if (user) {
      return res.status(201).json({
        status: 'success',
        payload: { message: `${user.name} deleted successfully`},
      });
    }
  } catch (error: any) {
    logger.error(error.message);
    return next(new (CustomException as any)(500, 'Operation unsuccessful'));
  }
};
