export class AppError extends Error {
  isOperational: boolean;
  constructor(message: string) {
    super(message);
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}
