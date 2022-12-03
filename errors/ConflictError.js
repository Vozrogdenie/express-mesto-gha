/* eslint-disable import/prefer-default-export */
import { constants } from 'http2';

export class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ConflictError';
    this.statusCode = constants.HTTP_STATUS_CONFLICT;
  }
}
