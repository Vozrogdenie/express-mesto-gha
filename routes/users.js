import { Router } from 'express';
import {
  getUsers,
  createUser,
  getUserById,
  newAvatar,
  newProfile,
} from '../controllers/users.js';

const routerUser = Router();

routerUser.get('/', getUsers);
routerUser.get('/:userId', getUserById);
routerUser.post('/', createUser);
routerUser.patch('/me', newProfile);
routerUser.patch('/me/avatar', newAvatar);

export default routerUser;
