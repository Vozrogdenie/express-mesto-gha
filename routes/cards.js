import { Router } from 'express';
import {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} from '../controllers/cards.js';
import auth from '../middlewares/auth.js';

const routerCard = Router();

routerCard.get('/', auth, getCards);
routerCard.post('/', auth, createCard);
routerCard.delete('/:cardId', auth, deleteCard);
routerCard.put('/:cardId/likes', auth, likeCard);
routerCard.delete('/:cardId/likes', auth, dislikeCard);

export default routerCard;
