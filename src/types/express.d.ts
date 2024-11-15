import { Request } from 'express';

interface UserPayload {
  id: string;
  email: string;
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: UserPayload;
  }
}