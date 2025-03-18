import { Auth } from '@/backend/api/models/authModel';

export const getRoleByPin = async (pin: string | undefined): Promise<string | null> => {
  if (!pin) return null;
  const existingDoc = await Auth.findOne({ pin });
  if (!existingDoc || !existingDoc.role) {
    return null;
  } else {
    return existingDoc.role;
  }
}