import * as express from 'express';
import isAuthenticated from '../middlewares/isAuthenticated';
import acountLimiter from '../middlewares/rateLimiter';
import {
  userValidation,
  validate,
} from '../validations/user.validation';
import {
  createUserController,
  getUsersController,
  getUserController,
  updateUserController,
  deleteUserController,
} from '../controllers/user.controlller';

const router = express.Router();

router.get(
  '/',
  getUsersController
);
router.get(
  '/:userId',
  getUserController
);
router.post(
  '/',
  acountLimiter,
  userValidation(),
  validate,
  createUserController
);
router.put(
  '/:userId',
  userValidation(),
  validate,
  isAuthenticated,
  updateUserController
);
router.delete(
  '/:userId',
  acountLimiter,
  deleteUserController
);

export default router;
