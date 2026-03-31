import { HttpStatusCodes, HttpStatusPhrases } from "@repo/shared";

export default class HttpError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class Error500 extends HttpError {
  constructor(message: string = HttpStatusPhrases.INTERNAL_SERVER_ERROR) {
    super(HttpStatusCodes.INTERNAL_SERVER_ERROR, message);
  }
}
