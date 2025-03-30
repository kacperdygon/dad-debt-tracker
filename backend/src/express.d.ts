import { IAuthDocument } from '@/api/models/authModel';

declare module 'express-serve-static-core' {
  interface Request {
    auth: IAuthDocument;
  }
}