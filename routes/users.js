import { Router } from 'express';
import {
  getUsers,
  createUser,
  getUserById,
  setNewAvatar,
  updateProfile,
} from '../controllers/users.js';
import auth from '../middlewares/auth.js';

const routerUser = Router();

routerUser.get('/', auth, getUsers);
routerUser.get('/:userId', auth, getUserById);
routerUser.post('/', auth, createUser);
routerUser.patch('/me', auth, updateProfile);
routerUser.patch('/me/avatar', auth, setNewAvatar);

export default routerUser;
