import { Auth } from '@/backend/api/models/authModel';

export const getRoleByPin = async (pin: string): Promise<string | null> => {
  const existingDoc = await Auth.findOne({ pin });
  if (!existingDoc || !existingDoc.role) {
    return null;
  } else {
    return existingDoc.role;
  }
}