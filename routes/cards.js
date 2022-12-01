import { Router } from 'express';
import {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} from '../controllers/cards.js';
import auth from '../middlewares/auth.js';
import { validateCreateCard, validateGetCardById } from '../validation/cards.js';

const routerCard = Router();

routerCard.get('/', auth, getCards);
routerCard.post('/', validateCreateCard, auth, createCard);
routerCard.delete('/:cardId', validateGetCardById, auth, deleteCard);
routerCard.put('/:cardId/likes', validateGetCardById, auth, likeCard);
routerCard.delete('/:cardId/likes', validateGetCardById, auth, dislikeCard);

export default routerCard;
