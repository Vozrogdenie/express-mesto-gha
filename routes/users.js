import { Router } from 'express';
import {
  getUsers,
  createUser,
  getUserById,
  setNewAvatar,
  updateProfile,
} from '../controllers/users.js';

const routerUser = Router();

routerUser.get('/', getUsers);
routerUser.get('/:userId', getUserById);
routerUser.post('/', createUser);
routerUser.patch('/me', updateProfile);
routerUser.patch('/me/avatar', setNewAvatar);

export default routerUser;
