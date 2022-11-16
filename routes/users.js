import { Router } from "express";
import {
  getUsers,
  createUser,
  userId,
  newAvatar,
  newProfile
} from "../controllers/users.js"

export const router = Router();

router.get('/users', getUsers);
router.get('/users/:userId', userId);
router.post('/users', createUser);
router.patch('/users/me', newAvatar);
router.patch('/users/me/avatar', newProfile);