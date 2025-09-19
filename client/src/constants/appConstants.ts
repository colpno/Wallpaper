import { Method } from 'axios';

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
};

export type RequestMethod = Extract<Method, 'GET' | 'POST' | 'PUT' | 'DELETE'>;
export const REQUEST_METHODS: Record<RequestMethod, RequestMethod> = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
};

export const EMAILS = {
  HELPER: 'helper@mail.com',
};
