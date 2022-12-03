import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../errors/Error.js';

const handleAuthError = (next) => next(new UnauthorizedError('Необходима авторизация'));

function extractBearerToken(header) {
  return header.replace('Bearer ', '');
}

export default function auth(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer')) {
    return handleAuthError(next);
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
    req.user = payload;
    return next();
  } catch (err) {
    return handleAuthError(next);
  }
}
