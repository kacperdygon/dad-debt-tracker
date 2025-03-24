import { Request } from 'express';
import { IAuthDocument } from '@/api/models/authModel';

declare module 'express-serve-static-core' {
  interface Request {
    auth: IAuthDocument;
  }
}