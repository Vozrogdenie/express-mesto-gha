import jwt from 'jsonwebtoken';

const handleAuthError = (res) => {
  res
    .status(401)
    .send({ message: 'Необходима авторизация' });
};

function extractBearerToken(header) {
  return header.replace('Bearer ', '');
}

export default function auth(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization || !authorization.contains('Bearer')) {
    return handleAuthError(res);
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    return handleAuthError(res);
  }

  req.user = payload;
  return next();
}
